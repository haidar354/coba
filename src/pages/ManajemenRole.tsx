import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useNavigate } from "react-router-dom";

const roleData = [
  { no: 1, namaRole: "Admin Sekolah", initial: "AS" },
  { no: 2, namaRole: "Admin Sistem", initial: "AS" },
  { no: 3, namaRole: "Alumni", initial: "A" },
  { no: 4, namaRole: "BK", initial: "B" },
  { no: 5, namaRole: "Dinas Pendidikan", initial: "DP" },
  { no: 6, namaRole: "Guru", initial: "G" },
  { no: 7, namaRole: "Kepala Sekolah", initial: "KS" },
  { no: 8, namaRole: "Orang Tua", initial: "OT" },
  { no: 9, namaRole: "Pengurus Perpustakaan", initial: "PP" },
  { no: 10, namaRole: "Peserta Didik", initial: "PD" }
];

export default function ManajemenRole() {
  const navigate = useNavigate();

  const handleAddRole = () => {
    navigate('/manajemen-role/tambah');
  };

  const handleEditRole = (id: number) => {
    navigate(`/manajemen-role/edit/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Role</h1>
        <Button onClick={handleAddRole} className="gap-2">
          <Plus className="h-4 w-4" />
          TAMBAH ROLE
        </Button>
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
                placeholder="Search"
                className="pl-10 w-64"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Role</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleData.map((role) => (
                <TableRow key={role.no}>
                  <TableCell>{role.no}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                        {role.initial}
                      </Badge>
                      <span>{role.namaRole}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditRole(role.no)}
                      >
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
              Showing 1 to 10 of 10 entries
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
              <Button variant="outline" size="sm">
                NEXT ›
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}