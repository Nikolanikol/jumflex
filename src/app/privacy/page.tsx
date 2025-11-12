import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  UserCheck,
  AlertCircle,
  Mail,
  FileText,
  Settings,
  CheckCircle,
  Globe,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-primary">Политика</span> конфиденциальности
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
            Мы заботимся о защите ваших персональных данных
          </p>
          <p className="text-secondary mt-4">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Защита данных</h3>
            <p className="text-secondary">
              Используем современные методы шифрования и защиты
            </p>
          </div>

          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Lock className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Конфиденциальность
            </h3>
            <p className="text-secondary">
              Не передаем данные третьим лицам без вашего согласия
            </p>
          </div>

          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <UserCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ваши права</h3>
            <p className="text-secondary">
              Полный контроль над своими персональными данными
            </p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  1. Введение
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                1.1. FIT STORE (далее — «Мы», «Компания», «Магазин») уважает
                вашу конфиденциальность и обязуется защищать ваши персональные
                данные.
              </p>
              <p>
                1.2. Настоящая Политика конфиденциальности (далее — «Политика»)
                описывает, как мы собираем, используем, храним и защищаем вашу
                личную информацию.
              </p>
              <p>
                1.3. Используя наш сайт и сервисы, вы соглашаетесь со сбором и
                использованием информации в соответствии с настоящей Политикой.
              </p>
              <p>
                1.4. Настоящая Политика применяется ко всем пользователям сайта
                FIT STORE, независимо от факта регистрации.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  2. Какие данные мы собираем
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-6 text-secondary leading-relaxed">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  2.1. Данные, которые вы предоставляете
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Регистрация:</strong> имя,
                      email, телефон, пароль
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Заказы:</strong> адрес
                      доставки, контактная информация
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Оплата:</strong> данные
                      платежных карт (обрабатываются через защищенные платежные
                      системы)
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Обратная связь:</strong>{" "}
                      отзывы, комментарии, сообщения в поддержку
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  2.2. Данные, собираемые автоматически
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">
                        Технические данные:
                      </strong>{" "}
                      IP-адрес, тип браузера, устройство, операционная система
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">
                        Данные о поведении:
                      </strong>{" "}
                      просмотренные страницы, время на сайте, клики
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Cookies:</strong>{" "}
                      идентификаторы сеанса, предпочтения
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  3. Как мы используем ваши данные
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>Мы используем ваши персональные данные для следующих целей:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">
                    Обработка заказов
                  </h4>
                  <p className="text-sm">
                    Обработка и доставка ваших заказов, обработка платежей,
                    отправка уведомлений о статусе заказа
                  </p>
                </div>
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">
                    Улучшение сервиса
                  </h4>
                  <p className="text-sm">
                    Анализ использования сайта для улучшения функциональности и
                    пользовательского опыта
                  </p>
                </div>
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">
                    Коммуникация
                  </h4>
                  <p className="text-sm">
                    Ответы на ваши запросы, предоставление поддержки, отправка
                    важных уведомлений
                  </p>
                </div>
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">Маркетинг</h4>
                  <p className="text-sm">
                    Информирование о новых продуктах, акциях и специальных
                    предложениях (с вашего согласия)
                  </p>
                </div>
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">
                    Безопасность
                  </h4>
                  <p className="text-sm">
                    Предотвращение мошенничества, защита от несанкционированного
                    доступа
                  </p>
                </div>
                <div className="bg-light p-4 rounded-xl border border-dark">
                  <h4 className="text-white font-semibold mb-2">
                    Соблюдение законов
                  </h4>
                  <p className="text-sm">
                    Выполнение юридических обязательств и соблюдение требований
                    законодательства
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  4. Cookies и аналогичные технологии
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                4.1. Мы используем cookies и аналогичные технологии для
                улучшения работы сайта и персонализации вашего опыта.
              </p>
              <div className="bg-light p-6 rounded-xl border border-dark space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Обязательные cookies
                  </h4>
                  <p className="text-sm">
                    Необходимы для базовой функциональности сайта (авторизация,
                    корзина покупок)
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Функциональные cookies
                  </h4>
                  <p className="text-sm">
                    Запоминают ваши предпочтения и настройки
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Аналитические cookies
                  </h4>
                  <p className="text-sm">
                    Помогают понять, как посетители используют сайт
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Маркетинговые cookies
                  </h4>
                  <p className="text-sm">
                    Используются для показа релевантной рекламы
                  </p>
                </div>
              </div>
              <p>
                4.2. Вы можете управлять cookies через настройки вашего
                браузера. Обратите внимание, что отключение некоторых cookies
                может повлиять на функциональность сайта.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  5. Передача данных третьим лицам
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                5.1. Мы не продаем и не сдаем в аренду ваши персональные данные
                третьим лицам.
              </p>
              <p>5.2. Мы можем передавать ваши данные следующим категориям:</p>
              <ul className="space-y-3 ml-4 mt-4">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Курьерские службы:</strong>{" "}
                    для доставки заказов
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Платежные системы:</strong>{" "}
                    для обработки платежей (данные передаются в зашифрованном
                    виде)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Сервисы аналитики:</strong>{" "}
                    для анализа использования сайта (в анонимизированном виде)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">
                      Государственные органы:
                    </strong>{" "}
                    по требованию закона
                  </span>
                </li>
              </ul>
              <p className="flex items-start space-x-2 bg-accent/10 p-4 rounded-lg border border-accent/20 mt-4">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  Все третьи стороны обязаны соблюдать конфиденциальность и
                  использовать данные только для указанных целей.
                </span>
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  6. Безопасность данных
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                6.1. Мы применяем современные технические и организационные меры
                для защиты ваших персональных данных от несанкционированного
                доступа, изменения, раскрытия или уничтожения.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <Lock className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      SSL-шифрование
                    </h4>
                    <p className="text-sm">
                      Все данные передаются по защищенному протоколу HTTPS
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <Database className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Защищенное хранение
                    </h4>
                    <p className="text-sm">
                      Данные хранятся на защищенных серверах с ограниченным
                      доступом
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <Eye className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Мониторинг
                    </h4>
                    <p className="text-sm">
                      Постоянный контроль безопасности и выявление угроз
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <UserCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Контроль доступа
                    </h4>
                    <p className="text-sm">
                      Доступ к данным только у авторизованного персонала
                    </p>
                  </div>
                </div>
              </div>
              <p>
                6.2. Несмотря на наши усилия, ни одна система не является
                абсолютно защищенной. Мы рекомендуем использовать надежные
                пароли и не передавать их третьим лицам.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  7. Ваши права
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                В соответствии с законодательством Республики Корея о защите
                персональных данных, вы имеете следующие права:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на доступ
                    </h4>
                    <p className="text-sm">
                      Вы можете запросить копию своих персональных данных,
                      которые мы храним
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на исправление
                    </h4>
                    <p className="text-sm">
                      Вы можете исправить неточные или неполные данные
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на удаление
                    </h4>
                    <p className="text-sm">
                      Вы можете запросить удаление своих данных при определенных
                      условиях
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на ограничение обработки
                    </h4>
                    <p className="text-sm">
                      Вы можете ограничить обработку своих данных в определенных
                      случаях
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на отзыв согласия
                    </h4>
                    <p className="text-sm">
                      Вы можете в любое время отозвать согласие на обработку
                      данных
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-light p-4 rounded-xl border border-dark">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Право на подачу жалобы
                    </h4>
                    <p className="text-sm">
                      Вы можете подать жалобу в надзорный орган по защите данных
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                Для реализации своих прав, пожалуйста, свяжитесь с нами по
                адресу: support@fitstore.kr
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  8. Хранение данных
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                8.1. Мы храним ваши персональные данные только в течение срока,
                необходимого для достижения целей, указанных в настоящей
                Политике, или в соответствии с требованиями законодательства.
              </p>
              <div className="bg-light p-6 rounded-xl border border-dark space-y-3 mt-4">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Данные учетной записи
                  </h4>
                  <p className="text-sm">
                    Хранятся до удаления учетной записи или 3 года неактивности
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Данные о заказах
                  </h4>
                  <p className="text-sm">
                    Хранятся в течение 5 лет в соответствии с налоговым
                    законодательством
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Маркетинговые данные
                  </h4>
                  <p className="text-sm">
                    Хранятся до отзыва согласия на получение маркетинговых
                    материалов
                  </p>
                </div>
              </div>
              <p>
                8.2. После истечения срока хранения данные безвозвратно
                удаляются или анонимизируются.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  9. Дети и конфиденциальность
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                9.1. Наш сайт не предназначен для лиц младше 14 лет. Мы
                сознательно не собираем персональные данные детей.
              </p>
              <p>
                9.2. Если вы считаете, что мы случайно собрали информацию о
                ребенке, немедленно свяжитесь с нами, и мы удалим эти данные.
              </p>
              <p>
                9.3. Для пользователей в возрасте от 14 до 18 лет требуется
                согласие родителей или законных представителей на обработку
                персональных данных.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  10. Изменения в Политике
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                10.1. Мы можем время от времени обновлять настоящую Политику
                конфиденциальности для отражения изменений в наших практиках или
                по другим операционным, правовым или регуляторным причинам.
              </p>
              <p>
                10.2. О существенных изменениях мы уведомим вас по email или
                через уведомление на сайте.
              </p>
              <p>
                10.3. Дата последнего обновления указана в начале документа. Мы
                рекомендуем периодически проверять эту страницу на наличие
                изменений.
              </p>
              <p>
                10.4. Продолжая использовать сайт после внесения изменений, вы
                принимаете обновленную Политику конфиденциальности.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  11. Контактная информация
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                Если у вас есть вопросы о настоящей Политике конфиденциальности
                или наших практиках обработки данных, пожалуйста, свяжитесь с
                нами:
              </p>
              <div className="bg-light p-6 rounded-xl space-y-4 border border-dark">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <a
                      href="mailto:support@fitstore.kr"
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      support@fitstore.kr
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Адрес</h4>
                    <p>Seoul, South Korea</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Офицер по защите данных
                    </h4>
                    <a
                      href="mailto:dpo@fitstore.kr"
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      dpo@fitstore.kr
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                Мы стремимся ответить на все запросы в течение 30 дней с момента
                получения.
              </p>
            </div>
          </div>

          {/* Accept Section */}
          <div className="card p-8 border border-primary bg-primary/5">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ваша конфиденциальность важна для нас
                </h3>
                <p className="text-secondary leading-relaxed mb-6">
                  Мы обязуемся защищать ваши персональные данные и обрабатывать
                  их прозрачно и безопасно. Если у вас есть вопросы или
                  опасения, не стесняйтесь связаться с нами.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/" className="btn-primary">
                    Вернуться на главную
                  </Link>
                  <Link href="/terms" className="btn-outline">
                    Условия использования
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
