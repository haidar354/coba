import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal2";
import SurveyForm from "./SurveyForm";
import SurveyForm2 from "./SurveyForm2";
import educationIllustration from "../../assets/logo-web-smk4-Photoroom.png";
import api from "@/utils/axios";
export const SchoolInfo = ({ hotReloadGuest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [question, setQuestion] = useState([]);
  const [isSurveyId, setIsSurveyId] = useState(0);
  const [visitorData, setVisitorData] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    masukan: "",
    ratings: {
      kerapian: 0,
      kedisiplinan: 0,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const dateNow = new Date().toISOString().split("T")[0];

        // const d = new Date();
        // d.setDate(d.getDate() - 1); // mundur 1 hari
        // const dateNow = d.toISOString().split("T")[0];
        // Buat config untuk header authorization
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(
          `/api/attendance/guests?start_date=${dateNow}&end_date=${dateNow}`,
          config
        );
        const date = new Date(dateNow);
        const options = { day: "numeric", month: "long", year: "numeric" };

        setVisitorData(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (
      hotReloadGuest &&
      typeof hotReloadGuest === "object" &&
      Object.keys(hotReloadGuest).length === 0
    ) {
      return;
    } else {
      setVisitorData((prev) => [hotReloadGuest, ...prev]);
    }
  }, [hotReloadGuest]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRatingChange = (indicator, rating) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [indicator]: rating,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Survey Data:", formData);
    // Handle survey submission here
    alert("Survei berhasil dikirim!");
    setIsModalOpen(false);
    // Reset form if needed
    setFormData({
      nama: "",
      instansi: "",
      masukan: "",
      ratings: {
        kerapian: 0,
        kedisiplinan: 0,
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 bg-gray rounded-full px-12 py-3 shadow-sm">
            <img
              src={educationIllustration}
              alt=""
              className="object-contain max-w-full max-h-full"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="text-4xl">🏫</div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Selamat Datang di
              </p>
              <h2 className="text-2xl font-bold text-card-foreground">
                SEKOLAH KARSA
              </h2>
            </div>
          </div>

          <div className="bg-primary rounded-lg p-4 text-primary-foreground min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Tingkatkan Rating Sekolah
              </span>
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
              <span className="text-xs opacity-75">{visitorData.length} Responden</span>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleOpenModal}
            >
              Isi Survei →
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Survei Kepuasan"
      >
        <SurveyForm
          formData={formData}
          onInputChange={handleInputChange}
          onRatingChange={handleRatingChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isOpen2={isModalOpen2}
          setIsOpen2={setIsModalOpen2}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          setQuestion={setQuestion}
          setIsSurveyId={setIsSurveyId}
        />
      </Modal>
      <Modal
        isOpen={isModalOpen2}
        onClose={handleCloseModal2}
        title="Masukan dan Saran"
      >
        <SurveyForm2
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isOpen2={isModalOpen2}
          setIsOpen2={setIsModalOpen2}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          setQuestion={setQuestion}
          question={question}
          isSurveyId={isSurveyId}
        />
      </Modal>
    </>
  );
};

export default SchoolInfo;
