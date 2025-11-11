import React from "react";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  UserCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-primary">Доставка</span> и оплата
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
            Быстрая и надежная доставка по всей Южной Корее
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Key Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Delivery Time */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">3-5 дней</h3>
            <p className="text-secondary">
              Стандартный срок доставки с момента оплаты заказа
            </p>
          </div>

          {/* Free Shipping */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Truck className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">От 100,000₩</h3>
            <p className="text-secondary">
              Бесплатная доставка при заказе от ста тысяч вон
            </p>
          </div>

          {/* Coverage */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              По всей Корее
            </h3>
            <p className="text-secondary">
              Доставляем во все регионы Южной Кореи
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Как работает доставка
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="card p-6 border border-dark hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Оформление заказа
                  </h3>
                  <p className="text-secondary">
                    Добавьте товары в корзину и оформите заказ. Укажите адрес
                    доставки и выберите способ оплаты.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card p-6 border border-dark hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Оплата</h3>
                  <p className="text-secondary">
                    Оплатите заказ удобным способом. С момента оплаты начинается
                    отсчет времени доставки (3-5 дней).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card p-6 border border-dark hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Обработка заказа
                  </h3>
                  <p className="text-secondary">
                    Мы комплектуем ваш заказ и готовим его к отправке. Следите
                    за статусом в личном кабинете.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card p-6 border border-dark hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Отправка
                  </h3>
                  <p className="text-secondary">
                    Заказ передается курьерской службе. Вы получите трек-номер
                    для отслеживания посылки.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="card p-6 border border-dark hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Получение
                  </h3>
                  <p className="text-secondary">
                    Курьер доставит заказ по указанному адресу. Проверьте
                    комплектность при получении.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="card p-8 md:p-12 border border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mr-4">
                  <UserCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Отслеживание заказа
                </h2>
              </div>
              <p className="text-lg text-secondary mb-6 leading-relaxed">
                Вся информация о статусе вашего заказа доступна в личном
                кабинете. Войдите в свой аккаунт, чтобы узнать:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary">
                    Текущий статус обработки заказа
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary">
                    Трек-номер для отслеживания посылки
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary">
                    Историю всех ваших заказов
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary">
                    Ожидаемую дату доставки
                  </span>
                </li>
              </ul>
              <Link href="/profile/orders" className="btn-primary inline-block">
                Перейти в личный кабинет
              </Link>
            </div>
          </div>
        </div>

        {/* Delivery Cost */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Стоимость доставки
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Shipping */}
            <div className="card p-6 border border-primary hover:border-primary transition-all">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-white">Бесплатно</h3>
              </div>
              <p className="text-secondary mb-2">
                При заказе от{" "}
                <span className="text-primary font-bold">100,000₩</span>
              </p>
              <p className="text-sm text-muted">
                Оформите заказ на сумму от ста тысяч вон и получите бесплатную
                доставку
              </p>
            </div>

            {/* Paid Shipping */}
            <div className="card p-6 border border-dark hover:border-primary transition-all">
              <div className="flex items-center mb-4">
                <Package className="w-8 h-8 text-secondary mr-3" />
                <h3 className="text-2xl font-bold text-white">5,000₩</h3>
              </div>
              <p className="text-secondary mb-2">
                При заказе до <span className="font-bold">100,000₩</span>
              </p>
              <p className="text-sm text-muted">
                Для заказов на меньшую сумму стоимость доставки составляет 5000
                вон
              </p>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 border border-dark">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Важная информация
                </h3>
                <ul className="space-y-3 text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Срок доставки 3-5 дней начинается с момента подтверждения
                      оплаты
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Доставка осуществляется по рабочим дням
                      (понедельник-пятница)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Курьер свяжется с вами перед доставкой для уточнения
                      времени
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      При получении обязательно проверьте комплектность и
                      целостность упаковки
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      В отдаленные регионы срок доставки может увеличиться на
                      1-2 дня
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
