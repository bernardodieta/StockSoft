'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';

interface Supplier {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers/');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/suppliers/', data);
      reset();
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      alert('Error al crear proveedor');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">Gestión de Proveedores</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-600/20"
        >
          Añadir Proveedor
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Cargando proveedores...</p>
      ) : (
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Teléfono</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.contact_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.phone}</td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">No hay proveedores registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Nuevo Proveedor</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre de la Empresa</label>
                <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre de Contacto</label>
                <input {...register('contact_name')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Teléfono</label>
                <input {...register('phone')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dirección</label>
                <input {...register('address')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
