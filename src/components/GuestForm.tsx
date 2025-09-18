import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const GuestForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    tujuan: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <p className="text-sm text-muted-foreground mb-6">
        Untuk melanjutkan silahkan isi data diri pada E-Guestbook dibawah ini.
      </p>

      <div className="space-y-6">
        <div>
          <Label htmlFor="nama" className="text-sm font-medium text-card-foreground">
            Nama
          </Label>
          <Input
            id="nama"
            placeholder="Masukan Nama Anda"
            value={formData.nama}
            onChange={(e) => handleInputChange('nama', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="instansi" className="text-sm font-medium text-card-foreground">
            Instansi
          </Label>
          <Input
            id="instansi"
            placeholder="Masukan Instansi"
            value={formData.instansi}
            onChange={(e) => handleInputChange('instansi', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="tujuan" className="text-sm font-medium text-card-foreground">
            Tujuan
          </Label>
          <Textarea
            id="tujuan"
            placeholder="Masukan Tujuan / Kepentingan dari kunjungan Anda"
            value={formData.tujuan}
            onChange={(e) => handleInputChange('tujuan', e.target.value)}
            className="mt-2 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-card-foreground mb-3 block">
            Tanda Tangan
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30 relative">
            <div className="absolute top-3 right-3 w-8 h-8 bg-danger rounded-full flex items-center justify-center">
              <span className="text-danger-foreground text-sm">✕</span>
            </div>
            <div className="h-32 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">
                Area untuk tanda tangan digital
              </p>
            </div>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-medium">
          Konfirmasi Data
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">atau</span>
        </div>

        <div className="text-center">
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Keluar Dari Papan Informasi
          </button>
        </div>
      </div>
    </div>
  );
};