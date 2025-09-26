import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/utils/axios";

interface Role {
  id: number;
  name: string;
}

interface UserData {
  email?: string;
  phone?: string;
  office?: string;
  password?: string;
  department?: string;
  nip?: string;
  nis?: string;
  nim?: string;
  id_class?: number;
}

interface User {
  id: number;
  full_name: string;
  id_role: number;
  data: UserData;
  created_at: string;
  updated_at: string;
}

export default function EditUsers() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, userResponse] = await Promise.all([
          api.get("/api/role"),
          api.get(`/api/users/${id}`),
        ]);
        setRoles(rolesResponse.data.sort((a: Role, b: Role) => a.id - b.id));
        const fetchedUser = userResponse.data;
        setUser(fetchedUser);
        setName(fetchedUser.full_name);
        setRoleId(fetchedUser.id_role);
        // Initialize userData without password to avoid handling hashed value
        setUserData({ ...fetchedUser.data, password: undefined });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load user data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate("/manajemen-user");
  };

  const handleSave = async () => {
    try {
      // Create a copy of userData without empty or whitespace-only password
      const updatedUserData = { ...userData };
      if (updatedUserData.password?.trim() === "") {
        delete updatedUserData.password;
      }

      await api.put(`/api/users/${id}`, {
        full_name: name,
        id_role: roleId,
        data: updatedUserData,
      });
      toast.success("User updated successfully");
      navigate("/manajemen-user");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  const handleRoleChange = (value: string) => {
    const selectedRoleId = parseInt(value);
    setRoleId(selectedRoleId);
    setUserData({}); // Reset user data when role changes

    // Initialize user data based on selected role, excluding password
    switch (selectedRoleId) {
      case 1: // Admin
        setUserData({ email: user?.data.email || "", phone: user?.data.phone || "", office: user?.data.office || "", department: user?.data.department || "" });
        break;
      case 2: // Kepala Sekolah
        setUserData({ email: user?.data.email || "" });
        break;
      case 3: // Guru
        setUserData({ nip: user?.data.nip || "", id_class: user?.data.id_class || 0 });
        break;
      case 4: // Siswa
        setUserData({ nis: user?.data.nis || "", id_class: user?.data.id_class || 0 });
        break;
      case 5: // Operator
        setUserData({ email: user?.data.email || "" });
        break;
      case 6: // Mahasiswa
        setUserData({ nim: user?.data.nim || "", id_class: user?.data.id_class || 0 });
        break;
      default:
        setUserData({});
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          BACK
        </Button>
        <div className="text-sm text-muted-foreground">
          🏠 / Manajemen Users / Edit
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Edit Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange} value={roleId?.toString() || ""}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Data</CardTitle>
            </CardHeader>
            <CardContent>
              {roleId && (
                <div className="space-y-4">
                  {roleId === 1 && ( // Admin
                    <>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={userData.email || ""}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={userData.phone || ""}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="office">Office</Label>
                        <Input
                          id="office"
                          value={userData.office || ""}
                          onChange={(e) => setUserData({ ...userData, office: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userData.password || ""}
                          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={userData.department || ""}
                          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {roleId === 2 && ( // Kepala Sekolah
                    <>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={userData.email || ""}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userData.password || ""}
                          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {roleId === 3 && ( // Guru
                    <>
                      <div>
                        <Label htmlFor="nip">NIP</Label>
                        <Input
                          id="nip"
                          value={userData.nip || ""}
                          onChange={(e) => setUserData({ ...userData, nip: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="id_class">ID Kelas</Label>
                        <Input
                          id="id_class"
                          type="number"
                          value={userData.id_class || ""}
                          onChange={(e) => setUserData({ ...userData, id_class: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </>
                  )}
                  {roleId === 4 && ( // Siswa
                    <>
                      <div>
                        <Label htmlFor="nis">NIS</Label>
                        <Input
                          id="nis"
                          value={userData.nis || ""}
                          onChange={(e) => setUserData({ ...userData, nis: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="id_class">ID Kelas</Label>
                        <Input
                          id="id_class"
                          type="number"
                          value={userData.id_class || ""}
                          onChange={(e) => setUserData({ ...userData, id_class: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </>
                  )}
                  {roleId === 5 && ( // Operator
                    <>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={userData.email || ""}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userData.password || ""}
                          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {roleId === 6 && ( // Mahasiswa
                    <>
                      <div>
                        <Label htmlFor="nim">NIM</Label>
                        <Input
                          id="nim"
                          value={userData.nim || ""}
                          onChange={(e) => setUserData({ ...userData, nim: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="id_class">ID Kelas</Label>
                        <Input
                          id="id_class"
                          type="number"
                          value={userData.id_class || ""}
                          onChange={(e) => setUserData({ ...userData, id_class: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="outline" onClick={handleBack}>
                  Kembali
                </Button>
                <Button onClick={handleSave}>Simpan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}