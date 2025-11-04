"use client";

import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

export default function PaymentMethod({
  selectedMethod,
  onChange,
}: PaymentMethodProps) {
  const methods = [
    {
      id: "card",
      name: "Банковская карта",
      description: "Visa, Mastercard",
      icon: CreditCard,
    },
    {
      id: "transfer",
      name: "Банковский перевод",
      description: "Оплата по реквизитам",
      icon: Wallet,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Способ оплаты</h2>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`w-full card p-4 flex items-center gap-4 transition-all ${
                isSelected
                  ? "border-2 border-primary"
                  : "hover:border-primary/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? "bg-primary/20" : "bg-lighter"
                }`}
              >
                <Icon
                  size={24}
                  className={isSelected ? "text-primary" : "text-secondary"}
                />
              </div>

              <div className="flex-1 text-left">
                <h3 className="font-semibold text-white">{method.name}</h3>
                <p className="text-sm text-secondary">{method.description}</p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-primary" : "border-dark"
                }`}
              >
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedMethod === "card" && (
        <div className="mt-4 p-4 bg-lighter rounded-xl">
          <p className="text-sm text-secondary">
            После оформления заказа вы будете перенаправлены на безопасную
            страницу оплаты
          </p>
        </div>
      )}

      {selectedMethod === "transfer" && (
        <div className="mt-4 p-4 bg-lighter rounded-xl">
          <p className="text-sm text-secondary mb-2">
            Реквизиты для оплаты будут отправлены на ваш email после
            подтверждения заказа
          </p>
        </div>
      )}
    </div>
  );
}
