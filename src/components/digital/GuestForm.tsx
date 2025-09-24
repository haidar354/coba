import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { StatisticsCard } from "@/components/digital/StatisticsCardCustom";
import api from "@/utils/axios";
export const GuestForm = ({ setHotReloadGuest }) => {
  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    tujuan: "",
    signature: null,
  });
  const [isLoading, setIsloading] = useState(false);

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


  const handleSubmit = async () => {
    // Validasi form
    if (!formData.nama || !formData.instansi || !formData.tujuan) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    // Validasi karakter yang tidak diizinkan pada nama
    const invalidCharsRegex = /[0-9@#$%&*+=<>?{}[\]|\\:";,^~`!]/;
    if (invalidCharsRegex.test(formData.nama)) {
      toast.error("Nama tidak boleh mengandung angka atau simbol khusus");
      return;
    }

    // Validasi untuk emoji dan karakter unicode lainnya
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(formData.nama)) {
      toast.error("Nama tidak boleh mengandung emoji");
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      toast.error("Mohon buat tanda tangan terlebih dahulu");
      return;
    }

    try {
      setIsloading(true);
      const signatureDataURL = signatureRef.current?.toDataURL();

      // Convert base64 to blob
      const base64Data = signatureDataURL.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const formDataToSend = new FormData();

      // Sesuaikan dengan field yang diharapkan backend
      formDataToSend.append("full_name", formData.nama); // Backend expects 'full_name'
      formDataToSend.append("address", formData.instansi); // Backend expects 'address'
      formDataToSend.append("purpose", formData.tujuan); // Backend expects 'purpose'
      formDataToSend.append("signature", blob, "signature.png"); // File signature

      // Hit endpoint yang benar: /attendance/guests
      const response = await api.post(
        `/api/attendance/guests`, // Endpoint yang benar
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Reset form setelah berhasil submit
        setFormData({
          nama: "",
          instansi: "",
          tujuan: "",
          signature: null,
        });
        setHotReloadGuest(response.data);
        signatureRef.current?.clear();
        setIsloading(false);

        // Tampilkan notifikasi berhasil
        toast.success("Data berhasil ditambahkan!");
      }
    } catch (error) {
      setIsloading(false);
      console.error("Error submitting guest data:", error);

      // Handle berbagai jenis error
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);

        // Tampilkan pesan error berdasarkan status code
        switch (error.response.status) {
          case 400:
            toast.error("Data yang dikirim tidak valid");
            break;
          case 422:
            // Jika ada validasi error dari backend
            if (error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Menggunakan karakter yang tidak diizinkan");
            }
            break;
          case 500:
            toast.error("Terjadi kesalahan pada server");
            break;
          default:
            toast.error("Gagal menambahkan data");
        }
      } else if (error.request) {
        // Network error
        toast.error("Tidak dapat terhubung ke server");
      } else {
        // Error lainnya
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    }
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
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
          ) : (
            "Konfirmasi Data"
          )}
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
          <a href="/tu/dashboard">
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
