"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Calendar, Save } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Профиль обновлен");
        loadProfile();
      } else {
        alert("Ошибка при обновлении");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Ошибка при обновлении");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-secondary">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Добро пожаловать, {session?.user?.name || "Пользователь"}!
        </h1>
        <p className="text-secondary">Управляйте своим профилем и заказами</p>
      </div>

      {/* Profile Info */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Личная информация
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Имя
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field pl-10"
              />
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="input-field pl-10 opacity-50 cursor-not-allowed"
              />
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <p className="text-xs text-secondary mt-1">Email нельзя изменить</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Телефон
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field pl-10"
                placeholder="+82 10-1234-5678"
              />
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Дата регистрации
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("ru-RU")
                    : ""
                }
                disabled
                className="input-field pl-10 opacity-50 cursor-not-allowed"
              />
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Сохранить изменения</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-primary mb-2">0</p>
          <p className="text-sm text-secondary">Заказов</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-primary mb-2">₩0</p>
          <p className="text-sm text-secondary">Потрачено</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-primary mb-2">0</p>
          <p className="text-sm text-secondary">Избранных</p>
        </div>
      </div>
    </div>
  );
}
