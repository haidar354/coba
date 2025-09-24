import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";

interface Role {
  id: number;
  name: string;
}

interface UserData {
  email: string;
  password: string;
  phone?: string;
  office?: string;
  department?: string;
  nip?: string;
  nis?: string;
  nim?: string;
  id_class?: number;
}

export default function TambahUsers() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState<string>("");
  const [duplicateError, setDuplicateError] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/api/role");
        setRoles(response.data.sort((a: Role, b: Role) => a.id - b.id));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setPasswordError("Password harus mengandung huruf kapital, huruf kecil, dan angka");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const checkDuplicate = async (field: string, value: string): Promise<boolean> => {
    if (!value) return false;
    try {
      const response = await api.get(`/api/users/check-duplicate?${field}=${value}`);
      if (response.data.exists) {
        setDuplicateError(`${field.toUpperCase()} sudah digunakan`);
        return true;
      }
      setDuplicateError("");
      return false;
    } catch (err) {
      console.error(`Error checking duplicate ${field}:`, err);
      return false;
    }
  };

  const handleBack = () => {
    navigate("/manajemen-user");
  };

  const handleSave = async () => {
    if (!validatePassword(userData.password)) {
      return;
    }

    let hasDuplicate = false;
    if (roleId === 3 && userData.nip) {
      hasDuplicate = await checkDuplicate("nip", userData.nip);
    } else if (roleId === 4 && userData.nis) {
      hasDuplicate = await checkDuplicate("nis", userData.nis);
    } else if (roleId === 6 && userData.nim) {
      hasDuplicate = await checkDuplicate("nim", userData.nim);
    }

    if (hasDuplicate) {
      return;
    }

    try {
      await api.post("/api/users", {
        full_name: name,
        id_role: roleId,
        data: userData,
      });
      navigate("/manajemen-user");
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleRoleChange = (value: string) => {
    const selectedRoleId = parseInt(value);
    setRoleId(selectedRoleId);
    setUserData({ email: "", password: "" });
    setDuplicateError("");

    switch (selectedRoleId) {
      case 1: // Admin
        setUserData({ email: "", password: "", phone: "", office: "", department: "" });
        break;
      case 2: // Kepala Sekolah
        setUserData({ email: "", password: "" });
        break;
      case 3: // Guru
        setUserData({ email: "", password: "", nip: "", id_class: 0 });
        break;
      case 4: // Siswa
        setUserData({ email: "", password: "", nis: "", id_class: 0 });
        break;
      case 5: // Operator
        setUserData({ email: "", password: "" });
        break;
      case 6: // Mahasiswa
        setUserData({ email: "", password: "", nim: "", id_class: 0 });
        break;
      default:
        setUserData({ email: "", password: "" });
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
          🏠 / Manajemen Users / Tambah
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Pengguna</CardTitle>
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
                      onChange={(e) => {
                        setUserData({ ...userData, password: e.target.value });
                        validatePassword(e.target.value);
                      }}
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                  </div>
                  {roleId === 1 && ( // Admin
                    <>
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
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={userData.department || ""}
                          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
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
                          onChange={async (e) => {
                            const nip = e.target.value;
                            setUserData({ ...userData, nip });
                            await checkDuplicate("nip", nip);
                          }}
                        />
                        {duplicateError && roleId === 3 && (
                          <p className="text-red-500 text-sm mt-1">{duplicateError}</p>
                        )}
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
                          onChange={async (e) => {
                            const nis = e.target.value;
                            setUserData({ ...userData, nis });
                            await checkDuplicate("nis", nis);
                          }}
                        />
                        {duplicateError && roleId === 4 && (
                          <p className="text-red-500 text-sm mt-1">{duplicateError}</p>
                        )}
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
                  {roleId === 6 && ( // Mahasiswa
                    <>
                      <div>
                        <Label htmlFor="nim">NIM</Label>
                        <Input
                          id="nim"
                          value={userData.nim || ""}
                          onChange={async (e) => {
                            const nim = e.target.value;
                            setUserData({ ...userData, nim });
                            await checkDuplicate("nim", nim);
                          }}
                        />
                        {duplicateError && roleId === 6 && (
                          <p className="text-red-500 text-sm mt-1">{duplicateError}</p>
                        )}
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
                <Button onClick={handleSave} disabled={!!passwordError || !!duplicateError}>
                  Tambah
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}