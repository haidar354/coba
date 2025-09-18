import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SchoolInfo = () => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 ">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3 bg-gray rounded-full px-12 py-3 shadow-sm">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-lg text-card-foreground">Pasinaon</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-4xl">🏫</div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Selamat Datang di</p>
            <h2 className="text-2xl font-bold text-card-foreground">SEKOLAH KARSA</h2>
          </div>
        </div>

        <div className="bg-primary rounded-lg p-4 text-primary-foreground min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Tingkatkan Rating Sekolah</span>
            <span className="text-xs opacity-75">⭐</span>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs opacity-75">0 Responden</span>
          </div>
          
          <Button variant="secondary" className="w-full">
            Isi Survei →
          </Button>
        </div>
      </div>
    </div>
  );
};