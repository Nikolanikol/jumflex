"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            {/* Success icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-400/20 flex items-center justify-center animate-pulse">
              <CheckCircle size={48} className="text-green-400" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Заказ оформлен!
            </h1>

            <p className="text-lg text-secondary mb-8">
              Спасибо за покупку! Ваш заказ принят в обработку.
            </p>

            {/* Order number */}
            {orderNumber && (
              <div className="p-6 bg-lighter rounded-xl mb-8">
                <p className="text-sm text-secondary mb-2">Номер заказа</p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>
            )}

            {/* Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-lighter rounded-xl text-left">
                <Package
                  size={24}
                  className="text-primary flex-shrink-0 mt-1"
                />
                <div>
                  {/* <h3 className="font-semibold text-white mb-1">
                    Информация о заказе отправлена на email
                  </h3> */}
                  <p className="text-sm text-secondary">
                    Вы получите подтверждение и информацию о доставке
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-lighter rounded-xl text-left">
                <svg
                  className="w-6 h-6 text-primary flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Обработка заказа
                  </h3>
                  <p className="text-sm text-secondary">
                    Мы свяжемся с вами в течение 24 часов для подтверждения
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <span>Продолжить покупки</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                На главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
