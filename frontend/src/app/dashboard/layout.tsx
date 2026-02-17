'use client';

import Link from 'next/link';
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/theme-toggle';
import api from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user, setAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      if (!user) {
        try {
          const response = await api.get('/users/me');
          setAuth(response.data, token);
        } catch (err) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };
    fetchUser();
  }, [user, setAuth, router]);

  const navItems = [
    { name: 'Inicio', href: '/dashboard' },
    { name: 'Productos', href: '/dashboard/products' },
    { name: 'Movimientos', href: '/dashboard/movements' },
    { name: 'Proveedores', href: '/dashboard/suppliers' },
    { name: 'Reportes', href: '/dashboard/reports' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 dark:bg-zinc-900 text-white flex flex-col transition-colors">
        <div className="p-4 text-2xl font-bold border-b border-indigo-800 dark:border-zinc-800 flex justify-between items-center">
          <span>StockSoft</span>
          <ThemeToggle />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-2 rounded hover:bg-indigo-800 dark:hover:bg-zinc-800 transition-colors ${
                pathname === item.href ? 'bg-indigo-800 dark:bg-zinc-800 font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800 dark:border-zinc-800">
          <div className="text-sm mb-2 text-indigo-200 dark:text-zinc-400">{user?.full_name}</div>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full text-left p-2 text-red-300 hover:text-red-100 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto text-zinc-900 dark:text-zinc-100">
        {children}
      </div>
    </div>
  );
}
