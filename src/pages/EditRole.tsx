import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/axios";

interface PermissionItem {
  name: string;
  id_resource: number;
  permissions: {
    lihat: boolean;
    tambah: boolean;
    edit: boolean;
    hapus: boolean;
  };
}

interface Role {
  id: number;
  name: string;
  can_login: boolean;
  permissions: { [key: string]: PermissionItem["permissions"] };
}

interface Resource {
  id: number;
  name: string;
  display_name: string;
}

interface RolePermission {
  id: number;
  id_role: number;
  id_resource: number;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export default function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roleName, setRoleName] = useState("");
  const [can_login, setCan_login] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchRoleAndPermissions = async () => {
      try {
        const roleResponse = await api.get(`/api/role/${id}`);
        const data: Role = roleResponse.data;

        setRoleName(data.name);
        setCan_login(data.can_login ?? true);

        const resourcesResponse = await api.get(
          "/api/role/resources?limit=no_limit"
        );
        const resourcesData = resourcesResponse.data || [];
        setResources(resourcesData);

        const permissionsResponse = await api.get(
          "/api/role/management?limit=no_limit"
        );
        const rolePermissions: RolePermission[] =
          permissionsResponse.data || [];

        const roleSpecificPermissions = rolePermissions.filter(
          (perm) => perm.id_role === parseInt(id || "0")
        );

        const initialPermissions = resourcesData.map((resource: Resource) => {
          const permission = roleSpecificPermissions.find(
            (perm) => perm.id_resource === resource.id
          ) || {
            can_create: false,
            can_read: false,
            can_update: false,
            can_delete: false,
          };

          return {
            name: resource.display_name,
            id_resource: resource.id,
            permissions: {
              lihat: permission.can_read,
              tambah: permission.can_create,
              edit: permission.can_update,
              hapus: permission.can_delete,
            },
          };
        });

        const sortedPermissions = initialPermissions.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPermissions(sortedPermissions);
      } catch (err) {
        console.error("Error fetching role or permissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndPermissions();
  }, [id]);

  const handleBack = () => {
    navigate("/manajemen-role");
  };

  const handleSave = async () => {
    try {
      const permissionsToSave = permissions.map((item) => ({
        id_role: parseInt(id || "0"),
        id_resource: item.id_resource,
        can_create: item.permissions.tambah,
        can_read: item.permissions.lihat,
        can_update: item.permissions.edit,
        can_delete: item.permissions.hapus,
      }));

      const responseBulkUpdate = await api.put(`/api/role/management/bulk`, {
        permissions: permissionsToSave,
      });

      if (responseBulkUpdate.status === 200) {
        console.log("Permissions berhasil disimpan:", responseBulkUpdate.data);
      } else {
        console.error(
          "Gagal menyimpan permissions:",
          responseBulkUpdate.status
        );
      }

      await api.put(`/api/role/${id}`, {
        name: roleName,
        can_login,
      });

      navigate("/manajemen-role");
    } catch (err) {
      console.error("Error saving role or permissions:", err);
    }
  };

  const togglePermission = (
    index: number,
    key: keyof PermissionItem["permissions"]
  ) => {
    const newPermissions = [...permissions];
    newPermissions[index].permissions[key] =
      !newPermissions[index].permissions[key];
    setPermissions(newPermissions);
  };

  // Fungsi untuk checklist semua izin pada satu baris
  const toggleAllPermissions = (index: number, checked: boolean) => {
    const newPermissions = [...permissions];
    newPermissions[index].permissions = {
      lihat: checked,
      tambah: checked,
      edit: checked,
      hapus: checked,
    };
    setPermissions(newPermissions);
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
          🏠 / Manajemen Role / Edit
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Edit Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="namaRole">Nama Role</Label>
                <Input
                  id="namaRole"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="can_login">Status Login</Label>
                <select
                  id="can_login"
                  value={can_login ? "Bisa Login" : "Tidak Bisa Login"}
                  onChange={(e) =>
                    setCan_login(e.target.value === "Bisa Login")
                  }
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bisa Login">Bisa</option>
                  <option value="Tidak Bisa Login">Tidak Bisa</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Hak Akses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Tabel</th>
                      <th className="text-center p-3 font-medium">Pilih Semua</th>
                      <th className="text-center p-3 font-medium">Lihat</th>
                      <th className="text-center p-3 font-medium">Tambah</th>
                      <th className="text-center p-3 font-medium">Edit</th>
                      <th className="text-center p-3 font-medium">Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((item, index) => (
                      <tr
                        key={item.name}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3">{item.name}</td>
                        <td className="text-center p-3">
                          <Checkbox
                            checked={
                              item.permissions.lihat &&
                              item.permissions.tambah &&
                              item.permissions.edit &&
                              item.permissions.hapus
                            }
                            onCheckedChange={(checked) =>
                              toggleAllPermissions(index, checked as boolean)
                            }
                            className="mx-auto"
                          />
                        </td>
                        <td className="text-center p-3">
                          <Checkbox
                            checked={item.permissions.lihat}
                            onCheckedChange={() =>
                              togglePermission(index, "lihat")
                            }
                            className="mx-auto"
                          />
                        </td>
                        <td className="text-center p-3">
                          <Checkbox
                            checked={item.permissions.tambah}
                            onCheckedChange={() =>
                              togglePermission(index, "tambah")
                            }
                            className="mx-auto"
                          />
                        </td>
                        <td className="text-center p-3">
                          <Checkbox
                            checked={item.permissions.edit}
                            onCheckedChange={() =>
                              togglePermission(index, "edit")
                            }
                            className="mx-auto"
                          />
                        </td>
                        <td className="text-center p-3">
                          <Checkbox
                            checked={item.permissions.hapus}
                            onCheckedChange={() =>
                              togglePermission(index, "hapus")
                            }
                            className="mx-auto"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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