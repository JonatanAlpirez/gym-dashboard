# Gym Tracker Dashboard

Dashboard web para visualizar el progreso de entrenamientos del gym, usando datos exportados de la app **Strong** (o cualquier base de datos con estructura compatible).

## Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: React 19 + CSS puro con variables (sin frameworks CSS)
- **Base de datos**: SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **API**: Next.js Route Handlers
- **TypeScript**

## Requisitos Previos

- Node.js 20+
- Una base de datos SQLite con la estructura de Strong App en `gym_training/DB/gym_tracker.db`

### Estructura esperada de la base de datos

```sql
-- Tablas principales
workouts(id, workout_num, date, name, duration_sec)
exercises(id, name, muscle_group)
workout_exercises(id, workout_id, exercise_id, exercise_order)
sets(id, workout_exercise_id, set_order, weight_lb, reps)
```

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/workout/route.ts   # API GET /api/workout?id=
│   ├── components/
│   │   ├── DashboardClient.tsx  # Dashboard principal
│   │   ├── ThemeContext.tsx      # Provider dark/light mode
│   │   ├── WorkoutModal.tsx      # Modal detalle workout
│   │   └── WorkoutTable.tsx      # Tabla workouts recientes
│   ├── globals.css              # Estilos CSS
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Server component
└── lib/
    ├── queries.ts              # Queries SQL a la base de datos
    └── types.ts               # Interfaces TypeScript
```

## Vistas del Dashboard

1. **Stats Cards** — Workouts totales, ejercicios, sets, duración promedio
2. **Volumen Mensual** — Barras de volumen por mes
3. **Frecuencia Semanal** — Gráfico de entrenamientos por día de la semana
4. **Volumen por Grupo Muscular** — Pecho, espalda, hombros, piernas, brazos, core
5. **Top 10 Récords Personales** — Ejercicios con más peso cargado
6. **Tabla de Workouts Recientes** — Click para ver detalle completo

## Modo Oscuro/Claro

El tema se maneja con CSS variables y una clase `.dark`/`.light` en el elemento `<html>`:

- El `ThemeContext` de React maneja el toggle y persiste la preferencia en `localStorage`
- `globals.css` define variables CSS para ambos temas
- Los componentes usan `var(--variable)` para colores, evitando hardcoding

Para cambiar entre modos, haz click en el botón del sol/luna en el header.

## API

### GET `/api/workout?id=`

Obtiene el detalle completo de un workout por su ID.

**Respuesta:**
```json
{
  "date": "2024-01-15",
  "name": "Push Day",
  "duration_sec": 3600,
  "exercises": [
    {
      "name": "Bench Press",
      "muscle_group": "Chest",
      "sets": [
        { "set_order": 1, "weight_lb": 135, "reps": 10 },
        { "set_order": 2, "weight_lb": 155, "reps": 8 }
      ]
    }
  ]
}
```

## Configuración de Base de Datos

La ruta a la base de datos está en `src/lib/queries.ts`:

```typescript
const DB_PATH = path.join(process.cwd(), '..', '..', 'gym_training', 'DB', 'gym_tracker.db');
```

Si tu base de datos está en otra ubicación, modifica esta constante.

## Deploy

Este proyecto está preparado para deploy en Vercel:

```bash
npm run build
vercel
```

**Nota**: Para producción, la base de datos SQLite debe estar accesible desde el servidor (no funciona con Vercel Serverless sin configuración adicional de volumes).
