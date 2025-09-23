import { Users } from "lucide-react";

export const VisitorSection = () => {
  return (
    <div className="signage-card bg-card rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="signage-text-medium text-card-foreground mb-2">
            Tamu Berkunjung Hari Ini
          </h2>
          <p className="signage-text-base text-muted-foreground">
            Menampilkan daftar tamu berkunjung terakhir
          </p>
        </div>
        <div className="signage-text-base text-muted-foreground font-semibold">
          17 Sep 2025
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="signage-text-base font-bold text-primary-foreground">0</span>
          </div>
        </div>
        <h3 className="signage-text-medium text-card-foreground mb-4">
          0 Tamu Hari ini
        </h3>
        <p className="signage-text-base text-muted-foreground text-center leading-relaxed">
          Hingga saat ini, belum ada tamu berkunjung.
        </p>
      </div>
    </div>
  );
};