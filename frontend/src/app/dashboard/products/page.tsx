'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';

interface Product {
  id: number;
  name: string;
  description: string;
  serial_number: string;
  stock_actual: number;
  min_stock: number;
  supplier_id?: number;
}

interface Supplier {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { register, handleSubmit, reset } = useForm();
  const { register: registerMov, handleSubmit: handleSubmitMov, reset: resetMov } = useForm();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers/');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchSuppliers();
  }, []);

  if (!mounted) return null;

  const onSubmit = async (data: any) => {
    try {
      if (data.supplier_id === "") delete data.supplier_id;
      else data.supplier_id = parseInt(data.supplier_id);
      
      data.min_stock = parseFloat(data.min_stock || "0");
      data.stock_actual = parseFloat(data.stock_actual || "0");
      
      await api.post('/products/', data);
      reset();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert('Error al crear producto');
    }
  };

  const onSubmitMov = async (data: any) => {
    try {
      await api.post('/movements/', {
        ...data,
        product_id: selectedProduct?.id,
        quantity: parseFloat(data.quantity)
      });
      resetMov();
      setShowMovementModal(false);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al registrar movimiento');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">Gestión de Productos</h1>
        <div className="space-x-2">
          <button
            onClick={async () => {
              const response = await api.get('/export/products', { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'productos.csv');
              document.body.appendChild(link);
              link.click();
            }}
            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 dark:hover:bg-green-600 transition-colors shadow-lg shadow-green-600/20"
          >
            Exportar CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Añadir Producto
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Cargando productos...</p>
      ) : (
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Número de Serie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stock Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
              {products.map((product) => (
                <tr key={product.id} className={product.stock_actual <= product.min_stock ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.name}
                      {product.stock_actual <= product.min_stock && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                          Stock Bajo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.serial_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    <span className={product.stock_actual <= product.min_stock ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'}>
                      {product.stock_actual}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowMovementModal(true);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium transition-colors"
                    >
                      Registrar Mov.
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">No hay productos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Basic Modal for Creating Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Nuevo Producto</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre</label>
                <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
                <textarea {...register('description')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Número de Serie</label>
                <input {...register('serial_number', { required: true })} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock Inicial</label>
                <input type="number" step="any" {...register('stock_actual')} defaultValue="0" className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock Mínimo (Alerta)</label>
                <input type="number" step="any" {...register('min_stock')} defaultValue="0" className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Proveedor</label>
                <select {...register('supplier_id')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Sin proveedor</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Registrar Movimiento: {selectedProduct?.name}</h2>
            <form onSubmit={handleSubmitMov(onSubmitMov)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipo</label>
                <select {...registerMov('type', { required: true })} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="entry">Entrada</option>
                  <option value="exit">Salida</option>
                  <option value="adjustment">Ajuste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cantidad</label>
                <input type="number" step="any" {...registerMov('quantity', { required: true })} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Asignado a (Responsable/Destinatario)</label>
                <input {...registerMov('assignee')} placeholder="Nombre de la persona" className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
                <input {...registerMov('description')} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowMovementModal(false)} className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-colors">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
