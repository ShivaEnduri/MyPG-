import React, {
  useEffect,
  useState,
} from "react";

interface Toast {
  type: "success" | "error";
  text: string;
}

const MessageToast: React.FC = () => {
  const [toast, setToast] =
    useState<Toast | null>(null);

  useEffect(() => {
    let timeout: number | undefined;

    const handler = (
      e: Event
    ) => {
      const customEvent =
        e as CustomEvent<Toast>;

      setToast(customEvent.detail);

      if (timeout) {
        window.clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        setToast(null);
      }, 3500);
    };

    window.addEventListener(
      "showToast",
      handler
    );

    return () => {
      window.removeEventListener(
        "showToast",
        handler
      );

      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div className="absolute left-4 right-4 top-4 z-30">
      <div
        className={`rounded-xl border px-4 py-3 text-center text-xs font-medium shadow-lg ${
          toast.type === "success"
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {toast.text}
      </div>
    </div>
  );
};

export default MessageToast;