"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Edit, Trash2, Check } from "lucide-react";
import { UserAddress } from "@/types/database";
import AddressForm from "./AddressForm";

export default function AddressManager() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (addressData: any) => {
    try {
      const url = editingAddress
        ? `/api/user/addresses/${editingAddress.id}`
        : "/api/user/addresses";

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        await loadAddresses();
        setShowForm(false);
        setEditingAddress(null);
      } else {
        alert("Ошибка при сохранении адреса");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Ошибка при сохранении адреса");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот адрес?")) return;

    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadAddresses();
      } else {
        alert("Ошибка при удалении адреса");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Ошибка при удалении адреса");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find((a) => a.id === id);
      if (!address) return;

      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...address, is_default: true }),
      });

      if (response.ok) {
        await loadAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-secondary">Загрузка адресов...</p>
      </div>
    );
  }

  if (showForm || editingAddress) {
    return (
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {editingAddress ? "Редактировать адрес" : "Новый адрес"}
        </h2>
        <AddressForm
          address={editingAddress}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Адреса доставки
            </h2>
            <p className="text-secondary">
              Управление адресами для быстрого оформления заказов
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Добавить адрес</span>
          </button>
        </div>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-24 h-24 bg-lighter rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={48} className="text-muted" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Нет сохраненных адресов
          </h3>
          <p className="text-secondary mb-6">
            Добавьте адрес для быстрого оформления заказов
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Добавить адрес</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`card p-6 relative ${
                address.is_default ? "border-2 border-primary" : ""
              }`}
            >
              {/* Default Badge */}
              {address.is_default && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                    <Check size={14} />
                    Основной
                  </span>
                </div>
              )}

              {/* Label */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  {address.label}
                </h3>
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-6">
                <p className="text-white font-medium">
                  {address.recipient_name}
                </p>
                <p className="text-secondary text-sm">
                  {address.recipient_phone}
                </p>
                <p className="text-secondary text-sm">
                  {address.address_line1}
                  {address.address_line2 && <>, {address.address_line2}</>}
                </p>
                <p className="text-secondary text-sm">
                  {address.city}
                  {address.state && <>, {address.state}</>}
                </p>
                <p className="text-secondary text-sm">
                  {address.postal_code}, {address.country}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-dark">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 btn-outline text-sm py-2"
                  >
                    Сделать основным
                  </button>
                )}
                <button
                  onClick={() => setEditingAddress(address)}
                  className="p-2 hover:bg-lighter rounded-lg transition-all"
                  title="Редактировать"
                >
                  <Edit size={18} className="text-secondary" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 hover:bg-lighter rounded-lg transition-all"
                  title="Удалить"
                >
                  <Trash2 size={18} className="text-accent" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
