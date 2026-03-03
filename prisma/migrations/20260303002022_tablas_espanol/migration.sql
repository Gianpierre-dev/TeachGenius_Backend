/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_activityId_fkey";

-- DropForeignKey
ALTER TABLE "StudentAnswer" DROP CONSTRAINT "StudentAnswer_sessionId_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "GameSession";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "StudentAnswer";

-- DropTable
DROP TABLE "Teacher";

-- CreateTable
CREATE TABLE "profesores" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tiempo_limite" INTEGER NOT NULL DEFAULT 600,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "profesor_id" TEXT NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "ejemplo" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "pista" TEXT,
    "actividad_id" TEXT NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_juego" (
    "id" TEXT NOT NULL,
    "nombre_alumno" TEXT NOT NULL,
    "iniciado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado_en" TIMESTAMP(3),
    "tiempo_usado" INTEGER,
    "puntaje" INTEGER NOT NULL DEFAULT 0,
    "total_preguntas" INTEGER NOT NULL,
    "actividad_id" TEXT NOT NULL,

    CONSTRAINT "sesiones_juego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_alumnos" (
    "id" TEXT NOT NULL,
    "orden_pregunta" INTEGER NOT NULL,
    "correcta" BOOLEAN NOT NULL,
    "tiempo_respuesta" INTEGER,
    "sesion_id" TEXT NOT NULL,

    CONSTRAINT "respuestas_alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profesores_email_key" ON "profesores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "actividades_codigo_key" ON "actividades"("codigo");

-- CreateIndex
CREATE INDEX "actividades_profesor_id_idx" ON "actividades"("profesor_id");

-- CreateIndex
CREATE INDEX "actividades_codigo_idx" ON "actividades"("codigo");

-- CreateIndex
CREATE INDEX "preguntas_actividad_id_idx" ON "preguntas"("actividad_id");

-- CreateIndex
CREATE INDEX "sesiones_juego_actividad_id_idx" ON "sesiones_juego"("actividad_id");

-- CreateIndex
CREATE INDEX "respuestas_alumnos_sesion_id_idx" ON "respuestas_alumnos"("sesion_id");

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_juego" ADD CONSTRAINT "sesiones_juego_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_alumnos" ADD CONSTRAINT "respuestas_alumnos_sesion_id_fkey" FOREIGN KEY ("sesion_id") REFERENCES "sesiones_juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;
