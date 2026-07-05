# 40 Días con Jesús 🌟

Una aplicación web devocional interactiva y elegante, diseñada para acompañarte y fortalecer tu relación con Dios durante 40 días consecutivos, reflexionando y viviendo la Palabra a diario.

Este proyecto está construido sobre una arquitectura moderna con **React 19**, **Vite**, y **Tailwind CSS v4** con soporte nativo de tipo app móvil y compatibilidad total para despliegue automático en **Vercel**.

---

## ✨ Características Principales

1. **Pantalla de Inicio Inspiradora:**
   - Nombre de la app con un diseño tipográfico elegante (*Playfair Display*).
   - Subtítulo espiritual: *"Un camino diario para escuchar, meditar y vivir la Palabra de Dios"*.
   - Barra de progreso dinámica (porcentaje y número de días completados).
   - Botón inteligente "Continuar" para retomar automáticamente el último día pendiente de leer.
   - Banner visual con la ilustración espiritual original generada.

2. **40 Devocionales Originales y Completos (`src/data/devotions.ts`):**
   - Una base de datos completa de 40 días con pasajes bíblicos edificantes, reflexiones teológicas enriquecedoras, preguntas de autoanálisis y sugerencias prácticas.

3. **Checklist Interactivo de Control de Avance:**
   - Cada día requiere completar 3 pasos prácticos antes de marcarse como completado:
     1. *He leído la Palabra de Dios.*
     2. *He reflexionado en la pregunta.*
     3. *He realizado la acción práctica sugerida.*

4. **Persistencia con LocalStorage:**
   - Todo tu progreso, notas escritas y configuraciones se guardan localmente en el dispositivo para que no pierdas tu avance al cerrar el navegador.

5. **Recordatorio Diario (Notification API):**
   - Selector interactivo de hora.
   - Integración real con la API de Notificaciones del Navegador.
   - Guía interactiva de resolución paso a paso si los permisos están bloqueados en el dispositivo.

6. **Buzón de Reflexiones Guardadas (Notas):**
   - Espacio en cada día para escribir oraciones o compromisos, los cuales se agrupan en una hermosa pestaña resumen para ver toda tu bitácora espiritual.

7. **Estilo Premium & Modo Oscuro:**
   - Diseñado con una paleta mística y suave: violeta profundo, lavanda celestial, blanco y acentos dorados.
   - Transiciones y animaciones fluidas con **Motion** para una experiencia tipo app nativa.
   - Soporte nativo para modo oscuro.

---

## 📁 Estructura del Proyecto

```text
/
├── public/
│   └── img_devotional_hero.jpg   # Imagen de fondo espiritual autogenerada
├── src/
│   ├── components/
│   │   ├── DevotionalCard.tsx    # Tarjeta detallada de lectura diaria, notas e hitos
│   │   ├── CalendarView.tsx      # Cuadrícula interactiva de 40 días
│   │   ├── ProgressStats.tsx     # Dashboard de analíticas y bitácora de notas
│   │   └── ReminderSetup.tsx     # Configuración de alarma y Notification API
│   ├── data/
│   │   └── devotions.ts          # Base de datos espiritual con 40 días de reflexiones
│   ├── App.tsx                   # Controlador de navegación y lógica de persistencia
│   ├── types.ts                  # Declaraciones de tipos limpios para TypeScript
│   ├── main.tsx                  # Punto de entrada de la aplicación
│   └── index.css                 # Estilos globales y fuentes elegantes
├── index.html                    # Página HTML con soporte responsivo y metadatos
├── vercel.json                   # Lógica de redirección SPA óptima para Vercel
├── vite.config.ts                # Configuración optimizada de empaquetado Vite
├── package.json                  # Scripts e instalación de dependencias
└── tsconfig.json                 # Reglas estrictas de compilación TypeScript
```

---

## 🚀 Despliegue en Vercel

Esta aplicación está completamente preparada para Vercel. Al subirla a GitHub o importarla a Vercel, el sistema detectará el archivo `package.json` y el comando de build de Vite automáticamente.

El archivo `vercel.json` preconfigurado asegura que todas las rutas internas de navegación se redirijan siempre al `index.html`, evitando errores 404 al recargar la página:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🛠️ Comandos de Desarrollo

En la raíz del proyecto, puedes ejecutar los siguientes comandos:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en el puerto 3000
npm run dev

# Compilar proyecto optimizado para producción (Vercel)
npm run build

# Verificar la correcta compilación y tipados sin compilar
npm run lint
```
