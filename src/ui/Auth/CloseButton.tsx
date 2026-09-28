import React from "react";
import { X } from "lucide-react";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<
  CloseButtonProps
> = ({ onClose }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label="Close"
    className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
  >
    <X size={16} />
  </button>
);

export default CloseButton;