"use client";

import { useState } from "react";
import {
  Store,
  Truck,
  CreditCard,
  Tag,
  Mail,
  BarChart3,
  Globe,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

type TabType =
  | "general"
  | "delivery"
  | "payment"
  | "promo"
  | "email"
  | "integrations"
  | "seo";

const tabs = [
  { id: "general", name: "Общие", icon: Store },
  { id: "delivery", name: "Доставка", icon: Truck },
  { id: "payment", name: "Оплата", icon: CreditCard },
  { id: "promo", name: "Промокоды", icon: Tag },
  { id: "email", name: "Email", icon: Mail },
  { id: "integrations", name: "Интеграции", icon: BarChart3 },
  { id: "seo", name: "SEO", icon: Globe },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [loading, setLoading] = useState(false);

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    store_name_ko: "FitStore",
    store_name_ru: "ФитСтор",
    store_name_en: "FitStore",
    email: "support@fitstore.kr",
    phone: "+82 10 1234 5678",
    address: "Seoul, Gangnam-gu",
    logo_url: "",
  });

  // Delivery settings state
  const [deliverySettings, setDeliverySettings] = useState({
    free_delivery_threshold: 50000,
    standard_delivery_cost: 3000,
    express_delivery_cost: 5000,
    delivery_time_standard: "2-3 дня",
    delivery_time_express: "1 день",
  });

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    stripe_enabled: true,
    stripe_public_key: "",
    kakaopay_enabled: true,
    bank_transfer_enabled: true,
    bank_name: "Woori Bank",
    bank_account: "1002-123-456789",
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    smtp_user: "",
    smtp_password: "",
    from_name: "FitStore",
    from_email: "noreply@fitstore.kr",
  });

  // SEO settings state
  const [seoSettings, setSeoSettings] = useState({
    meta_title: "FitStore - Премиум спортивное питание в Корее",
    meta_description:
      "Лучший магазин спортивного питания в Корее. Протеин, креатин, BCAA, витамины от ведущих брендов.",
    meta_keywords: "спортпит, протеин, Корея, фитнес, бодибилдинг",
    og_image: "",
  });

  // Integrations settings state
  const [integrationsSettings, setIntegrationsSettings] = useState({
    google_analytics_id: "",
    facebook_pixel_id: "",
    google_tag_manager_id: "",
  });

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // TODO: API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Общие настройки сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDelivery = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Настройки доставки сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Настройки оплаты сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Email настройки сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSEO = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("SEO настройки сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntegrations = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Интеграции сохранены");
    } catch (error) {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
        <p className="text-secondary">Управление настройками вашего магазина</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-dark"
                  : "bg-light text-secondary hover:text-primary hover:bg-lighter"
              }`}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Store size={20} />
                Общие настройки магазина
              </h2>
            </div>

            {/* Store Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Корейский)
                </label>
                <input
                  type="text"
                  value={generalSettings.store_name_ko}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      store_name_ko: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Русский)
                </label>
                <input
                  type="text"
                  value={generalSettings.store_name_ru}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      store_name_ru: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Английский)
                </label>
                <input
                  type="text"
                  value={generalSettings.store_name_en}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      store_name_en: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email для связи
                </label>
                <input
                  type="email"
                  value={generalSettings.email}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      email: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={generalSettings.phone}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      phone: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Адрес магазина
              </label>
              <input
                type="text"
                value={generalSettings.address}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    address: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                URL логотипа
              </label>
              <input
                type="url"
                value={generalSettings.logo_url}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    logo_url: e.target.value,
                  })
                }
                className="input-field"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <button
              onClick={handleSaveGeneral}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* Delivery Settings */}
        {activeTab === "delivery" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Truck size={20} />
                Настройки доставки
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Бесплатная доставка от (₩)
              </label>
              <input
                type="number"
                value={deliverySettings.free_delivery_threshold}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    free_delivery_threshold: Number(e.target.value),
                  })
                }
                className="input-field"
              />
              <p className="text-xs text-secondary mt-1">
                При заказе от этой суммы доставка бесплатная
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Стоимость стандартной доставки (₩)
                </label>
                <input
                  type="number"
                  value={deliverySettings.standard_delivery_cost}
                  onChange={(e) =>
                    setDeliverySettings({
                      ...deliverySettings,
                      standard_delivery_cost: Number(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Срок стандартной доставки
                </label>
                <input
                  type="text"
                  value={deliverySettings.delivery_time_standard}
                  onChange={(e) =>
                    setDeliverySettings({
                      ...deliverySettings,
                      delivery_time_standard: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Стоимость экспресс доставки (₩)
                </label>
                <input
                  type="number"
                  value={deliverySettings.express_delivery_cost}
                  onChange={(e) =>
                    setDeliverySettings({
                      ...deliverySettings,
                      express_delivery_cost: Number(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Срок экспресс доставки
                </label>
                <input
                  type="text"
                  value={deliverySettings.delivery_time_express}
                  onChange={(e) =>
                    setDeliverySettings({
                      ...deliverySettings,
                      delivery_time_express: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={handleSaveDelivery}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Способы оплаты
              </h2>
            </div>

            {/* Stripe */}
            <div className="card p-4 bg-darker">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Stripe</h3>
                    <p className="text-xs text-secondary">Банковские карты</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.stripe_enabled}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        stripe_enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {paymentSettings.stripe_enabled && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Stripe Public Key
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.stripe_public_key}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        stripe_public_key: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="pk_test_..."
                  />
                </div>
              )}
            </div>

            {/* KakaoPay */}
            <div className="card p-4 bg-darker">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-500 font-bold text-lg">K</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">KakaoPay</h3>
                    <p className="text-xs text-secondary">
                      Популярный способ оплаты в Корее
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.kakaopay_enabled}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        kakaopay_enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="card p-4 bg-darker">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Банковский перевод
                    </h3>
                    <p className="text-xs text-secondary">
                      Прямой перевод на счет
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.bank_transfer_enabled}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank_transfer_enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {paymentSettings.bank_transfer_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Название банка
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bank_name}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          bank_name: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Номер счета
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bank_account}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          bank_account: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSavePayment}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* Promo Codes (Link to separate page) */}
        {activeTab === "promo" && (
          <div className="text-center py-12">
            <Tag size={48} className="text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Управление промокодами
            </h3>
            <p className="text-secondary mb-6">
              Создавайте и управляйте промокодами для ваших клиентов
            </p>
            <button className="btn-primary">Перейти к промокодам</button>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={20} />
                SMTP Настройки
              </h2>
              <p className="text-secondary text-sm">
                Настройте отправку email уведомлений клиентам
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={emailSettings.smtp_host}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtp_host: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={emailSettings.smtp_port}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtp_port: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SMTP User (Email)
                </label>
                <input
                  type="email"
                  value={emailSettings.smtp_user}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtp_user: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={emailSettings.smtp_password}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtp_password: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="border-t border-dark pt-6">
              <h3 className="font-semibold text-white mb-4">
                Настройки отправителя
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Имя отправителя
                  </label>
                  <input
                    type="text"
                    value={emailSettings.from_name}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        from_name: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email отправителя
                  </label>
                  <input
                    type="email"
                    value={emailSettings.from_email}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        from_email: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveEmail}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* Integrations */}
        {activeTab === "integrations" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Интеграции с сервисами аналитики
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Google Analytics Tracking ID
              </label>
              <input
                type="text"
                value={integrationsSettings.google_analytics_id}
                onChange={(e) =>
                  setIntegrationsSettings({
                    ...integrationsSettings,
                    google_analytics_id: e.target.value,
                  })
                }
                className="input-field"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-secondary mt-1">
                Найдите в Google Analytics → Admin → Data Streams
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={integrationsSettings.facebook_pixel_id}
                onChange={(e) =>
                  setIntegrationsSettings({
                    ...integrationsSettings,
                    facebook_pixel_id: e.target.value,
                  })
                }
                className="input-field"
                placeholder="123456789012345"
              />
              <p className="text-xs text-secondary mt-1">
                Найдите в Facebook Events Manager → Data Sources
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Google Tag Manager ID
              </label>
              <input
                type="text"
                value={integrationsSettings.google_tag_manager_id}
                onChange={(e) =>
                  setIntegrationsSettings({
                    ...integrationsSettings,
                    google_tag_manager_id: e.target.value,
                  })
                }
                className="input-field"
                placeholder="GTM-XXXXXXX"
              />
              <p className="text-xs text-secondary mt-1">
                Найдите в Google Tag Manager → Admin → Container
              </p>
            </div>

            <button
              onClick={handleSaveIntegrations}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* SEO Settings */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={20} />
                SEO Настройки
              </h2>
              <p className="text-secondary text-sm">
                Оптимизация для поисковых систем
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={seoSettings.meta_title}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    meta_title: e.target.value,
                  })
                }
                className="input-field"
                maxLength={60}
              />
              <p className="text-xs text-secondary mt-1">
                Рекомендуется до 60 символов ({seoSettings.meta_title.length}
                /60)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Description
              </label>
              <textarea
                value={seoSettings.meta_description}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    meta_description: e.target.value,
                  })
                }
                className="input-field min-h-[100px]"
                maxLength={160}
              />
              <p className="text-xs text-secondary mt-1">
                Рекомендуется до 160 символов (
                {seoSettings.meta_description.length}/160)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={seoSettings.meta_keywords}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    meta_keywords: e.target.value,
                  })
                }
                className="input-field"
                placeholder="Ключевые слова через запятую"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={seoSettings.og_image}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    og_image: e.target.value,
                  })
                }
                className="input-field"
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-xs text-secondary mt-1">
                Изображение для социальных сетей (рекомендуется 1200x630px)
              </p>
            </div>

            <button
              onClick={handleSaveSEO}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
