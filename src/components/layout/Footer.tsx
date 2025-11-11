import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-darker border-t border-dark mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary">FIT</span>
              <span className="text-white">STORE</span>
            </h3>
            <p className="text-secondary text-sm mb-6 leading-relaxed">
              Лучший магазин спортивного питания в Корее
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-light hover:bg-primary/10 hover:border-primary border border-dark flex items-center justify-center transition-all group"
              >
                <Instagram
                  size={18}
                  className="text-secondary group-hover:text-primary"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-light hover:bg-primary/10 hover:border-primary border border-dark flex items-center justify-center transition-all group"
              >
                <Facebook
                  size={18}
                  className="text-secondary group-hover:text-primary"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-light hover:bg-primary/10 hover:border-primary border border-dark flex items-center justify-center transition-all group"
              >
                <Youtube
                  size={18}
                  className="text-secondary group-hover:text-primary"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">
              Быстрые ссылки
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Доставка
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/returns"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Возврат/Обмен
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Вопросы и ответы
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Категории</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?category=protein"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Протеин
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=amino-acids"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Аминокислоты
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=gainers"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Гейнеры
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=creatine"
                  className="text-secondary hover:text-primary transition-all text-sm flex items-center group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-all"></span>
                  Креатин
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-secondary text-sm">
                <Phone
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span>+82 2-1234-5678</span>
              </li>
              <li className="flex items-start gap-3 text-secondary text-sm">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>support@fitstore.kr</span>
              </li>
              <li className="flex items-start gap-3 text-secondary text-sm">
                <MapPin
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span>
                  Сеул, Каннам-гу
                  <br />
                  Теheran-ro 123
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-secondary text-sm">
          <p>&copy; 2025 FitStore Korea. Все права защищены.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-primary transition-all">
              Условия использования
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-all">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
