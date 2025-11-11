"use client";

import { useState } from "react";
import { MapPin, User, Phone, Home, Building2, Save, X } from "lucide-react";
import { UserAddress } from "@/types/database";

interface AddressFormProps {
  address?: UserAddress | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AddressForm({
  address,
  onSave,
  onCancel,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: address?.label || "",
    recipient_name: address?.recipient_name || "",
    recipient_phone: address?.recipient_phone || "",
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    country: address?.country || "South Korea",
    is_default: address?.is_default || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Название адреса *
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Home
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </span>
          <input
            type="text"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder="Дом, Работа, Основной..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Recipient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Имя получателя *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </span>
            <input
              type="text"
              value={formData.recipient_name}
              onChange={(e) =>
                setFormData({ ...formData, recipient_name: e.target.value })
              }
              placeholder="Иван Иванов"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Телефон получателя *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </span>
            <input
              type="tel"
              value={formData.recipient_phone}
              onChange={(e) =>
                setFormData({ ...formData, recipient_phone: e.target.value })
              }
              placeholder="+82 10-1234-5678"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Address Lines */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Адрес (строка 1) *
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </span>
          <input
            type="text"
            value={formData.address_line1}
            onChange={(e) =>
              setFormData({ ...formData, address_line1: e.target.value })
            }
            placeholder="Улица, дом, квартира"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Адрес (строка 2)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </span>
          <input
            type="text"
            value={formData.address_line2}
            onChange={(e) =>
              setFormData({ ...formData, address_line2: e.target.value })
            }
            placeholder="Подъезд, этаж, домофон..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* City, State, Postal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Город *
          </label>

          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Сеул"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Провинция/Регион
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            placeholder="Gyeonggi-do"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Почтовый индекс *
          </label>
          <input
            type="text"
            value={formData.postal_code}
            onChange={(e) =>
              setFormData({ ...formData, postal_code: e.target.value })
            }
            placeholder="06000"
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Страна *
        </label>
        <select
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          className="input-field"
        >
          <option value="South Korea">South Korea (대한민국)</option>
          <option value="Russia">Russia</option>
          <option value="USA">USA</option>
          <option value="Japan">Japan</option>
        </select>
      </div>

      {/* Default Address */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_default}
            onChange={(e) =>
              setFormData({ ...formData, is_default: e.target.checked })
            }
            className="w-5 h-5 rounded border-2 border-dark bg-light checked:bg-primary"
          />
          <span className="text-white">Сделать основным адресом</span>
        </label>
        <p className="text-xs text-secondary mt-2 ml-8">
          Этот адрес будет использоваться по умолчанию при оформлении заказов
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-dark">
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save size={18} />
          <span>Сохранить адрес</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline flex items-center gap-2"
        >
          <X size={18} />
          <span>Отмена</span>
        </button>
      </div>
    </form>
  );
}
