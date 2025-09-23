import {
  CheckCircle,
  FileText,
  LogOut,
  LayoutDashboard,
  Clock,
  XCircle,
} from "lucide-react";

export const StatisticsCard = ({ type, count, label, text }) => {
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
      case "sekolah":
        return "bg-blue-600 text-white"; // Biru akademis
      // atau
      // return "bg-green-600 text-white"; // Hijau pendidikan
      // atau
      // return "bg-indigo-600 text-white"; // Ungu kebiruan formal
      case "responsive":
        // return "bg-emerald-600 text-white"; // Hijau teknologi
        // atau
        // return "bg-cyan-600 text-white"; // Biru cyan modern
        // atau
        return "bg-purple-600 text-white"; // Ungu digital

      case "dinas":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };
  const linkCustom = () => {
    switch (type) {
      case "sekolah":
        return "https://smkn4jogja.sch.id/";
      case "responsive":
        return "/guest-visits/landing/responsive";
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

      case "sekolah":
        return <LogOut className="w-12 h-12" />;
      case "responsive":
        return <LogOut className="w-12 h-12" />;
      default:
        return <CheckCircle className="w-12 h-12" />;
    }
  };

  return (
    <div
      className={`${getCardStyles()} rounded-2xl p-8 relative overflow-hidden shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 signage-card border-2 border-transparent hover:border-white/20 `}
    >
      <a href={linkCustom()}>
        <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-2xl font-bold uppercase tracking-wide leading-tight">
            {label}
          </div>
        </div>
        <div className="opacity-30 text-6xl">{getIcon()}</div>
      </div>
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10"></div>
      </a>
    </div>
  );
};

export default StatisticsCard;
