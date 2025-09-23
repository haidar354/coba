import { Users } from "lucide-react";

export const VisitorSection = () => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground mb-1">
            Tamu Berkunjung Hari Ini
          </h2>
          <p className="text-sm text-muted-foreground">
            Menampilkan daftar tamu berkunjung terakhir
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          17 Sep 2025
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-8">
        <div className="mb-4 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">0</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          0 Tamu Hari ini.
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Hingga saat ini, belum ada tamu berkunjung.
        </p>
      </div>
    </div>
  );
};