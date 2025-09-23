// import React, { useRef, useState, useEffect } from "react";
// import { NotificationBanner } from "@/components/NotificationBanner";
// import { StatisticsCard } from "@/components/StatisticsCard";
// import { VisitorSection } from "@/components/VisitorSection";
// import { SchoolInfo } from "@/components/SchoolInfo";
// import { GuestForm } from "@/components/GuestForm";
// import Modal from "@/components/Modal";
// import DaftarSurvei from "@/components/TableView";
// import {
//   CheckCircle,
//   FileText,
//   Clock,
//   XCircle,
//   X,
//   Search,
//   Download,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Users,
//   User,
//   Play,
//   Pause,
// } from "lucide-react";

// const Index = () => {
//   const [currentView, setCurrentView] = useState(0); // 0 = Siswa, 1 = Guru
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalText, setModalText] = useState("");
//   const [category, setCategory] = useState([]);
//   const [isAutoSlide, setIsAutoSlide] = useState(true); // Auto slide state
//   const [autoSlideInterval, setAutoSlideInterval] = useState(5000); // 5 seconds default

//   const containerRef = useRef(null);
//   const startXRef = useRef(null);
//   const isDraggingRef = useRef(false);
//   const autoSlideIntervalRef = useRef(null);

//   const views = [
//     {
//       title: "Statistik Siswa Hari ini",
//       subtitle: "Menampilkan Statistik Siswa Hari Ini.",
//       icon: Users,

//       cards: [
//         {
//           type: "present",
//           count: 0,
//           label: "HADIR",
//           text: "Daftar Siswa Hadir Hari Ini",
//           typeCategory: "siswa",
//         },
//         {
//           type: "permission",
//           count: 0,
//           label: "IZIN",
//           text: "Daftar Siswa Izin Hari Ini",
//           typeCategory: "siswa",
//         },
//         {
//           type: "absent",
//           count: 0,
//           label: "SAKIT",
//           text: "Daftar Siswa Sakit Hari Ini",
//           typeCategory: "siswa",
//         },
//         {
//           type: "permission",
//           count: 0,
//           label: "ALPHA",
//           text: "Daftar Siswa Alpha Hari Ini",
//           typeCategory: "siswa",
//         },
//         {
//           type: "late",
//           count: 0,
//           label: "TERLAMBAT",
//           text: "Daftar Siswa Terlambat Hari Ini",
//           typeCategory: "siswa",
//         },
//       ],
//     },
//     {
//       title: "Statistik Guru Hari ini",
//       subtitle: "Menampilkan Statistik Guru Hari Ini.",
//       icon: User,
//       type: "guru",
//       cards: [
//         {
//           type: "present",
//           count: 0,
//           label: "HADIR",
//           text: "Daftar Guru Hadir Hari Ini",
//           typeCategory: "guru",
//         },
//         {
//           type: "permission",
//           count: 0,
//           label: "IZIN",
//           typeCategory: "guru",
//           text: "Daftar Guru Izin Hari Ini",
//         },
//         {
//           type: "absent",
//           count: 0,
//           label: "SAKIT",
//           text: "Daftar Guru Sakit Hari Ini",
//           typeCategory: "guru",
//         },
//         {
//           type: "permission",
//           count: 0,
//           label: "ALPHA",
//           typeCategory: "guru",
//           text: "Daftar Guru Alpha Hari Ini",
//         },
//         {
//           type: "late",
//           count: 0,
//           label: "TERLAMBAT",
//           typeCategory: "guru",
//           text: "Daftar Guru Terlambat Hari Ini",
//         },
//         {
//           type: "cuti",
//           count: 0,
//           label: "CUTI",
//           typeCategory: "guru",
//           text: "Daftar Guru Cuti Hari Ini",
//         },
//         {
//           type: "dinas",
//           count: 0,
//           label: "DINAS",
//           typeCategory: "guru",
//           text: "Daftar Guru Sedang Dinas Hari Ini",
//         },
//       ],
//     },
//   ];

//   const categoryViewSiswa = ["Hadir", "Izin", "Sakit", "Alpha", "Terlambat"];
//   const categoryViewGuru = [
//     "Hadir",
//     "Izin",
//     "Sakit",
//     "Alpha",
//     "Terlambat",
//     "Cuti",
//     "Dinas",
//   ];

//   // Auto slide effect
//   useEffect(() => {
//     if (isAutoSlide && !isModalOpen) {
//       autoSlideIntervalRef.current = setInterval(() => {
//         setCurrentView((prev) => (prev + 1) % views.length);
//       }, autoSlideInterval);
//     } else {
//       if (autoSlideIntervalRef.current) {
//         clearInterval(autoSlideIntervalRef.current);
//       }
//     }

//     return () => {
//       if (autoSlideIntervalRef.current) {
//         clearInterval(autoSlideIntervalRef.current);
//       }
//     };
//   }, [isAutoSlide, autoSlideInterval, isModalOpen, views.length]);

//   // Clear auto slide when transitioning manually
//   const clearAutoSlide = () => {
//     if (autoSlideIntervalRef.current) {
//       clearInterval(autoSlideIntervalRef.current);
//     }
//   };

//   const switchView = (newView) => {
//     if (newView === currentView || isTransitioning) return;

