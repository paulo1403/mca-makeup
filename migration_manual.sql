-- Migración manual para agregar nightShiftCost a appointments
-- Este SQL debe ejecutarse en la base de datos de producción de Neon

ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "nightShiftCost" DOUBLE PRECISION;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointments' AND column_name = 'nightShiftCost';
