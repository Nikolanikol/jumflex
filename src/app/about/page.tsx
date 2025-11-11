import React from "react";
import {
  Truck,
  Users,
  Award,
  MessageCircle,
  Dumbbell,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            О <span className="text-primary">FIT STORE</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
            Первый интернет-магазин спортивного питания в Южной Корее
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="card p-8 md:p-12 border border-dark hover:border-primary transition-all">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mr-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white">Наша Миссия</h2>
            </div>
            <p className="text-lg text-secondary leading-relaxed">
              Мы стремимся сделать качественное спортивное питание доступным для
              каждого жителя Южной Кореи. Независимо от вашего уровня подготовки
              — профессиональный спортсмен, любитель фитнеса или новичок — мы
              здесь, чтобы поддержать ваш путь к здоровью и отличной форме.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Feature 1 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Первые на рынке
            </h3>
            <p className="text-secondary leading-relaxed">
              FIT STORE — пионер в сфере онлайн-продажи спортивного питания в
              Южной Корее. Мы задали стандарты качества и сервиса.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Truck className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Быстрая доставка
            </h3>
            <p className="text-secondary leading-relaxed">
              Доставка по всей Южной Корее за 3-5 дней. Мы понимаем, что ваши
              цели не ждут, поэтому обеспечиваем оперативную доставку.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Консультации</h3>
            <p className="text-secondary leading-relaxed">
              Профессиональные консультации по выбору спортивного питания. Наши
              эксперты помогут подобрать продукты под ваши цели.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Dumbbell className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Широкий ассортимент
            </h3>
            <p className="text-secondary leading-relaxed">
              От протеинов до витаминов — у нас есть всё необходимое для
              достижения ваших спортивных целей и поддержания здоровья.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Для всех возрастов
            </h3>
            <p className="text-secondary leading-relaxed">
              Мы предлагаем продукты для людей всех возрастов — от молодых
              спортсменов до зрелых атлетов, заботящихся о своём здоровье.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Доступные цены
            </h3>
            <p className="text-secondary leading-relaxed">
              Делаем качественное спортивное питание доступным, предлагая
              конкурентные цены без ущерба для качества продукции.
            </p>
          </div>
        </div>

        {/* Our Customers Section */}
        <div className="card p-8 md:p-12 mb-16 border border-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Для кого мы работаем
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-light rounded-xl p-6 text-center border border-dark hover:border-primary transition-all">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Профессиональные спортсмены
                </h3>
                <p className="text-secondary">
                  Продукция высочайшего качества для максимальных результатов
                </p>
              </div>

              <div className="bg-light rounded-xl p-6 text-center border border-dark hover:border-primary transition-all">
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Любители фитнеса
                </h3>
                <p className="text-secondary">
                  Всё необходимое для регулярных тренировок и здорового образа
                  жизни
                </p>
              </div>

              <div className="bg-light rounded-xl p-6 text-center border border-dark hover:border-primary transition-all">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-white mb-2">Новички</h3>
                <p className="text-secondary">
                  Консультации и поддержка на старте вашего спортивного пути
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center card p-8 md:p-12 border border-primary/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Начните свой путь к здоровью с{" "}
            <span className="text-primary">FIT STORE</span>
          </h2>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Выбирайте качественные продукты, получайте профессиональные
            консультации и наслаждайтесь быстрой доставкой по всей Южной Корее
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
