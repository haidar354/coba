import { InfoIcon } from "lucide-react";

export const NotificationBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground px-8 py-6 rounded-xl">
      <div className="flex items-start gap-6">
        <InfoIcon className="w-8 h-8 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-2xl mb-2">
            Informasi Aktivitas Kepala Sekolah :
          </h3>
          <p className="text-xl opacity-95">
            Kepala Sekolah hadir di sekolah. Silakan menghubungi Bagian TU untuk
            koordinasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
};
