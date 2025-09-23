import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Send } from "lucide-react";


const SurveyForm = ({ isOpen2, setIsOpen2, isOpen ,setIsOpen , setQuestion }) => {
  const [surveyData, setSurveyData] = useState({
    name: "",
    institution: "",
    scores: {
      kerapian: "",
      kedisiplinan: "",
    },
    feedback: "",
  });

  

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

  const handleSubmit = () => {
    console.log("Survey submitted:", surveyData);
    // Handle form submission here
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
      id: "kerapian",
      title: "Kerapian",
      description: "Sudah Rapi?",
      question: [
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
      ],
    },
    {
      id: "kedisiplinan",
      title: "Kedisiplinan",
      description: "Apakah ini disiplin",
      question: [
        {
          id: "datang",
          title: "Datang",
          description: "ada yang terlambat?",
        },
        {
          id: "piket",
          title: "Piket",
          description: "Sudah berjalan?",
        },
      ],
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

        
        {/* Survey Section */}
        <div className="mb-8">
          <h2 className="text-survey-label font-semibold text-sm mb-6 tracking-wide">
            DAFTAR SURVEI
          </h2>

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
                 Aksi
                </div>
              </div>
            </div>

            {surveyQuestions.map((question, index) => (
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
                      {question.title}
                    </div>
                    <div className="text-survey-subtitle text-sm">
                      {question.description}
                    </div>
                  </div>
                  <div className="col-span-5">
                    {/* <RadioGroup
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
                    </RadioGroup> */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsOpen2(true);
                        setIsOpen(false);
                        setQuestion(question.question);
                      }}
                      className="px-4 py-2 border-survey-button-cancel text-survey-button-cancel-text hover:bg-gray-100"
                    >
                      Isi Survey
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {setIsOpen(false)}}
            className="px-6 py-2 bg-survey-button-cancel border-survey-button-cancel text-survey-button-cancel-text hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