//     clearAutoSlide();
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrentView(newView);
//       setIsTransitioning(false);
//     }, 150);
//   };

//   const handleNext = () => {
//     clearAutoSlide();
//     switchView((currentView + 1) % views.length);
//   };

//   const handlePrev = () => {
//     clearAutoSlide();
//     switchView((currentView - 1 + views.length) % views.length);
//   };

//   const toggleAutoSlide = () => {
//     setIsAutoSlide(!isAutoSlide);
//   };

//   // Touch/Mouse event handlers
//   const handleStart = (e) => {
//     const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
//     startXRef.current = clientX;
//     isDraggingRef.current = true;
//     clearAutoSlide(); // Stop auto slide when user starts interacting
//   };

//   const handleMove = (e) => {
//     if (!isDraggingRef.current || !startXRef.current) return;
//     e.preventDefault();
//   };

//   const handleEnd = (e) => {
//     if (!isDraggingRef.current || !startXRef.current) return;

//     const clientX =
//       e.type === "mouseup"
//         ? e.changedTouches?.[0]?.clientX || e.clientX
//         : e.changedTouches[0].clientX;
//     const deltaX = startXRef.current - clientX;
//     const threshold = 50; // minimum swipe distance

//     if (Math.abs(deltaX) > threshold) {
//       if (deltaX > 0) {
//         handleNext(); // Swipe left = next view
//       } else {
//         handlePrev(); // Swipe right = previous view
//       }
//     }

//     startXRef.current = null;
//     isDraggingRef.current = false;
//   };

//   // Modal handlers
//   const handleStatisticClick = (type, label, text, typeCategory) => {
//     setModalTitle(`Detail ${label}`);
//     setModalText(`${text}`);
//     setCategory(
//       typeCategory === "siswa" ? categoryViewSiswa : categoryViewGuru
//     );
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const currentViewData = views[currentView];
//   const HeaderIcon = currentViewData.icon;

//   return (
//     <div className="h-screen bg-background p-8 overflow-hidden">
//       <div className="h-full flex flex-col">
//         {/* Notification Banner */}
//         <div className="mb-8">
//           <NotificationBanner />
//         </div>

//         {/* Statistics Section */}
//         <div
//           className="mb-6"
//           ref={containerRef}
//           onMouseDown={handleStart}
//           onMouseMove={handleMove}
//           onMouseUp={handleEnd}
//           onTouchStart={handleStart}
//           onTouchMove={handleMove}
//           onTouchEnd={handleEnd}
//           style={{
//             touchAction: "pan-y",
//           }}
//         >
//           <div
//             className={`transition-all duration-300 ${
//               isTransitioning
//                 ? "opacity-50 transform scale-95"
//                 : "opacity-100 transform scale-100"
//             }`}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <HeaderIcon className="w-6 h-6 text-gray-600" />
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-1">
//                     {currentViewData.title}
//                   </h2>
//                   <p className="text-sm text-gray-600">
//                     {currentViewData.subtitle}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-gray-600">17 Sep 2025</div>

//                 {/* Auto slide controls */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={toggleAutoSlide}
//                     className={`p-2 rounded-full border transition-colors ${
//                       isAutoSlide
//                         ? "bg-blue-100 border-blue-300 text-blue-600"
//                         : "bg-white border-gray-300 text-gray-600"
//                     }`}
//                     title={
//                       isAutoSlide ? "Pause auto slide" : "Start auto slide"
//                     }
//                   >
//                     {isAutoSlide ? (
//                       <Pause className="w-4 h-4" />
//                     ) : (
//                       <Play className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>

//                 {/* Navigation buttons */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handlePrev}
//                     className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
//                     disabled={isTransitioning}
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
//                     disabled={isTransitioning}
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Dots indicator */}
//             <div className="flex justify-center mb-4 gap-2">
//               {views.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => switchView(index)}
//                   className={`h-2 rounded-full transition-all duration-200 ${
//                     index === currentView
//                       ? "bg-blue-600 w-6"
//                       : "bg-gray-300 w-2"
//                   }`}
//                   disabled={isTransitioning}
//                 />
//               ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {currentViewData.cards.map((card, index) => (
//                 <StatisticsCard
//                   key={`${currentView}-${index}`}
//                   type={card.type}
//                   count={card.count}
//                   label={card.label}
//                   text={card.text}
//                   onClick={() =>
//                     handleStatisticClick(
//                       card.type,
//                       card.label,
//                       card.text,
//                       card.typeCategory
//                     )
//                   }
//                 />
//               ))}
//             </div>

//             {/* Swipe instruction */}
//             <div className="mt-4 text-center">
//               <p className="text-xs text-gray-600">
//                 Geser ke kiri/kanan atau gunakan tombol untuk beralih tampilan •
//                 Klik kartu untuk detail • Auto slide:{" "}
//                 {isAutoSlide ? "ON" : "OFF"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Row */}
//         <div className="flex-1 grid grid-cols-2 gap-8">
//           {/* Left Column */}
//           <div className="flex flex-col gap-8">
//             <VisitorSection />
//             <SchoolInfo />
//           </div>

//           {/* Right Column */}
//           <div>
//             <GuestForm />
//           </div>
//         </div>
//         <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
//           <DaftarSurvei text={modalText} category={category} />
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Index;
