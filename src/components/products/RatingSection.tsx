"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, CheckCircle } from "lucide-react";
import { RatingStats } from "@/types/reviews";
import toast from "react-hot-toast";

interface RatingSectionProps {
  productId: string;
}

export default function RatingSection({ productId }: RatingSectionProps) {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingUserRating, setLoadingUserRating] = useState(false);

  // Загружаем статистику
  useEffect(() => {
    console.log("📊 Loading rating stats for product:", productId);
    loadRatingStats();
  }, [productId]);

  // Загружаем рейтинг пользователя отдельно
  useEffect(() => {
    console.log("👤 Session status:", status, "Email:", session?.user?.email);
    if (status === "authenticated" && session?.user?.email) {
      console.log("✅ Loading user rating...");
      loadUserRating();
    } else if (status === "unauthenticated") {
      console.log("❌ User not authenticated");
      setUserRating(null);
    }
  }, [status, session?.user?.email, productId]);

  const loadRatingStats = async () => {
    try {
      const response = await fetch(`/api/ratings/${productId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("📊 Rating stats loaded:", data);
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const loadUserRating = async () => {
    setLoadingUserRating(true);
    try {
      console.log("🔍 Fetching user rating for product:", productId);
      const response = await fetch(`/api/ratings/user/${productId}`);
      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User rating loaded:", data);
        setUserRating(data.rating);
      } else {
        console.log("❌ Failed to load user rating:", response.status);
      }
    } catch (error) {
      console.error("Error loading user rating:", error);
    } finally {
      setLoadingUserRating(false);
    }
  };

  const handleRatingClick = async (rating: number) => {
    if (!session) {
      toast.error("Необходимо войти в систему для оценки товара");

      return;
    }

    if (userRating !== null) {
      toast.error("Вы уже оценили этот товар");

      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rating }),
      });

      if (response.ok) {
        setUserRating(rating);
        await loadRatingStats();
      } else {
        const error = await response.json();
        toast.error(error.error || "Ошибка при сохранении оценки");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Ошибка при сохранении оценки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-light rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Оценки покупателей</h3>

      {stats && stats.total > 0 ? (
        <div className="space-y-4">
          {/* Общая оценка */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">{stats.average}</div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-secondary">{stats.total} оценок</div>
            </div>
          </div>

          {/* Распределение оценок */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                stats.distribution[rating as keyof typeof stats.distribution];
              const percentage = (count / stats.total) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-white">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-secondary w-12">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-secondary py-4">
          Пока нет оценок для этого товара
        </div>
      )}

      {/* Форма для оценки */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        {loadingUserRating ? (
          <div className="text-center text-secondary py-4">Загрузка...</div>
        ) : userRating !== null ? (
          <div className="bg-dark rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-sm font-medium text-white">
                Вы уже оценили этот товар
              </p>
            </div>
            <p className="text-xs text-secondary mb-3">Ваша оценка:</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`w-8 h-8 ${
                    rating <= userRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-2xl font-bold text-yellow-400">
                {userRating}
              </span>
            </div>
            <p className="text-xs text-green-400 mt-3">
              Спасибо за вашу оценку! ⭐
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-white mb-3">
              Оцените этот товар:
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  disabled={loading}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(rating)}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= hoveredRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
              {hoveredRating > 0 && (
                <span className="ml-2 text-xl font-bold text-yellow-400">
                  {hoveredRating}
                </span>
              )}
            </div>
            {!session && (
              <p className="text-sm text-secondary mt-2">
                Войдите, чтобы оставить оценку
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
