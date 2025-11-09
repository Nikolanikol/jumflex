"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: "#1a1a1a", // darker
          color: "#ffffff",
          border: "1px solid #2a2a2a", // dark
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
        },

        // Success toast
        success: {
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #FFEB3B", // primary yellow
          },
          iconTheme: {
            primary: "#FFEB3B", // primary yellow
            secondary: "#1a1a1a",
          },
        },

        // Error toast
        error: {
          duration: 5000,
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #FF3B30", // accent red
          },
          iconTheme: {
            primary: "#FF3B30", // accent red
            secondary: "#1a1a1a",
          },
        },

        // Loading toast
        loading: {
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #2a2a2a",
          },
          iconTheme: {
            primary: "#FFEB3B",
            secondary: "#1a1a1a",
          },
        },
      }}
    />
  );
}
