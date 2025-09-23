import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { StatisticsCard } from "@/components/digital/StatisticsCardCustom";
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
    <div className="space-y-8">
      <p className="signage-text-base text-muted-foreground">
        Untuk melanjutkan silahkan isi data diri pada E-Guestbook dibawah ini.
      </p>

      <div className="space-y-8">
        <div>
          <Label
            htmlFor="nama"
            className="signage-text-base font-semibold text-card-foreground"
          >
            Nama
          </Label>
          <Input
            id="nama"
            placeholder="Masukan Nama Anda"
            value={formData.nama}
            onChange={(e) => handleInputChange("nama", e.target.value)}
            className="mt-3 text-lg p-4"
          />
        </div>

        <div>
          <Label
            htmlFor="instansi"
            className="signage-text-base font-semibold text-card-foreground"
          >
            Instansi
          </Label>
          <Input
            id="instansi"
            placeholder="Masukan Instansi"
            value={formData.instansi}
            onChange={(e) => handleInputChange("instansi", e.target.value)}
            className="mt-3 text-lg p-4"
          />
        </div>

        <div>
          <Label
            htmlFor="tujuan"
            className="signage-text-base font-semibold text-card-foreground"
          >
            Tujuan
          </Label>
          <Textarea
            id="tujuan"
            placeholder="Masukan Tujuan / Kepentingan dari kunjungan Anda"
            value={formData.tujuan}
            onChange={(e) => handleInputChange("tujuan", e.target.value)}
            className="mt-3 min-h-[120px] text-lg p-4"
          />
        </div>

        <div>
          <Label className="signage-text-base font-semibold text-card-foreground mb-4 block">
            Tanda Tangan
          </Label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/30 relative">
            {/* Signature Canvas */}
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 600,
                height: 250,
                className: "signature-canvas w-full h-40 border-0 rounded",
                style: {
                  border: "none",
                  borderRadius: "12px",
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
              className="absolute top-3 right-3 w-10 h-10 bg-error hover:bg-error/80 rounded-full flex items-center justify-center text-error-foreground text-lg transition-colors"
              title="Hapus tanda tangan"
            >
              ×
            </button>

            {/* Placeholder text when empty */}
            {signatureRef.current?.isEmpty() !== false && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-muted-foreground signage-text-base text-center">
                  Tanda tangan di sini menggunakan mouse atau sentuhan
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full py-6 signage-text-base font-semibold"
          size="lg"
        >
          Konfirmasi Data
        </Button>

        <div className="text-center">
          <span className="signage-text-base text-muted-foreground">atau</span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <StatisticsCard
            type={"sekolah"}
            count={20}
            label={"SMK Negeri 4 Yogyakarta"}
            // text={card.text}
            // onClick={() => handleCardClick(card.text, card.typeCategory)}
          />
          <StatisticsCard
            type={"responsive"}
            count={20}
            label={"Tampilan Laptop"}
            // text={card.text}
            // onClick={() => handleCardClick(card.text, card.typeCategory)}
          />
        </div>

        <div className="text-center">
          <a href="/dashboard">
            <button className="text-primary hover:text-primary/80 signage-text-base font-medium">
              Keluar Dari Papan Informasi
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
