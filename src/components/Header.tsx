import { Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Uncomment salah satu import sesuai dengan router yang Anda gunakan:
// import { useRouter } from 'next/router'; // untuk Next.js Pages Router
// import { useNavigate } from 'react-router-dom'; // untuk React Router
// import { useRouter } from 'next/navigation'; // untuk Next.js App Router

export function Header() {
  // Uncomment sesuai dengan router yang digunakan:
  // const router = useRouter(); // untuk Next.js
  // const navigate = useNavigate(); // untuk React Router

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        // PILIHAN 1: Jika menggunakan localStorage/sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id_users');
        sessionStorage.clear();
        
        // PILIHAN 2: Jika menggunakan cookies (uncomment jika diperlukan)
        // document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // PILIHAN 3: Jika ada API logout endpoint (uncomment jika diperlukan)
        // await fetch('/api/auth/logout', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        
        // PILIHAN 4: Jika menggunakan state management seperti Redux/Zustand
        // dispatch(logout()); // untuk Redux
        // useAuthStore.getState().logout(); // untuk Zustand
        
        // Redirect ke halaman login - pilih salah satu:
        
        // Untuk Next.js Pages Router:
        // router.push('/login');
        
        // Untuk Next.js App Router:
        // router.push('/login');
        
        // Untuk React Router:
        // navigate('/login');
        
        // Untuk vanilla redirect:
        window.location.href = '/tu/login';
        
        // Atau redirect ke root:
        // window.location.href = '/';
        
      } catch (error) {
        console.error('Logout error:', error);
        alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
      }
    }
  };

  

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* <Select defaultValue="sekolah-karsa">
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sekolah-karsa">SEKOLAH KARSA</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Dropdown Admin */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-sm">
              <span>Admin</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <a href="/tu/dashboard">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}