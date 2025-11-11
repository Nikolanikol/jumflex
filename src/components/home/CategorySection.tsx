import Link from "next/link";
import { Dumbbell, Zap, TrendingUp, Pill, Heart, Flame } from "lucide-react";

const categories = [
  {
    name: "Протеин",
    slug: "protein",
    icon: Dumbbell,
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
    description: "Рост мышц",
  },
  {
    name: "Аминокислоты",
    slug: "amino-acids",
    icon: Zap,
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
    description: "Восстановление",
  },
  //   {
  //     name: "Гейнеры",
  //     slug: "gainers",
  //     icon: TrendingUp,
  //     color: "from-green-500/20 to-green-600/20",
  //     iconColor: "text-green-400",
  //     description: "Набор массы",
  //   },
  //   {
  //     name: "Креатин",
  //     slug: "creatine",
  //     icon: Flame,
  //     color: "from-red-500/20 to-red-600/20",
  //     iconColor: "text-red-400",
  //     description: "Сила и мощь",
  //   },
  //   {
  //     name: "Предтреники",
  //     slug: "pre-workout",
  //     icon: Heart,
  //     color: "from-orange-500/20 to-orange-600/20",
  //     iconColor: "text-orange-400",
  //     description: "Энергия",
  //   },
  //   {
  //     name: "Витамины",
  //     slug: "vitamins",
  //     icon: Pill,
  //     color: "from-yellow-500/20 to-yellow-600/20",
  //     iconColor: "text-yellow-400",
  //     description: "Здоровье",
  //   },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-white">
            Категории товаров
          </h2>
          <p className="text-secondary text-lg">
            Найдите продукты для ваших целей
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="card p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={28} className={category.iconColor} />
                  </div>
                  <h3 className="font-bold text-base mb-1 text-white group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-secondary">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
