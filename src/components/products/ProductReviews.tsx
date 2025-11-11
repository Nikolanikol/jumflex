"use client";

import { Review } from "@/types/database";
import { Star, User } from "lucide-react";

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "fill-primary text-primary" : "text-gray-600"
        }
      />
    ));
  };

  return (
    <div className="mt-12">
      <div className="bg-dark-light rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Отзывы покупателей
        </h2>

        {/* Rating summary */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-dark rounded-xl border border-gray-800">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2 justify-center">
              {getRatingStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-secondary">{totalReviews} отзывов</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: star }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-secondary w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews list */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 bg-dark rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark-light border border-gray-800 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-white">
                        {review.user?.name || "Анонимный пользователь"}
                      </span>
                      <div className="flex gap-1">
                        {getRatingStars(review.rating)}
                      </div>
                    </div>

                    <p className="text-sm text-secondary mb-2">
                      {new Date(review.created_at).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    {review.comment && (
                      <p className="text-white leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-light border border-gray-800 flex items-center justify-center">
              <Star size={32} className="text-gray-600" />
            </div>
            <p className="text-secondary">Пока нет отзывов</p>
            <p className="text-sm text-gray-500 mt-2">
              Будьте первым, кто оставит отзыв!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
