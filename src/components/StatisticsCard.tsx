import { CheckCircle, FileText, Clock, XCircle } from "lucide-react";

export const StatisticsCard = ({ type, count, label, onClick }) => {
  const getCardStyles = () => {
    switch (type) {
      case "present":
        return "bg-green-500 text-white";
      case "permission":
        return "bg-blue-500 text-white";
      case "late":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-red-500 text-white";
      case "cuti":
        return "bg-teal-500 text-white";
      case "dinas":
        return "bg-purple-500 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "present":
        return <CheckCircle className="w-12 h-12" />;
      case "permission":
        return <FileText className="w-12 h-12" />;
      case "late":
        return <Clock className="w-12 h-12" />;
      case "absent":
        return <XCircle className="w-12 h-12" />;
      default:
        return <CheckCircle className="w-12 h-12" />;
    }
  };

  return (
    <div
      className={`${getCardStyles()} rounded-xl p-8 relative overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-5xl font-bold mb-3">{count}</div>
          <div className="text-lg font-semibold uppercase tracking-wide">
            {label}
          </div>
        </div>
        <div className="opacity-40">{getIcon()}</div>
      </div>
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20,80 Q50,20 80,80 L80,100 L20,100 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default StatisticsCard;
