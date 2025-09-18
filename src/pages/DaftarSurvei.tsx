import { Plus, Download, Filter, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const surveyData = [
  {
    no: 1,
    indikatorSurvei: "Kerapian",
    keterangan: "Sudah Rapi?",
    skor: "⭐ -",
    dibuatPada: "17-09-2025 10:11"
  },
  {
    no: 2,
    indikatorSurvei: "Kedisiplinan",
    keterangan: "Apakah ini disiplin",
    skor: "⭐ -",
    dibuatPada: "17-09-2025 10:10"
  }
];

export default function DaftarSurvei() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Indikator Survei</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>INDIKATOR SURVEI</TableHead>
                <TableHead>KETERANGAN</TableHead>
                <TableHead>SKOR</TableHead>
                <TableHead>DIBUAT PADA</TableHead>
                <TableHead>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.indikatorSurvei}</TableCell>
                  <TableCell>{item.keterangan}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-orange">
                      {item.skor}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.dibuatPada}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1 to 2 of 2 entries
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                ‹‹
              </Button>
              <Button variant="outline" size="sm" disabled>
                ‹
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                ›
              </Button>
              <Button variant="outline" size="sm" disabled>
                ››
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}