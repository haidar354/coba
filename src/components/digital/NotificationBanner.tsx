import { InfoIcon } from "lucide-react";
import { useEffect , useState } from "react";
import api from "@/utils/axios";
export const NotificationBanner = () => {
  const [data, setData] = useState({})

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
            `/api/academic/agendas?limit=1&sort=-createdAt&start_date=${dateNow}&end_date=${dateNow}`,
            config
          );
          setData(response.data[0])
          // setDay(date.toLocaleDateString("id-ID", options));
          // setVisitorData(response.data);
          return response.data;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      };
      fetchData();
      
    }, []);
  return (
    <div className="bg-primary text-primary-foreground px-12 py-8 rounded-2xl shadow-xl signage-card">
      <div className="flex items-start gap-8">
        <InfoIcon className="w-12 h-12 mt-1 flex-shrink-0" />
        <div>
          <h3 className="signage-text-large mb-4">
            Informasi Aktivitas Kepala Sekolah
          </h3>
          <p className="signage-text-base opacity-95 leading-relaxed">
            {data?.event_name || "Tidak ada agenda"}
          </p>
        </div>
      </div>
    </div>
  );
};
