'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Movement {
  id: number;
  product_id: number;
  quantity: number;
  type: string;
  description: string;
  assignee: string;
  created_at: string;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      const response = await api.get('/movements/');
      setMovements(response.data);
    } catch (error) {
      console.error('Error fetching movements', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">Historial de Movimientos</h1>
        <button
          onClick={async () => {
            const response = await api.get('/export/movements', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'movimientos.csv');
            document.body.appendChild(link);
            link.click();
          }}
          className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 dark:hover:bg-green-600 transition-colors shadow-lg shadow-green-600/20"
        >
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Cargando movimientos...</p>
      ) : (
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Producto ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Asignado a</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Descripción</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
              {movements.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{m.product_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      m.type === 'entry' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                      m.type === 'exit' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Salida' : 'Ajuste'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{m.assignee || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">{m.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{m.description}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">No hay movimientos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
