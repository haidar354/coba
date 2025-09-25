import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounce search query
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ubah per_page menjadi limit untuk konsistensi dengan backend (seperti kode Guru)
        const queryParams = new URLSearchParams({
          include_role: "true",
          page: currentPage.toString(),
          limit: itemsPerPage.toString(), // Diubah dari per_page ke limit
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        });
        
        console.log("API Request Params:", queryParams.toString()); // Debug log
        console.log("Items per page sent:", itemsPerPage); // Debug log
        
        const [usersResponse, rolesResponse, classesResponse] = await Promise.all([
          api.get(`/api/users?${queryParams.toString()}`),
          api.get("/api/role"),
          api.get("/api/classes")
        ]);

        console.log("Users received:", usersResponse.data.length); // Debug log
        console.log("Pagination data:", usersResponse.headers["x-pagination"]); // Debug log

        const paginationData = usersResponse.headers["x-pagination"]
          ? JSON.parse(usersResponse.headers["x-pagination"])
          : null;

        console.log("Actual items_per_page from API:", paginationData?.items_per_page); // Debug log

        setUsers(usersResponse.data.sort((a: User, b: User) => a.id - b.id));
        setRoles(rolesResponse.data.sort((a: Role, b: Role) => a.id - b.id));
        setClasses(classesResponse.data.sort((a: Class, b: Class) => a.id - b.id));
        setPagination(paginationData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearchQuery]); // Dependensi itemsPerPage untuk re-fetch saat berubah

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
          // Re-fetch data setelah delete untuk update pagination
          const fetchData = async () => {
            try {
              const queryParams = new URLSearchParams({
                include_role: "true",
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
              });
              const usersResponse = await api.get(`/api/users?${queryParams.toString()}`);
              const paginationData = usersResponse.headers["x-pagination"]
                ? JSON.parse(usersResponse.headers["x-pagination"])
                : null;
              setUsers(usersResponse.data.sort((a: User, b: User) => a.id - b.id));
              setPagination(paginationData);
            } catch (err) {
              console.error("Error after delete:", err);
            }
          };
          fetchData();
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    console.log("Changing items per page to:", newItemsPerPage); // Debug log
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset ke halaman 1
  };

  // Modifikasi getPageNumbers untuk hanya tampilkan 3 angka (maxVisiblePages = 3)
  const getPageNumbers = () => {
    const totalPages = pagination?.total_pages || 1;
    const pageNumbers = [];
    const maxVisiblePages = 3; // Batasi hanya 3 angka

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust jika kurang dari maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(maxVisiblePages, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const renderUserData = (userData: { [key: string]: string | number }, classes: Class[]) => {
    const classId = userData.id_class || userData.id_class === 0 ? userData.id_class : null;
    const grade = classId ? classes.find((cls) => cls.id === classId)?.grade || "Tidak ada kelas" : null;
  
    const dataItems = [];
    
    if (userData.email) dataItems.push({ label: "Email", value: userData.email });
    if (userData.phone) dataItems.push({ label: "Nomor", value: userData.phone });
    if (userData.office) dataItems.push({ label: "Office", value: userData.office });
    if (userData.department) dataItems.push({ label: "Department", value: userData.department });
    if (userData.nip) dataItems.push({ label: "NIP", value: userData.nip });
    if (grade) dataItems.push({ label: "Kelas", value: grade });
    if (userData.nis) dataItems.push({ label: "NIS", value: userData.nis });
  
    if (dataItems.length === 0) {
      return <span className="text-gray-400 text-xs">Tidak ada data</span>;
    }
  
    return (
      <table>
          {dataItems.map((item, index) => (
            <tr key={index}>
              <td className="pr-2 text-gray-500 font-medium">{item.label}</td>
              <td className="pr-2 text-gray-500 font-medium">:</td>
              <td className="font-medium">{item.value}</td>
            </tr>
          ))}
      </table>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-2" />
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tampilkan</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">entri</span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >No</TableHead>
                <TableHead >Nama</TableHead>
                <TableHead >Role</TableHead>
                <TableHead >Data</TableHead>
                <TableHead >Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    {searchQuery
                      ? "Tidak ada pengguna yang sesuai dengan pencarian"
                      : "Belum ada data pengguna"}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  const roleName = roles.find((role) => role.id === user.id_role)?.name || "Unknown";
                  const userData = typeof user.data === "object" && user.data !== null ? user.data : {};

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.full_name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {roleName}
                        </span>
                      </TableCell>
                      <TableCell>
                        {renderUserData(userData, classes)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              {pagination?.total_items > 0 ? (
                <>
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
                  {Math.min(currentPage * itemsPerPage, pagination.total_items)} dari{" "}
                  {pagination.total_items} entri
                </>
              ) : (
                "Tidak ada entri"
              )}
            </div>
            {pagination?.total_pages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination?.total_pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination?.total_pages || 1)}
                  disabled={currentPage === pagination?.total_pages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}