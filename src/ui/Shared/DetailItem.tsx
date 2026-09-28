import React from "react";

interface DetailItemProps {
  label: string;
  value?: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div className="bg-white border rounded-lg p-3">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">
        {value ?? "N/A"}
      </p>
    </div>
  );
};

export default DetailItem;
