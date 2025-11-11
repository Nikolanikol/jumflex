"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Edit2, Trash2, Send } from "lucide-react";
import { ProductComment } from "@/types/reviews";

interface CommentsSectionProps {
  productId: string;
}

export default function CommentsSection({ productId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Необходимо войти в систему для добавления комментария");
      return;
    }

    if (newComment.trim().length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          comment: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        await loadComments();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при добавлении комментария");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Ошибка при добавлении комментария");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (editText.trim().length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editText }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditText("");
        await loadComments();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при обновлении комментария");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Ошибка при обновлении комментария");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Вы уверены, что хотите удалить комментарий?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/edit`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadComments();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при удалении комментария");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Ошибка при удалении комментария");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-dark-light rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Комментарии ({comments.length})
      </h3>

      {/* Форма добавления комментария */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-white placeholder-gray-500"
            rows={3}
            disabled={loading}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || newComment.trim().length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Отправить
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-dark rounded-lg text-center text-secondary border border-gray-800">
          Войдите, чтобы оставить комментарий
        </div>
      )}

      {/* Список комментариев */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors bg-dark"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-white">
                    {comment.user?.name || "Пользователь"}
                  </p>
                  <p className="text-sm text-secondary">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {session?.user?.email === comment.user?.email && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditText(comment.comment);
                      }}
                      className="p-1 text-secondary hover:text-primary transition-colors"
                      disabled={loading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 text-secondary hover:text-red-500 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-white"
                    rows={3}
                    disabled={loading}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      disabled={loading || editText.trim().length === 0}
                      className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark disabled:opacity-50 transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white whitespace-pre-wrap">
                  {comment.comment}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-secondary py-8">
            Пока нет комментариев. Будьте первым!
          </div>
        )}
      </div>
    </div>
  );
}
