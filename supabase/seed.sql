-- ===================================================================
-- MATHPATH: SEED DATA (Fase A - Fase F)
-- Supabase / PostgreSQL Seed SQL
-- ===================================================================

-- 1. SEED PHASES
INSERT INTO public.phases (code, name, description, order_index) VALUES
('FASE_A', 'Fase A (Kelas 1–2 SD)', 'Fondasi berhitung dasar, pengenalan angka, dan bangun ruang sederhana', 1),
('FASE_B', 'Fase B (Kelas 3–4 SD)', 'Operasi perkalian/pembagian, konsep pecahan dasar, dan pengukuran', 2),
('FASE_C', 'Fase C (Kelas 5–6 SD)', 'Pecahan lanjut, desimal, persen, rasio, dan statistika deskriptif awal', 3),
('FASE_D', 'Fase D (Kelas 7–9 SMP)', 'Aljabar, persamaan linear, phytagoras, geometri koordinat, dan peluang', 4),
('FASE_E', 'Fase E (Kelas 10 SMA)', 'Eksponen, logaritma, fungsi kuadrat, trigonometri dasar, dan statistika', 5),
('FASE_F', 'Fase F (Kelas 11–12 SMA)', 'Fungsi komposisi/invers, kalkulus diferensial/integral, dan matriks', 6)
ON CONFLICT (code) DO NOTHING;

-- 2. SEED SAMPLE USERS / PROFILES
INSERT INTO public.profiles (id, email, full_name, role, class_grade) VALUES
('00000000-0000-0000-0000-000000000001', 'budi@mathpath.id', 'Budi Pratama', 'student', 'Kelas 10 SMA'),
('00000000-0000-0000-0000-000000000002', 'siti@mathpath.id', 'Siti Rahmawati', 'student', 'Kelas 9 SMP'),
('00000000-0000-0000-0000-000000000003', 'dewi.safitri@mathpath.id', 'Ibu Dewi Safitri, S.Pd.', 'teacher', 'Guru Matematika'),
('00000000-0000-0000-0000-000000000004', 'admin@mathpath.id', 'Administrator Kurikulum MathPath', 'admin', 'Staf Kurikulum')
ON CONFLICT (email) DO NOTHING;

-- Complete seed structures can be synchronized from server/data.ts
