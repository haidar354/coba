// StatisticsCard.tsx (Made responsive: adjusted fonts, icons, paddings for sm/md/lg)
import { CheckCircle, FileText, Library, Clock, XCircle } from "lucide-react";

export const StatisticsCard = ({ type, count, label, text, onClick }) => {
  const getCardStyles = () => {
    switch (type) {
      case "present":
        return "bg-success text-success-foreground";
      case "permission":
        return "bg-info text-info-foreground";
      case "late":
        return "bg-warning text-warning-foreground";
      case "absent":
        return "bg-error text-error-foreground";
      case "alpha":
        return "bg-danger text-danger-foreground";
      case "cuti":
        return "bg-orange text-orange-foreground";
      case "dinas":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "present":
        return (
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        );
      case "permission":
        return <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />;
      case "late":
        return <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />;
      case "absent":
        return <XCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />;
      case "alpha":
        return <Library className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />;
      default:
        return (
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        );
    }
  };

  return (
    <div
      className={`${getCardStyles()} rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 signage-card border-2 border-transparent hover:border-white/20`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            {count}
          </div>
          <div className="text-xl sm:text-2xl font-bold uppercase tracking-wide leading-tight">
            {label}
          </div>
        </div>
        <div className="opacity-30 text-4xl sm:text-5xl md:text-6xl">
          {getIcon()}
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20,80 Q50,20 80,80 L80,100 L20,100 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default StatisticsCard;
