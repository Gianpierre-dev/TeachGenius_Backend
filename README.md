# TeachGenius Backend

API REST para **TeachGenius**, una plataforma educativa gamificada donde profesores crean actividades tipo pupiletras y los alumnos las resuelven en tiempo real con un código de acceso.

## Tech Stack

- **NestJS 11** — Framework backend
- **Prisma ORM** — PostgreSQL con migraciones y schema tipado
- **JWT + Passport** — Autenticación stateless
- **bcrypt** — Hashing de contraseñas
- **class-validator** — Validación de DTOs
- **TypeScript** — Tipado estricto

## Arquitectura

```
src/
├── auth/           # Registro, login, JWT strategy
├── teachers/       # Perfil del profesor
├── activities/     # CRUD de actividades + código único
├── questions/      # Gestión de preguntas por actividad
├── game/           # Flujo de juego del alumno
├── prisma/         # PrismaService global
└── config/         # Variables de entorno tipadas
```

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registro de profesor |
| POST | `/auth/login` | Login con JWT |

### Actividades (requiere auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/activities` | Crear actividad con preguntas |
| GET | `/activities` | Listar actividades del profesor |
| GET | `/activities/:id` | Detalle de actividad |
| PUT | `/activities/:id` | Actualizar actividad |
| DELETE | `/activities/:id` | Eliminar actividad |
| GET | `/activities/:id/results` | Resultados de alumnos |

### Juego (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/game/:code` | Obtener actividad por código |
| POST | `/game/:code/start` | Iniciar sesión de juego |
| POST | `/game/sessions/:id/answer` | Enviar respuesta |
| POST | `/game/sessions/:id/finish` | Finalizar sesión |

## Modelo de datos

- **Profesor** → tiene muchas **Actividades**
- **Actividad** → tiene muchas **Preguntas** y **Sesiones de juego**
- **SesionJuego** → tiene muchas **Respuestas de alumno**

Cada actividad genera un código único (ej: `ABC-123`) para que los alumnos accedan.

## Instalación

```bash
pnpm install
cp .env.example .env   # Configurar variables
pnpm prisma migrate dev
pnpm run dev
```

## Variables de entorno

Ver [`.env.example`](.env.example) para las variables requeridas.

## Repositorio relacionado

- **Frontend**: [TeachGenius_Frontend](https://github.com/Gianpierre-dev/TeachGenius_Frontend)
