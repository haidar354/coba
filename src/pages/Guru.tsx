import { Search, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const schoolData = [
  {
    no: 1,
    sekolah: "SEKOLAH KARSA",
    email: "smakarsa@gmail.com",
    npsn: "45678",
    jumlahSiswa: "24",
    kotaKab: ""
  }
];

export default function Sekolah() {
  return (
    <div className="space-y-6">
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
                <TableHead>NAMA</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schoolData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-medium">🏫</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.nip}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1 to 1 of 1 entries
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