import React, { useRef, useState, useEffect } from "react";
import { NotificationBanner } from "@/components/responsive/NotificationBanner";
import { StatisticsCard } from "@/components/responsive/StatisticsCard";
import { VisitorSection } from "@/components/responsive/VisitorSection";
import { SchoolInfo } from "@/components/responsive/SchoolInfo";
import { GuestForm } from "@/components/responsive/GuestForm";
import Modal from "@/components/responsive/Modal";
import DaftarSurvei from "@/components/responsive/TableView";
import api from "@/utils/axios";
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
  View,
} from "lucide-react";

const DigitalSignageOptimized = () => {
  const [currentView, setCurrentView] = useState(0); // 0 = Siswa, 1 = Guru
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [typeGet, setTypeGet] = useState("");
  const [info, setInfo] = useState({});
  const [isAutoSlide, setIsAutoSlide] = useState(true);
  const [hotReloadGuest, setHotReloadGuest] = useState({});
  const [autoSlideInterval, setAutoSlideInterval] = useState(10000); // 10 seconds for digital signage

  const containerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Swipe/drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [dataSiswa, setDataSiswa] = useState({
    statistics: {
      hadir: 0,
      izin: 0,
      sakit: 0,
      alpha: 0,
      terlambat: 0,
    },
  });

  const [dataGuru, setDataGuru] = useState({
    statistics: {
      hadir: 0,
      izin: 0,
      sakit: 0,
      alpha: 0,
      terlambat: 0,
      cuti: 0,
      dinas: 0,
    },
  });
  const [views, setViews] = useState([
    {
      title: "Statistik Siswa Hari ini",
      subtitle: "Menampilkan Statistik Siswa Hari Ini.",
      icon: Users,
      cards: [
        {
          type: "present",
          count: 0,
          label: "HADIR",
          text: "Daftar Siswa Hadir Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "permission",
          count: 0,
          label: "IZIN",
          text: "Daftar Siswa Izin Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "absent",
          count: 0,
          label: "SAKIT",
          text: "Daftar Siswa Sakit Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "alpha",
          count: 0,
          label: "ALPHA",
          text: "Daftar Siswa Alpha Hari Ini",
          typeCategory: "siswa",
        },
        {
          type: "late",
          count: 0,
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
          count: 0,
          label: "HADIR",
          text: "Daftar Guru Hadir Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "permission",
          count: 0,
          label: "IZIN",
          text: "Daftar Guru Izin Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "absent",
          count: 0,
          label: "SAKIT",
          text: "Daftar Guru Sakit Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "alpha",
          count: 0,
          label: "ALPHA",
          text: "Daftar Guru Alpha Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "late",
          count: 0,
          label: "TERLAMBAT",
          text: "Daftar Guru Terlambat Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "cuti",
          count: 0,
          label: "CUTI",
          text: "Daftar Guru Cuti Hari Ini",
          typeCategory: "guru",
        },
        {
          type: "dinas",
          count: 0,
          label: "DINAS",
          text: "Daftar Guru Dinas Hari Ini",
          typeCategory: "guru",
        },
      ],
    },
  ]);
  const swipeThreshold = 50;
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const dateNow = new Date().toISOString().split("T")[0];

        const d = new Date();
        d.setDate(d.getDate() - 1); // mundur 1 hari
        const dateNow = d.toISOString().split("T")[0];
        const response = await api.get(
          `/api/attendance/stats?start_date=${dateNow}&end_date=${dateNow}&id_role=4`
        );
        setDataSiswa(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const dateNow = new Date().toISOString().split("T")[0];

        const d = new Date();
        d.setDate(d.getDate() - 1); // mundur 1 hari
        const dateNow = d.toISOString().split("T")[0];
        const response = await api.get(
          `/api/attendance/stats?start_date=${dateNow}&end_date=${dateNow}&id_role=3`
        );
        setDataGuru(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData();
  }, []);
  const createConfigForEachClass = (dataArray) => {
    return dataArray.map((dataSiswa) => ({
      title: `Statistik Siswa ${dataSiswa.class} Hari ini`,
      subtitle: `Menampilkan Statistik Siswa ${dataSiswa.class} Hari Ini.`,
      icon: Users,
      classInfo: {
        id: dataSiswa.id,
        className: dataSiswa.class,
        academicYear: dataSiswa.academic_years.year,
      },
      cards: [
        {
          type: "present",
          count: dataSiswa.statistics.hadir,
          label: "HADIR",
          text: `Daftar Siswa ${dataSiswa.class} Hadir Hari Ini`,
          typeCategory: "siswa",
        },
        {
          type: "permission",
          count: dataSiswa.statistics.izin,
          label: "IZIN",
          text: `Daftar Siswa ${dataSiswa.class} Izin Hari Ini`,
          typeCategory: "siswa",
        },
        {
          type: "absent",
          count: dataSiswa.statistics.sakit,
          label: "SAKIT",
          text: `Daftar Siswa ${dataSiswa.class} Sakit Hari Ini`,
          typeCategory: "siswa",
        },
        {
          type: "alpha",
          count: dataSiswa.statistics.alpha,
          label: "ALPHA",
          text: `Daftar Siswa ${dataSiswa.class} Alpha Hari Ini`,
          typeCategory: "siswa",
        },
        {
          type: "late",
          count: dataSiswa.statistics.terlambat,
          label: "TERLAMBAT",
          text: `Daftar Siswa ${dataSiswa.class} Terlambat Hari Ini`,
          typeCategory: "siswa",
        },
      ],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      // const dateNow = new Date().toISOString().split("T")[0];

      const d = new Date();
      d.setDate(d.getDate() - 1); // mundur 1 hari
      const dateNow = d.toISOString().split("T")[0];
      let data;
      try {
        const response = await api.get(
          `/api/attendance/class?include_relations=true&start_date=${dateNow}&end_date=${dateNow}`
        );
        data = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
      const allClassConfigs = createConfigForEachClass(data);
      const views = [
        {
          title: "Statistik Siswa Hari ini",
          subtitle: "Menampilkan Statistik Siswa Hari Ini.",
          icon: Users,
          cards: [
            {
              type: "present",
              count: dataSiswa.statistics.hadir,
              label: "HADIR",
              text: "Daftar Siswa Hadir Hari Ini",
              typeCategory: "siswa",
            },
            {
              type: "permission",
              count: dataSiswa.statistics.izin,
              label: "IZIN",
              text: "Daftar Siswa Izin Hari Ini",
              typeCategory: "siswa",
            },
            {
              type: "absent",
              count: dataSiswa.statistics.sakit,
              label: "SAKIT",
              text: "Daftar Siswa Sakit Hari Ini",
              typeCategory: "siswa",
            },
            {
              type: "alpha",
              count: dataSiswa.statistics.alpha,
              label: "ALPHA",
              text: "Daftar Siswa Alpha Hari Ini",
              typeCategory: "siswa",
            },
            {
              type: "late",
              count: dataSiswa.statistics.terlambat,
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
              count: dataGuru.statistics.hadir,
              label: "HADIR",
              text: "Daftar Guru Hadir Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "permission",
              count: dataGuru.statistics.izin,
              label: "IZIN",
              text: "Daftar Guru Izin Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "absent",
              count: dataGuru.statistics.sakit,
              label: "SAKIT",
              text: "Daftar Guru Sakit Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "alpha",
              count: dataGuru.statistics.alpha,
              label: "ALPHA",
              text: "Daftar Guru Alpha Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "late",
              count: dataGuru.statistics.terlambat,
              label: "TERLAMBAT",
              text: "Daftar Guru Terlambat Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "cuti",
              count: dataGuru.statistics.cuti,
              label: "CUTI",
              text: "Daftar Guru Cuti Hari Ini",
              typeCategory: "guru",
            },
            {
              type: "dinas",
              count: dataGuru.statistics.dinas,
              label: "DINAS",
              text: "Daftar Guru Dinas Hari Ini",
              typeCategory: "guru",
            },
          ],
        },
        ...allClassConfigs,
      ];
      setViews(views);
    };
    fetchData();
  }, [dataSiswa.statistics.hadir]);

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

  const handleCardClick = (text, typeCategory, type, info) => {
    setModalTitle("Detail Statistik");
    setModalText(text);
    setType(type);
    setTypeGet(typeCategory);
    setInfo(info);
    setCategory(
      typeCategory === "siswa"
        ? ["Hadir", "Izin", "Sakit", "Alpha", "Terlambat"]
        : ["Hadir", "Izin", "Sakit", "Alpha", "Terlambat", "Cuti", "Dinas"]
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

  // Touch and mouse swipe handlers
  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleEnd = (clientX, clientY) => {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Check if it's a horizontal swipe (not vertical scroll)
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > swipeThreshold
    ) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        handlePrev();
      } else {
        // Swipe left - go to next
        handleNext();
      }
    }

    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseUp = (e) => {
    handleEnd(e.clientX, e.clientY);
  };

  const currentViewData = views[currentView];

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="p-8 space-y-8">
        {/* Header - School Information Banner */}
        <div className="mb-8">
          <NotificationBanner />
        </div>

        {/* Main Statistics Display - Optimized for Portrait */}
        <div
          className="signage-card bg-card p-8 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <currentViewData.icon className="h-16 w-16 text-primary" />
              <div>
                <h1 className="signage-text-large text-card-foreground mb-2">
                  {currentViewData.title}
                </h1>
                <p className="signage-text-base text-muted-foreground">
                  {currentViewData.subtitle}
                </p>
              </div>
            </div>

            {/* Controls for Digital Signage */}
            <div className="flex items-center gap-6">
              <div className="signage-text-base text-muted-foreground">
                17 Sep 2025
              </div>

              {/* Auto slide indicator */}
              <button
                onClick={toggleAutoSlide}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isAutoSlide
                    ? "bg-success text-success-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isAutoSlide ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
                <span className="signage-text-base">
                  {isAutoSlide ? "Auto ON" : "Auto OFF"}
                </span>
              </button>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-secondary hover:bg-muted transition-colors"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-secondary hover:bg-muted transition-colors"
                  disabled={isTransitioning}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* View Indicators */}
          <div className="flex justify-center mb-8 gap-4">
            {views.map((_, index) => (
              <button
                key={index}
                onClick={() => handleViewChange(index)}
                className={`h-4 w-4 rounded-full transition-all duration-300 ${
                  index === currentView
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* Statistics Cards - Portrait Grid Layout */}
          <div className="grid grid-cols-2 gap-8">
            {currentViewData.cards.map((card, cardIndex) => (
              <StatisticsCard
                key={`${currentView}-${cardIndex}`}
                type={card.type}
                count={card.count}
                label={card.label}
                text={card.text}
                onClick={() =>
                  handleCardClick(
                    card.text,
                    card.typeCategory,
                    card.label,
                    currentViewData
                  )
                }
              />
            ))}
          </div>

          {/* Status indicator for auto-slide */}
          {isAutoSlide && (
            <div className="mt-8 text-center">
              <p className="signage-text-base text-muted-foreground">
                Berganti otomatis setiap {autoSlideInterval / 1000} detik
              </p>
            </div>
          )}
        </div>

        {/* Additional Information Sections - Portrait Stack */}
        <div className="space-y-8">
          {/* Visitor Section */}
          <VisitorSection
            hotReloadGuest={hotReloadGuest}
            setHotReloadGuest={setHotReloadGuest}
          />

          {/* School Info & Guest Registration */}
          <div className="grid grid-cols-1 gap-8">
            <SchoolInfo />

            {/* Guest Form Section */}
            <div className="signage-card bg-card rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <p className="signage-text-base text-muted-foreground">
                  Silakan isi data diri untuk keperluan kunjungan
                </p>
              </div>
              <GuestForm setHotReloadGuest={setHotReloadGuest} />
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
        <DaftarSurvei
          text={modalText}
          category={category}
          type={type}
          typeGet={typeGet}
          info={info}
        />
      </Modal>
    </div>
  );
};

export default DigitalSignageOptimized;
