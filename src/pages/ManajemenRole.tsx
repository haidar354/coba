import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
import api from "@/utils/axios";
import { getAllData } from "@/lib/dynamicApi";

interface Role {
  id: number;
  name: string;
  can_login: number;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export default function ManajemenRole() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getAllRole = async () => {
      try {
        const response = await getAllData("role", {
          page: currentPage,
          per_page: itemsPerPage,
        });
        const paginationData = JSON.parse(response.headers["x-pagination"]);
        const sortedRoles = response.data.sort(
          (a: Role, b: Role) => a.id - b.id
        );
        setRoles(sortedRoles);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setLoading(false);
      }
    };
    getAllRole();
  }, [currentPage, itemsPerPage]);

  const handleAddRole = () => {
    navigate("/manajemen-role/tambah");
  };

  const handleEditRole = (id: number) => {
    navigate(`/manajemen-role/edit/${id}`);
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm("Yakin ingin menghapus role ini?")) {
      try {
        await api.delete(`/api/role/${id}`);
        setRoles(roles.filter((role) => role.id !== id));
      } catch (err) {
        console.error("Error deleting role:", err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (loading) return <div>Loading...</div>;

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
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tampilkan:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entri</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 w-64" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Role</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-full px-3 py-1 pointer-events-none ${
                        role.can_login === true
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {role.can_login === true ? "Bisa" : "Tidak"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditRole(role.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteRole(role.id)}
                      >
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
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
              {Math.min(
                currentPage * itemsPerPage,
                pagination?.total_items || roles.length
              )}{" "}
              dari {pagination?.total_items || roles.length} entri
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={!pagination?.has_prev_page}
              >
                &lt;&lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination?.has_prev_page}
              >
                &lt;
              </Button>
              {pagination && (
                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination?.has_next_page}
              >
                &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination?.total_pages || 1)}
                disabled={!pagination?.has_next_page}
              >
                &gt;&gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
