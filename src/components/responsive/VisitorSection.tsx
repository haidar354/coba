import { useState } from "react";
import { useEffect } from "react";
import { Users, Clock, MapPin } from "lucide-react";
import api from "@/utils/axios";

export const VisitorSection = ({ hotReloadGuest, setHotReloadGuest }) => {
  const [visitorData, setVisitorData] = useState([]);
  const [day, setDay] = useState("");

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

        setDay(date.toLocaleDateString("id-ID", options));
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
      return 
    } else{
      setVisitorData((prev) => [hotReloadGuest, ...prev]);

    }
  }, [hotReloadGuest]);


  const totalVisitors = visitorData.length;

  if (totalVisitors === 0) {
    return (
      <div className="signage-card bg-card rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="signage-text-medium text-card-foreground mb-2">
              Tamu Berkunjung Hari Ini
            </h2>
            <p className="signage-text-base text-muted-foreground">
              Menampilkan daftar tamu berkunjung terakhir
            </p>
          </div>
          <div className="signage-text-base text-muted-foreground font-semibold">
            {day}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="signage-text-base font-bold text-primary-foreground">
                0
              </span>
            </div>
          </div>
          <h3 className="signage-text-medium text-card-foreground mb-4">
            0 Tamu Hari ini
          </h3>
          <p className="signage-text-base text-muted-foreground text-center leading-relaxed">
            Hari ini, belum ada tamu berkunjung.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signage-card bg-card rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="signage-text-medium text-card-foreground mb-2">
            Tamu Berkunjung Hari Ini
          </h2>
          <p className="signage-text-base text-muted-foreground">
            Menampilkan daftar tamu berkunjung terakhir
          </p>
        </div>
        <div className="signage-text-base text-muted-foreground font-semibold">
          {day}
        </div>
      </div>

      {/* Summary Header */}
      <div className="flex items-center justify-between mb-8 p-6 bg-primary/5 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                {totalVisitors}
              </span>
            </div>
          </div>
          <div>
            <h3 className="signage-text-large text-card-foreground font-bold">
              {totalVisitors} Tamu Hari ini
            </h3>
          </div>
        </div>
      </div>

      {/* Visitor List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {visitorData.map((visitor) => (
          <div
            key={visitor.id}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="signage-text-medium font-semibold text-card-foreground">
                  {visitor.full_name}
                </h4>
              </div>
              <p className="signage-text-base text-muted-foreground mb-1">
                {visitor.purpose}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{visitor.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(visitor.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Display */}
            <div className="flex flex-col items-center gap-2 ml-4">
              <div className="w-24 h-16 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <img
                  src={`https://website-sekolahku-be.up.railway.app/${visitor.signature}`}
                  alt="Tanda Tangan"
                  className="object-contain max-w-full max-h-full"
                  crossOrigin="anonymous"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Tanda Tangan
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};