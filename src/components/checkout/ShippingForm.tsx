"use client";

import { MapPin, User, Mail, Phone, Check, Plus } from "lucide-react";
import Link from "next/link";

interface SavedAddress {
  id: string;
  label: string;
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface ShippingFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  savedAddresses?: SavedAddress[];
  selectedAddressId?: string | null;
  onSelectAddress?: (address: SavedAddress) => void;
  loadingAddresses?: boolean;
  isAuthenticated?: boolean;
}

export default function ShippingForm({
  formData,
  onChange,
  savedAddresses = [],
  selectedAddressId,
  onSelectAddress,
  loadingAddresses = false,
  isAuthenticated = false,
}: ShippingFormProps) {
  return (
    <div className="space-y-6">
      {/* Сохраненные адреса (только для авторизованных) */}
      {isAuthenticated && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Адрес доставки</h2>
            <Link
              href="/account"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Добавить новый
            </Link>
          </div>

          {loadingAddresses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border-2 border-dark bg-lighter animate-pulse"
                >
                  <div className="h-4 bg-dark rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-dark rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-dark rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : savedAddresses.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => onSelectAddress?.(address)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative group hover:border-primary/50 ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary/5"
                        : "border-dark hover:bg-lighter"
                    }`}
                  >
                    {/* Галочка для выбранного */}
                    {selectedAddressId === address.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check size={16} className="text-black" />
                      </div>
                    )}

                    {/* Метка адреса */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-bold text-white">
                        {address.label}
                      </span>
                      {address.is_default && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          По умолчанию
                        </span>
                      )}
                    </div>

                    {/* Детали адреса */}
                    <div className="space-y-1 text-sm text-secondary">
                      <p className="text-white font-medium">
                        {address.recipient_name}
                      </p>
                      <p>{address.recipient_phone}</p>
                      <p>
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p>
                        {address.city}, {address.postal_code}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="divider my-6"></div>

              <p className="text-sm text-secondary mb-4 flex items-center gap-2">
                <MapPin size={16} />
                Или заполните данные вручную
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl border-2 border-dashed border-dark text-center mb-6">
              <MapPin size={48} className="mx-auto mb-3 text-muted" />
              <p className="text-white font-medium mb-2">
                У вас нет сохраненных адресов
              </p>
              <p className="text-sm text-secondary mb-4">
                Добавьте адрес в профиле для быстрого оформления заказов
              </p>
              <Link
                href="/account"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Добавить адрес
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Контактная информация */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Контактная информация
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Полное имя *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => onChange("customer_name", e.target.value)}
                placeholder="Иван Иванов"
                className="input-field pl-11"
                required
              />
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => onChange("customer_email", e.target.value)}
                placeholder="ivan@example.com"
                className="input-field pl-11"
                required
              />
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Телефон *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => onChange("customer_phone", e.target.value)}
                placeholder="+82 10-1234-5678"
                className="input-field pl-11"
                required
              />
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Адрес доставки (ручной ввод) */}
      {(!isAuthenticated ||
        savedAddresses.length === 0 ||
        !selectedAddressId) && (
        <>
          <div className="divider"></div>

          <div>
            {!isAuthenticated && (
              <h2 className="text-2xl font-bold text-white mb-4">
                Адрес доставки
              </h2>
            )}

            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Адрес *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => onChange("address", e.target.value)}
                    placeholder="Улица, дом, квартира"
                    className="input-field pl-11"
                    required
                  />
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Город *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Сеул"
                    className="input-field"
                    required
                  />
                </div>

                {/* Postal code */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Почтовый индекс *
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => onChange("postal_code", e.target.value)}
                    placeholder="06000"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Комментарий к заказу
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Особые пожелания по доставке..."
          rows={3}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
