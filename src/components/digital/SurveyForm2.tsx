import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Send } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/utils/axios";
const SurveyForm = ({
  isOpen2,
  setIsOpen2,
  isOpen,
  setIsOpen,
  question,
  isSurveyId,
}) => {
  const [surveyData, setSurveyData] = useState({
    name: "",
    institution: "",
    scores: {
      kerapian: "",
      kedisiplinan: "",
    },
    feedback: "",
  });
  const [IsloadingQuestion, setIsloadingQuestion] = useState(false);

  const handleInputChange = (field, value) => {
    setSurveyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScoreChange = (indicator, score) => {
    setSurveyData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [indicator]: score,
      },
    }));
  };
  const generateCustomSurveyResponses = (questions , id) => {
    const responses = [];

    questions.forEach((question, index) => {
      const data = surveyData.scores[question.id];
      responses.push({
        id_survey: question.id_survey,
        id_survey_question: question.id,
        id_survey_surveyor: id,
        score: parseInt(data),
      });
    });

    return {
      responses: responses,
    };
  };


  const handleSubmit = async () => {
    setIsloadingQuestion(true);
  
    try {
      // Create the body object and filter out empty string values
      const body = {
        id_survey: isSurveyId,
        name: surveyData.name,
        organization: surveyData.institution,
        feedback: surveyData.feedback,
      };
      const filteredBody = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== "")
      );
  
      const response = await api.post(`api/academic/surveyors`, filteredBody);
  
      if (response.status === 201) {
        try {
          const data = generateCustomSurveyResponses(question, response.data.id);
          const response2 = await api.post(`/api/academic/responses/bulk`, data);
          setIsloadingQuestion(false);
  
          toast.success("Data survei berhasil dikirim!");
          return response2.data;
        } catch (error) {
          console.error("Error submitting survey responses:", error);
          setIsloadingQuestion(false);
  
          if (error.response) {
            switch (error.response.status) {
              case 400:
                toast.error("Data jawaban survei tidak valid");
                break;
              case 422:
                toast.error("Format jawaban survei salah");
                break;
              case 500:
                toast.error("Gagal menyimpan jawaban survei");
                break;
              default:
                toast.error("Gagal mengirim jawaban survei");
            }
          } else if (error.request) {
            toast.error("Tidak dapat terhubung ke server");
          } else {
            toast.error("Terjadi kesalahan yang tidak terduga");
          }
  
          throw error;
        }
      }
    } catch (error) {
      console.error("Error submitting surveyor data:", error);
      setIsloadingQuestion(false);
  
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
  
        switch (error.response.status) {
          case 400:
            toast.error("Data yang dikirim tidak valid");
            break;
          case 422:
            if (error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Data menggunakan format yang tidak diizinkan");
            }
            break;
          case 409:
            toast.error("Data survei sudah ada sebelumnya");
            break;
          case 500:
            toast.error("Terjadi kesalahan pada server");
            break;
          default:
            toast.error("Gagal mengirim data survei");
        }
      } else if (error.request) {
        toast.error("Tidak dapat terhubung ke server");
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
  
      throw error;
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    setSurveyData({
      name: "",
      institution: "",
      scores: {
        kerapian: "",
        kedisiplinan: "",
      },
      feedback: "",
    });
  };

  const ratingLabels = [
    "1. SANGAT KURANG",
    "2. KURANG",
    "3. CUKUP",
    "4. BAIK",
    "5. SANGAT BAIK",
  ];

  const surveyQuestions = [
    {
      id: "pakaian",
      title: "Pakaian",
      description: "Sudah Rapi?",
    },
    {
      id: "celana",
      title: "Celana",
      description: "Sudah Rapi?",
    },
  ];

  return (
    <div className=" bg-gray-100 flex items-center justify-center ">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-survey-title mb-4">
            Survei
          </h1>
          <p className="text-survey-subtitle text-sm leading-relaxed">
            Dengan mengisi survei, Anda membantu kami meningkatkan kualitas
            pendidikan di sekolah. Suara Anda sangat berarti bagi kami!
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Label
              htmlFor="name"
              className="text-survey-label text-sm font-medium mb-2 block"
            >
              Nama (Opsional)
            </Label>
            <Input
              id="name"
              value={surveyData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-survey-border focus:border-survey-input-focus focus:ring-survey-input-focus"
              maxLength={100}
            />
            <div className="text-right text-xs text-survey-subtitle mt-1">
              {surveyData.name.length} / 100
            </div>
          </div>
          <div>
            <Label
              htmlFor="institution"
              className="text-survey-label text-sm font-medium mb-2 block"
            >
              Instansi (Opsional)
            </Label>
            <Input
              id="institution"
              value={surveyData.institution}
              onChange={(e) => handleInputChange("institution", e.target.value)}
              className="border-border focus:border-survey-input-focus focus:ring-survey-input-focus"
            />
          </div>
        </div>

        {/* Survey Section */}
        <div className="mb-8">
          <h2 className="text-survey-label font-semibold text-sm mb-6 tracking-wide">
            SURVEI
          </h2>

          {/* Rating Scale Legend */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-survey-label text-sm font-medium">
                TABEL SKOR:
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              {ratingLabels.map((label, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-survey-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-border">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-survey-label text-sm font-medium">
                  NO
                </div>
                <div className="col-span-6 text-survey-label text-sm font-medium">
                  INDIKATOR SURVEI
                </div>
                <div className="col-span-5 text-survey-label text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  SKOR
                </div>
              </div>
            </div>

            {question.map((question, index) => (
              <div
                key={question.id}
                className="px-6 py-4 border-b border-border last:border-b-0"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-survey-title text-sm">
                    {index + 1}
                  </div>
                  <div className="col-span-6">
                    <div className="text-survey-title text-sm font-medium">
                      {question.question}
                    </div>
                    <div className="text-survey-subtitle text-sm">
                      {question.description}
                    </div>
                  </div>
                  <div className="col-span-5">
                    <RadioGroup
                      value={surveyData.scores[question.id]}
                      onValueChange={(value) =>
                        handleScoreChange(question.id, value)
                      }
                      className="flex gap-4"
                    >
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div
                          key={score}
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value={score.toString()}
                            id={`${question.id}-${score}`}
                            className="border-gray-300 text-primary"
                          />
                          <Label
                            htmlFor={`${question.id}-${score}`}
                            className="text-sm text-survey-label cursor-pointer"
                          >
                            {score}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-8">
          <Label
            htmlFor="feedback"
            className="text-survey-label text-sm font-medium mb-2 block"
          >
            Masukkan (Opsional)
          </Label>
          <Textarea
            id="feedback"
            value={surveyData.feedback}
            onChange={(e) => handleInputChange("feedback", e.target.value)}
            className="min-h-[120px] border-border focus:border-survey-input-focus focus:ring-survey-input-focus resize-none"
            placeholder=""
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen2(false);
              setIsOpen(true);
            }}
            className="px-6 py-2 bg-survey-button-cancel border-survey-button-cancel text-survey-button-cancel-text hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-2" />
            {IsloadingQuestion ? (
              <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
