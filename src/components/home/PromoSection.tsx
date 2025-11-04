import Link from "next/link";
import { Gift, Truck, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Gift,
    title: "Приветственный купон",
    description: "Скидка 15% новым клиентам",
  },
  {
    icon: Truck,
    title: "Бесплатная доставка",
    description: "При заказе от 50,000₩",
  },
  {
    icon: Shield,
    title: "100% оригинал",
    description: "Гарантия подлинности",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Всегда на связи",
  },
];

export default function PromoSection() {
  return (
    <section className="py-16 bg-darker">
      <div className="container mx-auto px-4">
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-secondary text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-primary via-primary to-primary/80">
          <div className="absolute inset-0 bg-darker/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Специальное предложение
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Зарегистрируйтесь сейчас и получите купон на скидку 15% для первой
              покупки
            </p>
            <Link
              href="/register"
              className="inline-block bg-darker hover:bg-black text-primary font-bold px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Зарегистрироваться и получить купон
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
