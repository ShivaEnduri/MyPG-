import React, { FC, useEffect, useState } from "react";
import { X } from "lucide-react";

export interface UpdateField {
  key: string;
  label: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
}

interface UpdateDetailsModalProps {
  open: boolean;
  title: string;
  description?: string;
  fields: UpdateField[];
  initialValues: Record<string, string>;
  saving?: boolean;
  submitText?: string;
  accent?: "blue" | "orange";
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

const UpdateDetailsModal: FC<UpdateDetailsModalProps> = ({
  open,
  title,
  description,
  fields,
  initialValues,
  saving = false,
  submitText = "Save Changes",
  accent = "blue",
  onClose,
  onSubmit,
}) => {
  const [values, setValues] =
    useState<Record<string, string>>(initialValues);

  const [validationError, setValidationError] =
    useState("");

  // ----------------------------------------------------------
  // LOAD OLD VALUES WHEN MODAL OPENS
  // ----------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    setValues(initialValues);
    setValidationError("");
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (
    key: string,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async () => {
    const requiredField = fields.find(
      (field) =>
        field.required !== false &&
        !String(values[field.key] || "").trim()
    );

    if (requiredField) {
      setValidationError(
        `${requiredField.label} is required.`
      );
      return;
    }

    await onSubmit(values);
  };

  const accentClasses =
    accent === "orange"
      ? {
          focus:
            "focus:border-orange-400 focus:ring-orange-100",
          button:
            "bg-orange-500 hover:bg-orange-600",
        }
      : {
          focus:
            "focus:border-blue-400 focus:ring-blue-100",
          button:
            "bg-blue-600 hover:bg-blue-700",
        };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/30
        px-3
        backdrop-blur-[2px]
      "
      onClick={() => {
        if (!saving) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[420px]
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-xl

          sm:p-5
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h2
              className="
                text-sm
                font-bold
                text-slate-900

                sm:text-base
              "
            >
              {title}
            </h2>

            {description && (
              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-500

                  sm:text-xs
                "
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="
              ml-3
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <div className="mt-4 space-y-3">
          {fields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`update-${field.key}`}
                className="
                  mb-1
                  block
                  text-[10px]
                  font-semibold
                  text-slate-700

                  sm:text-xs
                "
              >
                {field.label}
              </label>

              <input
                id={`update-${field.key}`}
                type={field.type || "text"}
                value={values[field.key] ?? ""}
                disabled={saving}
                placeholder={field.placeholder}
                onChange={(event) =>
                  handleChange(
                    field.key,
                    event.target.value
                  )
                }
                className={`
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2
                  text-xs
                  text-slate-800
                  outline-none
                  transition
                  ${accentClasses.focus}
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                  disabled:text-slate-400
                `}
              />
            </div>
          ))}
        </div>

        {/* ==================================================
            VALIDATION
        ================================================== */}

        {validationError && (
          <p
            className="
              mt-3
              rounded-lg
              bg-red-50
              px-3
              py-2
              text-[10px]
              font-medium
              text-red-600

              sm:text-xs
            "
          >
            {validationError}
          </p>
        )}

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            mt-5
            flex
            justify-end
            gap-2
          "
        >
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="
              rounded-lg
              border
              border-slate-200
              px-3
              py-2
              text-[10px]
              font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:text-xs
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className={`
              rounded-lg
              px-3
              py-2
              text-[10px]
              font-semibold
              text-white
              transition-colors
              disabled:cursor-not-allowed
              disabled:opacity-60

              sm:text-xs

              ${accentClasses.button}
            `}
          >
            {saving ? "Saving..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDetailsModal;