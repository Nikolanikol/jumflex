import Link from "next/link";
import { ArrowRight, Shield, Zap, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden bg-darker">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-darker via-dark to-darker opacity-50"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-10 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award size={16} className="text-primary" />
              <span className="text-primary text-sm font-semibold">
                Премиум спортивное питание
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ваши цели,
              <br />
              <span className="text-primary">наша страсть</span>
            </h1>

            <p className="text-xl text-secondary mb-8 leading-relaxed">
              Лучшие мировые бренды спортивного питания
              <br className="hidden md:block" />в одном месте
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/products"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                <span>Начать покупки</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/products?featured=true"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                Лучшие товары
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-light border border-dark">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs text-secondary font-medium">
                  товаров
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-light border border-dark">
                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-xs text-secondary font-medium">
                  брендов
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-light border border-dark">
                <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                <div className="text-xs text-secondary font-medium">
                  клиентов
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="card p-6 group hover:border-primary/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-white">
                    100% оригинал
                  </h3>
                  <p className="text-secondary text-sm">
                    Все товары сертифицированы
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:border-primary/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                  <Zap className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-white">
                    Быстрая доставка
                  </h3>
                  <p className="text-secondary text-sm">
                    В день заказа по Сеулу
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:border-accent/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-all">
                  <Award className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-white">
                    Бонус 15%
                  </h3>
                  <p className="text-secondary text-sm">
                    Скидка на первую покупку
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
