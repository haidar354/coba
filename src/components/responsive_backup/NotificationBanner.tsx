import { InfoIcon } from "lucide-react";

export const NotificationBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground px-12 py-8 rounded-2xl shadow-xl signage-card">
      <div className="flex items-start gap-8">
        <InfoIcon className="w-12 h-12 mt-1 flex-shrink-0" />
        <div>
          <h3 className="signage-text-large mb-4">
            Informasi Aktivitas Kepala Sekolah
          </h3>
          <p className="signage-text-base opacity-95 leading-relaxed">
            Kepala Sekolah hadir di sekolah. Silakan menghubungi Bagian TU untuk
            koordinasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
};
