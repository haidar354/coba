import React from "react";

// Spinner dengan Tailwind CSS
export const TailwindSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
    </div>
  );
};

// Spinner dengan inline styles sebagai fallback
export const InlineSpinner = () => {
  return (
    <div
      className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500"
      style={{
        animation: "spin 1s linear infinite",
      }}
    ></div>
  );
};

// Spinner dengan CSS custom class
export const CustomSpinner = () => {
  return (
    <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 custom-spinner"></div>
  );
};

// Test component untuk melihat semua spinner
export const SpinnerTest = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tailwind animate-spin:</h3>
        <TailwindSpinner />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Inline style:</h3>
        <InlineSpinner />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Custom CSS class:</h3>
        <CustomSpinner />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Your original code:</h3>
        <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default SpinnerTest;
