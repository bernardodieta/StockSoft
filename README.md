# 📦 StockSoft - Gestión de Inventarios Inteligente (SaaS)

¡Bienvenido a **StockSoft**! Esta es una plataforma robusta diseñada para ayudar a las empresas a tomar el control total de sus existencias de una manera sencilla, visual y profesional. Construida con una arquitectura moderna, permite que múltiples empresas gestionen sus datos de forma aislada y segura bajo un modelo SaaS.

## ✨ ¿Qué hace StockSoft?

StockSoft no es solo una tabla de datos; es una herramienta pensada en el flujo real de un almacén:

*   **🏢 Multi-Empresa desde la Raíz:** Registra tu empresa y crea tu cuenta de administrador. Los datos de tu organización están totalmente aislados de las demás.
*   **🛡️ Seguridad y Roles:** Diferencia entre quién puede solo registrar movimientos (**Operadores**) y quién tiene el poder de configurar el catálogo y ver reportes críticos (**Administradores**).
*   **📦 Catálogo de Productos Detallado:** Gestiona productos con números de serie únicos, descripciones y vinculación directa con proveedores.
*   **📉 Alertas de Stock Bajo:** ¡Que no te pille por sorpresa! El sistema resalta visualmente los productos que están por debajo de su stock mínimo configurado.
*   **🔄 Trazabilidad de Movimientos:** Cada entrada, salida o ajuste queda registrado con fecha, hora, el usuario que lo hizo y, lo más importante, **a quién se le asignó el producto**.
*   **🤝 Gestión de Proveedores:** Mantén a mano el contacto directo de quienes te suministran la mercancía.
*   **📊 Reportes y Exportación:** Visualiza el estado de tu inventario en tiempo real y descarga tus datos en CSV para trabajar en Excel cuando lo necesites.
*   **🌙 Modo Oscuro/Claro:** Porque sabemos que pasar muchas horas frente a la pantalla cansa, elige el tema que mejor se adapte a tu vista.

## 🛠️ El Cerebro y el Músculo (Stack Tecnológico)

Hemos elegido tecnologías de alto rendimiento para garantizar estabilidad:

*   **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13) - Rápido, moderno y con validación automática de datos.
*   **Frontend:** [Next.js 15](https://nextjs.org/) (React + TypeScript) - Interfaz ágil, tipada y con una experiencia de usuario fluida.
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) - El estándar de oro para la integridad de datos.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Para un diseño limpio y un modo oscuro impecable.
*   **Contenedores:** [Docker](https://www.docker.com/) - Para levantar la base de datos en segundos.

## 🚀 Cómo ponerlo en marcha

### 1. Preparar la Base de Datos
Necesitas Docker instalado. Desde la raíz del proyecto:
```powershell
docker-compose up -d
```

### 2. El Backend
Ve a la carpeta `backend`, crea tu entorno virtual e instala las dependencias:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. El Frontend
En otra terminal, ve a `frontend` e inicia la interfaz:
```powershell
cd frontend
npm install
npm run dev
```

Ahora entra en `http://localhost:3000`, ¡regístrate y empieza a organizar tu stock!

---

Desarrollado con ❤️ para empresas que buscan orden en su inventario.
