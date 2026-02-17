'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setError('');
      await api.post('/register', {
        company_name: data.company_name,
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrarse');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          StockSoft - Registro
        </h2>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-2">
            <input
              {...register('company_name', { required: true })}
              placeholder="Nombre de la Empresa"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
            <input
              {...register('full_name', { required: true })}
              placeholder="Nombre Completo"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
            <input
              {...register('password', { required: true, minLength: 6 })}
              type="password"
              placeholder="Password"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Registrarse
          </button>
          <div className="text-center">
            <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
