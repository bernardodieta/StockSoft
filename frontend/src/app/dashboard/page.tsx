'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/theme-toggle';
import api from '@/lib/api';

export default function DashboardPage() {
  const { user, setAuth, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  }, [router, user, setAuth]);

  if (!mounted) return null;
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-zinc-950 transition-colors">
      <div className="text-zinc-600 dark:text-zinc-400 font-medium">Cargando información...</div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 transition-colors">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Bienvenido, {user.full_name}</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-500/20"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300 mb-4">Información de Usuario</h2>
            <div className="space-y-2">
              <p className="text-zinc-600 dark:text-zinc-400"><span className="font-medium text-zinc-900 dark:text-zinc-200">Email:</span> {user.email}</p>
              <p className="text-zinc-600 dark:text-zinc-400"><span className="font-medium text-zinc-900 dark:text-zinc-200">Rol:</span> <span className="capitalize">{user.role}</span></p>
            </div>
          </div>
          
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">Empresa</h2>
            <div className="space-y-2">
              <p className="text-zinc-600 dark:text-zinc-400"><span className="font-medium text-zinc-900 dark:text-zinc-200">ID de Empresa:</span> {user.company_id}</p>
              <p className="text-zinc-500 dark:text-zinc-500 text-sm italic italic">Los datos mostrados están aislados para su organización.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Acceso Rápido</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">Utilice el menú lateral para gestionar su inventario, movimientos y proveedores.</p>
          <div className="flex gap-4">
            <button onClick={() => router.push('/dashboard/products')} className="text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 py-2 px-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
              Ver Productos
            </button>
            <button onClick={() => router.push('/dashboard/movements')} className="text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 py-2 px-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
              Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
