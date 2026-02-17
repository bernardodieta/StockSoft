'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface StockReport {
  id: number;
  name: string;
  serial_number: string;
  stock_actual: number;
  min_stock: number;
}

export default function ReportsPage() {
  const [report, setReport] = useState<StockReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/products/');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const totalStock = report.reduce((acc, p) => acc + p.stock_actual, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 transition-colors">Reporte de Inventario</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 transition-colors">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold">Total Productos</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{report.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border-l-4 border-green-500 transition-colors">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold">Unidades Totales</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalStock}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nº Serie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
            {report.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.serial_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.stock_actual <= 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">Sin Stock</span>
                  ) : p.stock_actual <= p.min_stock ? (
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">Stock Bajo</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-bold">Normal</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold">{p.stock_actual}</td>
              </tr>
            ))}
            {report.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">No hay datos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
