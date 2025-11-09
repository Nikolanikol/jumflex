"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User as UserIcon } from "lucide-react";

export default function UserRoleChanger({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const updateRole = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    const confirmed = confirm(
      `Вы уверены, что хотите изменить роль на "${
        newRole === "admin" ? "Администратор" : "Клиент"
      }"?`
    );

    if (!confirmed) return;

    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления роли");
      }

      alert("✅ Роль пользователя обновлена!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("❌ Ошибка при обновлении роли");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className={`px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 ${
          currentRole === "admin"
            ? "bg-red-500 text-white"
            : "bg-blue-500 text-white"
        }`}
      >
        {currentRole === "admin" ? (
          <>
            <Shield size={20} />
            <span>Администратор</span>
          </>
        ) : (
          <>
            <UserIcon size={20} />
            <span>Клиент</span>
          </>
        )}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[200px]">
          <button
            onClick={() => updateRole("customer")}
            disabled={updating || currentRole === "customer"}
            className={`w-full text-left px-4 py-3 hover:bg-gray-700 first:rounded-t-lg flex items-center gap-3 transition-colors ${
              currentRole === "customer"
                ? "bg-gray-700 opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <UserIcon size={18} className="text-blue-400" />
            <span className="text-white">Клиент</span>
            {currentRole === "customer" && (
              <span className="ml-auto text-yellow-400">✓</span>
            )}
          </button>

          <button
            onClick={() => updateRole("admin")}
            disabled={updating || currentRole === "admin"}
            className={`w-full text-left px-4 py-3 hover:bg-gray-700 last:rounded-b-lg flex items-center gap-3 transition-colors ${
              currentRole === "admin"
                ? "bg-gray-700 opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <Shield size={18} className="text-red-400" />
            <span className="text-white">Администратор</span>
            {currentRole === "admin" && (
              <span className="ml-auto text-yellow-400">✓</span>
            )}
          </button>
        </div>
      )}

      {/* Backdrop для закрытия при клике вне */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
