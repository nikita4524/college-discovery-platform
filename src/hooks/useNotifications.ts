"use client";

import toast from "react-hot-toast";

export function useNotifications() {
  const notify = async (
    message: string,
    type: "save" | "compare" | "success" | "error" | "info" = "success"
  ) => {
    if (type === "error") toast.error(message);
    else if (type === "info") toast(message);
    else toast.success(message);

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          type: type === "info" ? "success" : type,
        }),
      });
    } catch {
      // demo: toast still works without auth
    }
  };

  return { notify };
}
