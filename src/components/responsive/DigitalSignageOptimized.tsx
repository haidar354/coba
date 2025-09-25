// DigitalSignageOptimized.tsx (Made responsive: adjusted grids, fonts, paddings, icons for sm/md/lg)
import React, { useRef, useState, useEffect } from "react";
import { NotificationBanner } from "@/components/NotificationBanner";
import { StatisticsCard } from "@/components/StatisticsCard";
import { VisitorSection } from "@/components/VisitorSection";
import { SchoolInfo } from "@/components/SchoolInfo";
import { GuestForm } from "@/components/GuestForm";
import Modal from "@/components/Modal";
import DaftarSurvei from "@/components/TableView";
import {
  CheckCircle,
  FileText,
  Clock,
  XCircle,
  X,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  User,
  Play,
  Pause,
} from "lucide-react";

const DigitalSignageOptimized = () => {
  const [currentView, setCurrentView] = useState(0); // 0 = Siswa, 1 = Guru
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [category, setCategory] = useState([]);
  const [isAutoSlide, setIsAutoSlide] = useState(true);
  const [autoSlideInterval, setAutoSlideInterval] = useState(10000); // 10 seconds for digital signage

  const containerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  const views = [
    {
      title: "Statistik Siswa Hari ini",
      subtitle: "Menampilkan Statistik Siswa Hari Ini.",
      icon: Users,
      cards: [
        {
          type: "present",
          count: 245,
          label: "HADIR",
          text: "Daftar Siswa Hadir Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "permission",
          count: 12,
          label: "IZIN",
          text: "Daftar Siswa Izin Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "absent",
          count: 8,
          label: "SAKIT",
          text: "Daftar Siswa Sakit Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "late",
          count: 15,
          label: "TERLAMBAT",
          text: "Daftar Siswa Terlambat Hari Ini",
          typeCategory: "siswa",
        },
      ],
    },
    {
      title: "Statistik Guru Hari ini",
      subtitle: "Menampilkan Statistik Guru Hari Ini.",
      icon: User,
      cards: [
        {
          type: "present",
          count: 42,
          label: "HADIR",
          text: "Daftar Guru Hadir Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "permission",
          count: 3,
          label: "IZIN",
          text: "Daftar Guru Izin Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "cuti",
          count: 2,
          label: "CUTI",
          text: "Daftar Guru Cuti Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "dinas",
          count: 1,
          label: "DINAS",
          text: "Daftar Guru Dinas Hari Ini",
          typeCategory: "guru",
        },
      ],
    },
  ];

  // Auto slide functionality
  useEffect(() => {
    if (isAutoSlide) {
      autoSlideIntervalRef.current = setInterval(() => {
        setCurrentView((prev) => (prev + 1) % views.length);
      }, autoSlideInterval);
    } else {
      clearInterval(autoSlideIntervalRef.current);
    }

    return () => clearInterval(autoSlideIntervalRef.current);
  }, [isAutoSlide, autoSlideInterval, views.length]);

  const handleViewChange = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentView(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleCardClick = (text, typeCategory) => {
    setModalTitle("Detail Statistik");
    setModalText(text);
    setCategory(
      typeCategory === "siswa"
        ? ["Semua Kelas", "X PPLG 1", "XI PPLG 1", "XII PPLG 1"]
        : ["Semua Guru", "Guru Produktif", "Guru Normatif", "Guru Adaptif"]
    );
    setIsModalOpen(true);
  };

  const toggleAutoSlide = () => {
    setIsAutoSlide(!isAutoSlide);
  };

  const handleNext = () => {
    if (!isTransitioning) {
      handleViewChange((currentView + 1) % views.length);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      handleViewChange(currentView === 0 ? views.length - 1 : currentView - 1);
    }
  };

  const currentViewData = views[currentView];

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
        {/* Header - School Information Banner */}
        <div className="mb-6 md:mb-8">
          <NotificationBanner />
        </div>

        {/* Main Statistics Display - Optimized for Portrait */}
        <div className="signage-card bg-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <currentViewData.icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-primary" />
              <div>
                <h1 className="signage-text-medium sm:signage-text-large text-card-foreground mb-2">
                  {currentViewData.title}
                </h1>
                <p className="signage-text-small sm:signage-text-base text-muted-foreground">
                  {currentViewData.subtitle}
                </p>
              </div>
            </div>

            {/* Controls for Digital Signage */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="signage-text-small sm:signage-text-base text-muted-foreground">
                17 Sep 2025
              </div>

              {/* Auto slide indicator */}
              <button
                onClick={toggleAutoSlide}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isAutoSlide
                    ? "bg-success text-success-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isAutoSlide ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                )}
                <span className="signage-text-small sm:signage-text-base">
                  {isAutoSlide ? "Auto ON" : "Auto OFF"}
                </span>
              </button>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrev}
                  className="p-2 sm:p-3 rounded-xl bg-secondary hover:bg-muted transition-colors"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 sm:p-3 rounded-xl bg-secondary hover:bg-muted transition-colors"
                  disabled={isTransitioning}
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* View Indicators */}
          <div className="flex justify-center mb-6 md:mb-8 gap-3 sm:gap-4">
            {views.map((_, index) => (
              <button
                key={index}
                onClick={() => handleViewChange(index)}
                className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full transition-all duration-300 ${
                  index === currentView
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* Statistics Cards - Portrait Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {currentViewData.cards.map((card, cardIndex) => (
              <StatisticsCard
                key={`${currentView}-${cardIndex}`}
                type={card.type}
                count={card.count}
                label={card.label}
                text={card.text}
                onClick={() => handleCardClick(card.text, card.typeCategory)}
              />
            ))}
          </div>

          {/* Status indicator for auto-slide */}
          {isAutoSlide && (
            <div className="mt-6 md:mt-8 text-center">
              <p className="signage-text-small sm:signage-text-base text-muted-foreground">
                Berganti otomatis setiap {autoSlideInterval / 1000} detik
              </p>
            </div>
          )}
        </div>

        {/* Additional Information Sections - Portrait Stack */}
        <div className="space-y-6 md:space-y-8">
          {/* Visitor Section */}
          <VisitorSection />

          {/* School Info & Guest Registration */}
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <SchoolInfo />

            {/* Guest Form Section */}
            <div className="signage-card bg-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <h2 className="signage-text-small sm:signage-text-medium text-card-foreground mb-2">
                  E-Guestbook
                </h2>
                <p className="signage-text-small sm:signage-text-base text-muted-foreground">
                  Silakan isi data diri untuk keperluan kunjungan
                </p>
              </div>
              <GuestForm />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for detailed view */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <DaftarSurvei text={modalText} category={category} />
      </Modal>
    </div>
  );
};

export default DigitalSignageOptimized;
