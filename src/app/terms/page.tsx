import React from "react";
import {
  FileText,
  Shield,
  Users,
  AlertCircle,
  Lock,
  ShoppingCart,
  Ban,
  Scale,
  Mail,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-primary">Условия</span> использования
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
            Правила и условия использования магазина FIT STORE
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
            <h3 className="text-xl font-bold text-white mb-2">Защита прав</h3>
            <p className="text-secondary">
              Ваши права и обязанности при использовании сервиса
            </p>
          </div>

          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <Lock className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Конфиденциальность
            </h3>
            <p className="text-secondary">Защита ваших персональных данных</p>
          </div>

          <div className="card p-6 border border-dark hover:border-primary transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Scale className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Честные условия
            </h3>
            <p className="text-secondary">
              Прозрачные и понятные правила работы
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  1. Общие положения
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                1.1. Настоящие Условия использования (далее — «Условия»)
                регулируют отношения между FIT STORE (далее — «Магазин») и
                пользователями сайта (далее — «Пользователь»).
              </p>
              <p>
                1.2. Используя сайт FIT STORE, вы соглашаетесь с настоящими
                Условиями. Если вы не согласны с какими-либо положениями,
                пожалуйста, прекратите использование сайта.
              </p>
              <p>
                1.3. Магазин оставляет за собой право изменять настоящие Условия
                в любое время. Изменения вступают в силу с момента их публикации
                на сайте.
              </p>
              <p>
                1.4. Продолжая использовать сайт после внесения изменений, вы
                подтверждаете свое согласие с обновленными Условиями.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  2. Регистрация и учетная запись
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                2.1. Для совершения покупок необходимо создать учетную запись,
                предоставив актуальную и достоверную информацию.
              </p>
              <p>
                2.2. Вы несете ответственность за сохранность своих учетных
                данных и все действия, совершенные под вашей учетной записью.
              </p>
              <p>
                2.3. При обнаружении несанкционированного доступа к вашей
                учетной записи необходимо немедленно уведомить Магазин.
              </p>
              <p>
                2.4. Запрещается создавать учетные записи с использованием
                ложной информации или от имени третьих лиц.
              </p>
              <p>
                2.5. Магазин оставляет за собой право приостановить или удалить
                учетную запись при нарушении настоящих Условий.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  3. Заказы и оплата
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                3.1. Оформляя заказ, вы делаете предложение о покупке товара на
                условиях, указанных на сайте.
              </p>
              <p>
                3.2. Магазин оставляет за собой право отклонить заказ по любой
                причине, включая, но не ограничиваясь: отсутствием товара,
                ошибками в цене, подозрением в мошенничестве.
              </p>
              <p>
                3.3. Цены на товары указаны в корейских вонах (₩) и могут быть
                изменены без предварительного уведомления.
              </p>
              <p>
                3.4. Оплата производится одним из способов, указанных на сайте.
                Все платежи обрабатываются через защищенные платежные системы.
              </p>
              <p>
                3.5. После подтверждения оплаты заказ передается в обработку.
                Изменение или отмена заказа возможны до момента его отправки.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  4. Доставка и возврат
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                4.1. Доставка осуществляется по адресу, указанному при
                оформлении заказа. Сроки доставки составляют 3-5 рабочих дней.
              </p>
              <p>
                4.2. Бесплатная доставка предоставляется при заказе на сумму от
                100,000₩. Для заказов меньшей суммы стоимость доставки
                рассчитывается индивидуально.
              </p>
              <p>
                4.3. Риск случайной гибели или повреждения товара переходит к
                Покупателю с момента передачи товара курьерской службой.
              </p>
              <p>
                4.4. Возврат товара надлежащего качества возможен в течение 14
                дней с момента получения при условии сохранения товарного вида и
                упаковки.
              </p>
              <p>
                4.5. Товары ненадлежащего качества подлежат возврату или обмену
                в соответствии с законодательством Республики Корея.
              </p>
              <p className="flex items-start space-x-2 bg-primary/10 p-4 rounded-lg border border-primary/20">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Спортивное питание и добавки не подлежат возврату после
                  вскрытия упаковки в соответствии с санитарными нормами.
                </span>
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  5. Интеллектуальная собственность
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                5.1. Все материалы на сайте FIT STORE, включая, но не
                ограничиваясь: тексты, графику, логотипы, изображения,
                программное обеспечение, являются собственностью Магазина или
                его партнеров.
              </p>
              <p>
                5.2. Запрещается копирование, распространение, модификация или
                иное использование материалов сайта без письменного разрешения
                Магазина.
              </p>
              <p>
                5.3. Использование материалов сайта в коммерческих целях строго
                запрещено.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Ban className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  6. Ограничение ответственности
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                6.1. Магазин не несет ответственности за последствия
                использования товаров, приобретенных на сайте. Перед
                использованием спортивного питания рекомендуется
                проконсультироваться с врачом.
              </p>
              <p>
                6.2. Магазин не гарантирует бесперебойную работу сайта и не
                несет ответственности за технические сбои, перерывы в работе или
                потерю данных.
              </p>
              <p>
                6.3. Информация на сайте носит справочный характер и может
                содержать неточности. Магазин не несет ответственности за ошибки
                в описании товаров или ценах.
              </p>
              <p>
                6.4. Магазин не несет ответственности за содержание внешних
                сайтов, ссылки на которые могут быть размещены на сайте FIT
                STORE.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  7. Конфиденциальность
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                7.1. Магазин обязуется обеспечить конфиденциальность
                персональных данных Пользователей в соответствии с
                законодательством Республики Корея.
              </p>
              <p>
                7.2. Персональные данные используются только для обработки
                заказов, улучшения качества обслуживания и информирования о
                новых товарах и акциях.
              </p>
              <p>
                7.3. Магазин не передает персональные данные третьим лицам без
                согласия Пользователя, за исключением случаев, предусмотренных
                законодательством.
              </p>
              <p>
                7.4. Подробнее о защите персональных данных читайте в нашей{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary-dark transition-colors underline"
                >
                  Политике конфиденциальности
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  8. Разрешение споров
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                8.1. Все споры и разногласия, возникающие из настоящих Условий
                или в связи с ними, разрешаются путем переговоров.
              </p>
              <p>
                8.2. При невозможности разрешения спора путем переговоров, он
                подлежит рассмотрению в суде по месту нахождения Магазина в
                соответствии с законодательством Республики Корея.
              </p>
              <p>
                8.3. Настоящие Условия регулируются законодательством Республики
                Корея.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="card p-8 border border-dark">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  9. Контактная информация
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                По всем вопросам, связанным с настоящими Условиями, вы можете
                связаться с нами:
              </p>
              <div className="bg-light p-6 rounded-xl space-y-3 border border-dark">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Email: support@fitstore.kr</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Адрес: Seoul, South Korea</span>
                </div>
              </div>
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
                  Принятие условий
                </h3>
                <p className="text-secondary leading-relaxed mb-6">
                  Используя сайт FIT STORE, вы подтверждаете, что прочитали,
                  поняли и согласны соблюдать настоящие Условия использования.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 btn-primary"
                >
                  <span>Вернуться на главную</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
