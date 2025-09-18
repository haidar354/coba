import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const permissions = [
  {
    title: "1 Sistem Personal Data",
    items: [
      { id: "1.1", name: "1.1 Modul", permissions: { lihat: false, tambah: false, edit: false, hapus: false, lainnya: false } },
      { id: "1.2", name: "1.2 Pegawai", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } },
      { id: "1.3", name: "1.3 Sekolah", permissions: { lihat: false, tambah: false, edit: true, hapus: false, lainnya: false } },
      { id: "1.4", name: "1.4 Peserta Didik", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } }
    ]
  },
  {
    title: "2 Sistem Manajemen Ruang",
    items: [
      { id: "2.1", name: "2.1 Kategori Ruangan", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } },
      { id: "2.2", name: "2.2 Ruangan", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } },
      { id: "2.3", name: "2.3 Peminjaman Ruangan", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } },
      { id: "2.4", name: "2.4 Pinjam Ruangan", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } },
      { id: "2.5", name: "2.5 Jadwal Ruangan", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } }
    ]
  },
  {
    title: "3 Sistem Persediaan",
    items: [
      { id: "3.1", name: "3.1 Kategori Barang", permissions: { lihat: false, tambah: true, edit: true, hapus: true, lainnya: false } }
    ]
  }
];

export default function TambahRole() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/manajemen-role');
  };

  const handleSave = () => {
    // Here you would typically save the role data
    navigate('/manajemen-role');
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
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
        {/* Form Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="namaRole">Nama Role</Label>
                <Input id="namaRole" placeholder="Enter role name" />
              </div>
              
              <div>
                <Label htmlFor="levelRole">Level Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Section */}
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
                      <th className="text-left p-3 font-medium">Fitur</th>
                      <th className="text-center p-3 font-medium">Lihat</th>
                      <th className="text-center p-3 font-medium">Tambah</th>
                      <th className="text-center p-3 font-medium">Edit</th>
                      <th className="text-center p-3 font-medium">Hapus</th>
                      <th className="text-center p-3 font-medium">Lainnya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((section) => (
                      <React.Fragment key={section.title}>
                        <tr className="bg-blue-50">
                          <td colSpan={6} className="p-3 font-medium text-primary">
                            {section.title}
                          </td>
                        </tr>
                        {section.items.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">{item.name}</td>
                            <td className="text-center p-3">
                              <Checkbox 
                                checked={item.permissions.lihat}
                                className="mx-auto"
                              />
                            </td>
                            <td className="text-center p-3">
                              <Checkbox 
                                checked={item.permissions.tambah}
                                className="mx-auto"
                              />
                            </td>
                            <td className="text-center p-3">
                              <Checkbox 
                                checked={item.permissions.edit}
                                className="mx-auto"
                              />
                            </td>
                            <td className="text-center p-3">
                              <Checkbox 
                                checked={item.permissions.hapus}
                                className="mx-auto"
                              />
                            </td>
                            <td className="text-center p-3">
                              <Checkbox 
                                checked={item.permissions.lainnya}
                                className="mx-auto"
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="outline" onClick={handleBack}>
                  Kembali
                </Button>
                <Button onClick={handleSave}>
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React from 'react';