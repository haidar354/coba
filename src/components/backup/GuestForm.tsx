import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export const GuestForm = () => {
  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    tujuan: "",
    signature: null,
  });

  const signatureRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setFormData((prev) => ({
      ...prev,
      signature: null,
    }));
  };

  const saveSignature = () => {
    if (signatureRef.current?.isEmpty()) {
      alert("Mohon buat tanda tangan terlebih dahulu");
      return;
    }

    const signatureData = signatureRef.current?.toDataURL();
    setFormData((prev) => ({
      ...prev,
      signature: signatureData,
    }));
  };

  const handleSubmit = () => {
    // Simpan signature sebelum submit
    saveSignature();

    // Validasi form
    if (!formData.nama || !formData.instansi || !formData.tujuan) {
      alert("Mohon lengkapi semua data");
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      alert("Mohon buat tanda tangan terlebih dahulu");
      return;
    }

    // Process form data
    console.log("Form submitted:", {
      ...formData,
      signature: signatureRef.current?.toDataURL(),
    });
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <p className="text-sm text-muted-foreground mb-6">
        Untuk melanjutkan silahkan isi data diri pada E-Guestbook dibawah ini.
      </p>

      <div className="space-y-6">
        <div>
          <Label
            htmlFor="nama"
            className="text-sm font-medium text-card-foreground"
          >
            Nama
          </Label>
          <Input
            id="nama"
            placeholder="Masukan Nama Anda"
            value={formData.nama}
            onChange={(e) => handleInputChange("nama", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor="instansi"
            className="text-sm font-medium text-card-foreground"
          >
            Instansi
          </Label>
          <Input
            id="instansi"
            placeholder="Masukan Instansi"
            value={formData.instansi}
            onChange={(e) => handleInputChange("instansi", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor="tujuan"
            className="text-sm font-medium text-card-foreground"
          >
            Tujuan
          </Label>
          <Textarea
            id="tujuan"
            placeholder="Masukan Tujuan / Kepentingan dari kunjungan Anda"
            value={formData.tujuan}
            onChange={(e) => handleInputChange("tujuan", e.target.value)}
            className="mt-2 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-card-foreground mb-3 block">
            Tanda Tangan
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30 relative">
            {/* Signature Canvas */}
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas w-full h-32 border-0 rounded",
                style: {
                  border: "none",
                  borderRadius: "8px",
                  background: "transparent",
                },
              }}
              backgroundColor="rgba(255,255,255,0)"
              onEnd={saveSignature}
            />

            {/* Clear button */}
            <button
              type="button"
              onClick={clearSignature}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
              title="Hapus tanda tangan"
            >
              ×
            </button>

            {/* Placeholder text when empty */}
            {signatureRef.current?.isEmpty() !== false && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-muted-foreground text-sm text-center">
                  Tanda tangan di sini menggunakan mouse atau sentuhan
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-medium"
        >
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

export default GuestForm;
