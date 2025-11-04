"use client";

import { MapPin, User, Mail, Phone } from "lucide-react";

interface ShippingFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export default function ShippingForm({
  formData,
  onChange,
}: ShippingFormProps) {
  return (
    <div className="space-y-6">
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
                className="input-field pl-10"
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
                className="input-field pl-10"
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
                className="input-field pl-10"
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

      <div className="divider"></div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Адрес доставки</h2>

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
                className="input-field pl-10"
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
      </div>
    </div>
  );
}
