import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import api from "@/utils/axios";

interface User {
  id: number;
  full_name: string;
  id_role: number;
  data: string | { [key: string]: string | number };
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
}

interface Class {
  id: number;
  grade: string;
  id_department: number;
  subgrade: number;
  id_academic_year: number;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export default function ManajemenUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset ke halaman 1 saat pencarian berubah
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          include_role: "true",
          page: currentPage.toString(),
          per_page: itemsPerPage.toString(),
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        });
        console.log("API Request URL:", `/api/users?${queryParams.toString()}`);
        console.log("Items per page sent:", itemsPerPage);
        const [usersResponse, rolesResponse, classesResponse] = await Promise.all([
          api.get(`/api/users?${queryParams.toString()}`),
          api.get("/api/role"),
          api.get("/api/classes")
        ]);
        console.log("Total users received from API:", usersResponse.data.length);
        console.log("Pagination header:", usersResponse.headers["x-pagination"]);
        const paginationData = usersResponse.headers["x-pagination"]
          ? JSON.parse(usersResponse.headers["x-pagination"])
          : null;
        console.log("Items per page in header:", paginationData?.items_per_page);
        setUsers(usersResponse.data.sort((a: User, b: User) => a.id - b.id));
        setRoles(rolesResponse.data.sort((a: Role, b: Role) => a.id - b.id));
        setClasses(classesResponse.data.sort((a: Class, b: Class) => a.id - b.id));
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearchQuery]);

  const handleAddUser = () => {
    navigate("/manajemen-user/tambah");
  };

  const handleEditUser = (id: number) => {
    navigate(`/manajemen-user/edit/${id}`);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      api.delete(`/api/users/${id}`)
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    console.log("New items per page selected:", newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset ke halaman 1 saat itemsPerPage berubah
  };

  const getPageNumbers = () => {
    const totalPages = pagination?.total_pages || 1;
    const pageNumbers = [];

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (endPage - startPage < 2) {
      if (startPage === 1) {
        endPage = Math.min(3, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Pengguna</h1>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          TAMBAH USER
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
                  <SelectValue placeholder={itemsPerPage} />
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
            <div className="flex items-center gap-2">
              <Input
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                const roleName = roles.find((role) => role.id === user.id_role)?.name || "Unknown";
                const userData = typeof user.data === "object" && user.data !== null ? user.data : {};
                const classId = userData.id_class || userData.id_class === 0 ? userData.id_class : null;
                const grade = classId ? classes.find((cls) => cls.id === classId)?.grade || "Tidak ada kelas" : null;

                let displayData = "<ul style='list-style-type: disc; padding-left: 20px;'>";
                if (userData.email) displayData += `<li>Email      : ${userData.email}</li>`;
                if (userData.phone) displayData += `<li>Nomor      : ${userData.phone}</li>`;
                if (userData.office) displayData += `<li>Office     : ${userData.office}</li>`;
                if (userData.department) displayData += `<li>Department : ${userData.department}</li>`;
                if (userData.nip) displayData += `<li>NIP        : ${userData.nip}</li>`;
                if (grade) displayData += `<li>Kelas      : ${grade}</li>`;
                if (userData.nis) displayData += `<li>NIS        : ${userData.nis}</li>`;
                displayData += "</ul>";

                return (
                  <TableRow key={user.id}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{roleName}</TableCell>
                    <TableCell dangerouslySetInnerHTML={{ __html: displayData }} />
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
              {Math.min(currentPage * itemsPerPage, pagination?.total_items || users.length)} dari{" "}
              {pagination?.total_items || users.length} entri
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
              <div className="flex gap-1">
                {getPageNumbers().map((page) => (
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