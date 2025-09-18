import { Plus, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Agenda() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Tambah Agenda
            </Button>

            <div className="text-center text-muted-foreground">
              <h3 className="font-medium mb-2">September 2025</h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                <div className="p-1">Sen</div>
                <div className="p-1">Sel</div>
                <div className="p-1">Rab</div>
                <div className="p-1">Kam</div>
                <div className="p-1">Jum</div>
                <div className="p-1">Sab</div>
                <div className="p-1">Min</div>
                
                {/* Calendar days */}
                {Array.from({ length: 42 }, (_, i) => {
                  const day = i - 6; // Adjusting for September starting
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 17;
                  
                  return (
                    <div
                      key={i}
                      className={`p-1 text-center ${
                        isCurrentMonth 
                          ? isToday 
                            ? 'bg-primary text-primary-foreground rounded' 
                            : 'hover:bg-muted rounded'
                          : 'text-muted-foreground/50'
                      }`}
                    >
                      {isCurrentMonth ? day : day <= 0 ? '' : day - 30}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Filter Agenda</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="semua" defaultChecked />
                  <label htmlFor="semua" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Semua
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dinas" />
                  <label htmlFor="dinas" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Dinas Keluar
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sekolah" />
                  <label htmlFor="sekolah" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Di Sekolah
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Calendar */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalender Agenda
            </Button>
            <Button variant="outline" className="gap-2">
              Data Agenda
            </Button>
          </div>
          <Select defaultValue="2025">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>September 2025</CardTitle>
              <div className="flex gap-2 text-sm">
                <Badge variant="outline">Bulan</Badge>
                <Badge variant="outline">Minggu</Badge>
                <Badge variant="outline">Hari</Badge>
                <Badge variant="outline" className="bg-primary text-primary-foreground">Agenda</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              <div className="p-2 text-center font-medium text-sm">Sen</div>
              <div className="p-2 text-center font-medium text-sm">Sel</div>
              <div className="p-2 text-center font-medium text-sm">Rab</div>
              <div className="p-2 text-center font-medium text-sm">Kam</div>
              <div className="p-2 text-center font-medium text-sm">Jum</div>
              <div className="p-2 text-center font-medium text-sm">Sab</div>
              <div className="p-2 text-center font-medium text-sm">Min</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 42 }, (_, i) => {
                const day = i - 6; // Adjusting for September starting
                const isCurrentMonth = day > 0 && day <= 30;
                const hasEvent = day === 17;
                
                return (
                  <div
                    key={i}
                    className={`min-h-20 p-1 border border-border ${
                      isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                    }`}
                  >
                    <div className="text-sm">
                      {isCurrentMonth ? day : day <= 0 ? '' : day - 30}
                    </div>
                    {hasEvent && (
                      <div className="mt-1">
                        <div className="bg-red-500 text-white text-xs p-1 rounded">
                          12 Rapat Kepala Sekolah Se DIY
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";