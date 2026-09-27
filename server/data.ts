/**
 * MathPath Curriculum Data Store
 * Kurikulum Matematika Indonesia Fase A - Fase F
 * 
 * PEMBERITAHUAN SEED DATASET:
 * "Konten ini merupakan konten awal/seed yang dapat dikembangkan dan disesuaikan dengan dokumen kurikulum sekolah."
 */

import { Phase, Level, Topic, Subtopic, LearningMaterial, ExampleItem, Question, Assessment } from '../src/types';
import { DIAGNOSTIC_QUESTIONS_30 } from './diagnosticData';

export const CURRICULUM_SEED_DISCLAIMER = "Konten ini merupakan konten awal/seed yang dapat dikembangkan dan disesuaikan dengan dokumen kurikulum sekolah.";

export const INITIAL_PHASES: Phase[] = [
  {
    id: 'phase-a',
    code: 'FASE_A',
    name: 'Fase A (Kelas 1 - 2 SD)',
    description: 'Fondasi bilangan cacah hingga 100, operasi penjumlahan & pengurangan sederhana, serta pengenalan bangun datar.',
    orderIndex: 1
  },
  {
    id: 'phase-b',
    code: 'FASE_B',
    name: 'Fase B (Kelas 3 - 4 SD)',
    description: 'Nilai tempat ribuan, perkalian, pembagian, konsep pecahan senilai, pengukuran panjang dan luas bidang datar.',
    orderIndex: 2
  },
  {
    id: 'phase-c',
    code: 'FASE_C',
    name: 'Fase C (Kelas 5 - 6 SD)',
    description: 'Operasi pecahan campuran, desimal & persen, rasio perbandingan, geometri bangun ruang sederhana, dan pengolahan data.',
    orderIndex: 3
  },
  {
    id: 'phase-d',
    code: 'FASE_D',
    name: 'Fase D (Kelas 7 - 9 SMP)',
    description: 'Bentuk aljabar, persamaan linear satu variabel (PLSV), perbandingan, teorema Pythagoras, statistika data tunggal, dan peluang.',
    orderIndex: 4
  },
  {
    id: 'phase-e',
    code: 'FASE_E',
    name: 'Fase E (Kelas 10 SMA/SMK)',
    description: 'Eksponen & logaritma, barisan dan deret, persamaan & fungsi kuadrat, serta trigonometri dasar segitiga siku-siku.',
    orderIndex: 5
  },
  {
    id: 'phase-f',
    code: 'FASE_F',
    name: 'Fase F (Kelas 11 - 12 SMA/SMK)',
    description: 'Fungsi komposisi & invers, limit dan kalkulus turunan-integral aljabar, trigonometri analitik, dan statistika inferensial.',
    orderIndex: 6
  }
];

export const INITIAL_LEVELS: Level[] = [
  { id: 'level-a1', phaseId: 'phase-a', name: 'Level A1: Bilangan Cacah & Geometri Dasar', gradeEquivalent: 'Kelas 1-2 SD', orderIndex: 1 },
  { id: 'level-b1', phaseId: 'phase-b', name: 'Level B1: Pecahan Senilai & Pengukuran', gradeEquivalent: 'Kelas 3-4 SD', orderIndex: 2 },
  { id: 'level-c1', phaseId: 'phase-c', name: 'Level C1: Pecahan Campuran, Rasio & Data', gradeEquivalent: 'Kelas 5-6 SD', orderIndex: 3 },
  { id: 'level-d1', phaseId: 'phase-d', name: 'Level D1: Fondasi Bilangan & Bentuk Aljabar', gradeEquivalent: 'Kelas 7 SMP', orderIndex: 4 },
  { id: 'level-d2', phaseId: 'phase-d', name: 'Level D2: Persamaan Linear Satu Variabel', gradeEquivalent: 'Kelas 7 SMP', orderIndex: 5 },
  { id: 'level-d3', phaseId: 'phase-d', name: 'Level D3: Pemfaktoran Aljabar & Pola', gradeEquivalent: 'Kelas 8 SMP', orderIndex: 6 },
  { id: 'level-d4', phaseId: 'phase-d', name: 'Level D4: Teorema Pythagoras & Statistika SMP', gradeEquivalent: 'Kelas 8 SMP', orderIndex: 7 },
  { id: 'level-d5', phaseId: 'phase-d', name: 'Level D5: Peluang Kejadian Sederhana', gradeEquivalent: 'Kelas 9 SMP', orderIndex: 8 },
  { id: 'level-e1', phaseId: 'phase-e', name: 'Level E1: Eksponen, Logaritma & Barisan', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 9 },
  { id: 'level-e2', phaseId: 'phase-e', name: 'Level E2: Persamaan Kuadrat & Pemfaktoran', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 10 },
  { id: 'level-e3', phaseId: 'phase-e', name: 'Level E3: Fungsi Kuadrat & Titik Ekstrem', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 11 },
  { id: 'level-e4', phaseId: 'phase-e', name: 'Level E4: Trigonometri Dasar Segitiga', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 12 },
  { id: 'level-f1', phaseId: 'phase-f', name: 'Level F1: Fungsi Komposisi & Invers', gradeEquivalent: 'Kelas 11 SMA', orderIndex: 13 },
  { id: 'level-f2', phaseId: 'phase-f', name: 'Level F2: Turunan & Kalkulus Dasar', gradeEquivalent: 'Kelas 11-12 SMA', orderIndex: 14 }
];

export const INITIAL_TOPICS: Topic[] = [
  // --- FASE A ---
  {
    id: 'topic-fase-a-bilangan',
    levelId: 'level-a1',
    phaseId: 'phase-a',
    title: 'Bilangan Cacah & Operasi Hitung Sederhana',
    slug: 'bilangan-cacah-fase-a',
    description: 'Mengenal lambang bilangan 1-100, nilai tempat puluhan & satuan, serta penjumlahan dan pengurangan dasar.',
    passingScore: 75,
    estimatedMinutes: 25,
    orderIndex: 1,
    prerequisiteIds: []
  },
  {
    id: 'topic-fase-a-geometri',
    levelId: 'level-a1',
    phaseId: 'phase-a',
    title: 'Geometri Dasar & Pola Bentuk',
    slug: 'geometri-dasar-fase-a',
    description: 'Mengenal segitiga, segi empat, lingkaran, serta pola pengubinan bentuk datar sederhana.',
    passingScore: 75,
    estimatedMinutes: 20,
    orderIndex: 2,
    prerequisiteIds: ['topic-fase-a-bilangan']
  },

  // --- FASE B ---
  {
    id: 'topic-pecahan-senilai',
    levelId: 'level-b1',
    phaseId: 'phase-b',
    title: 'Pecahan Senilai & Operasi Sederhana',
    slug: 'pecahan-senilai',
    description: 'Memahami representasi pecahan dengan gambar model konkret, perkalian pembilang-penyebut, dan perbandingan pecahan.',
    passingScore: 75,
    estimatedMinutes: 30,
    orderIndex: 3,
    prerequisiteIds: ['topic-fase-a-bilangan']
  },
  {
    id: 'topic-fase-b-pengukuran',
    levelId: 'level-b1',
    phaseId: 'phase-b',
    title: 'Pengukuran Panjang, Luas & Keliling',
    slug: 'pengukuran-panjang-luas-fase-b',
    description: 'Mengukur satuan panjang standar (cm, m), menghitung keliling dan luas persegi serta persegi panjang.',
    passingScore: 75,
    estimatedMinutes: 30,
    orderIndex: 4,
    prerequisiteIds: ['topic-pecahan-senilai']
  },

  // --- FASE C ---
  {
    id: 'topic-operasi-pecahan',
    levelId: 'level-c1',
    phaseId: 'phase-c',
    title: 'Operasi Pecahan Campuran, Desimal & Rasio',
    slug: 'operasi-pecahan-desimal',
    description: 'Menjumlahkan, mengurangkan, mengalikan pecahan campuran, desimal, persen, dan penerapan skala rasio.',
    passingScore: 75,
    estimatedMinutes: 40,
    orderIndex: 5,
    prerequisiteIds: ['topic-pecahan-senilai']
  },
  {
    id: 'topic-fase-c-data',
    levelId: 'level-c1',
    phaseId: 'phase-c',
    title: 'Geometri Bangun Ruang & Pengolahan Data',
    slug: 'bangun-ruang-data-fase-c',
    description: 'Menghitung volume kubus dan balok serta membaca diagram batang dan tabel distribusi frekuensi sederhana.',
    passingScore: 75,
    estimatedMinutes: 35,
    orderIndex: 6,
    prerequisiteIds: ['topic-operasi-pecahan']
  },

  // --- FASE D (Prioritas Penuh: SMP - 9 Topik Standar Kurikulum) ---
  {
    id: 'topic-fase-d-bilangan',
    levelId: 'level-d1',
    phaseId: 'phase-d',
    title: 'Bilangan Bulat & Rasional',
    slug: 'bilangan-bulat-rasional',
    description: 'Operasi hitung bilangan bulat positif-negatif, sifat komutatif-asosiatif-distributif, FPB dan KPK.',
    passingScore: 75,
    estimatedMinutes: 35,
    orderIndex: 7,
    prerequisiteIds: ['topic-operasi-pecahan']
  },
  {
    id: 'topic-fase-d-rasio',
    levelId: 'level-d1',
    phaseId: 'phase-d',
    title: 'Rasio dan Proporsi',
    slug: 'rasio-dan-proporsi',
    description: 'Konsep rasio kesetaraan, perbandingan senilai dan berbalik nilai dalam konteks kecepatan, skala peta, dan konversi.',
    passingScore: 75,
    estimatedMinutes: 40,
    orderIndex: 8,
    prerequisiteIds: ['topic-fase-d-bilangan']
  },
  {
    id: 'topic-bentuk-aljabar',
    levelId: 'level-d1',
    phaseId: 'phase-d',
    title: 'Bentuk Aljabar & Operasi Dasar',
    slug: 'bentuk-aljabar',
    description: 'Mengenal variabel, koefisien, konstanta, suku sejenis, serta penjumlahan, pengurangan, dan perkalian aljabar.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 9,
    prerequisiteIds: ['topic-fase-d-rasio']
  },
  {
    id: 'topic-plsv',
    levelId: 'level-d2',
    phaseId: 'phase-d',
    title: 'Persamaan Linear Satu Variabel (PLSV)',
    slug: 'persamaan-linear-satu-variabel',
    description: 'Menyelesaikan persamaan linear bentuk ax + b = c dengan kesetaraan aljabar dan pemodelan cerita.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 10,
    prerequisiteIds: ['topic-bentuk-aljabar']
  },
  {
    id: 'topic-fase-d-spldv',
    levelId: 'level-d2',
    phaseId: 'phase-d',
    title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
    slug: 'sistem-persamaan-linear-dua-variabel',
    description: 'Menentukan himpunan penyelesaian SPLDV dengan metode eliminasi, substitusi, grafik, dan pemodelan masalah nyata.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 11,
    prerequisiteIds: ['topic-plsv']
  },
  {
    id: 'topic-fase-d-fungsi',
    levelId: 'level-d3',
    phaseId: 'phase-d',
    title: 'Relasi dan Fungsi Linear',
    slug: 'relasi-dan-fungsi-linear',
    description: 'Memahami relasi, fungsi, daerah asal (domain), daerah hasil (range), dan grafik persamaan garis lurus y = mx + c.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 12,
    prerequisiteIds: ['topic-fase-d-spldv']
  },
  {
    id: 'topic-pemfaktoran',
    levelId: 'level-d3',
    phaseId: 'phase-d',
    title: 'Pemfaktoran Aljabar',
    slug: 'pemfaktoran-aljabar',
    description: 'Memfaktorkan suku aljabar persekutuan (FPB), selisih dua kuadrat, dan bentuk kuadrat trinomial ax² + bx + c.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 13,
    prerequisiteIds: ['topic-bentuk-aljabar']
  },
  {
    id: 'topic-pythagoras',
    levelId: 'level-d4',
    phaseId: 'phase-d',
    title: 'Teorema Pythagoras & Geometri',
    slug: 'teorema-pythagoras',
    description: 'Membuktikan dan menerapkan hubungan a² + b² = c² pada segitiga siku-siku serta pengukuran geometri bangun datar.',
    passingScore: 75,
    estimatedMinutes: 40,
    orderIndex: 14,
    prerequisiteIds: ['topic-bentuk-aljabar']
  },
  {
    id: 'topic-fase-d-statistika',
    levelId: 'level-d4',
    phaseId: 'phase-d',
    title: 'Statistika Dasar & Ukuran Pemusatan',
    slug: 'statistika-dasar-fase-d',
    description: 'Menghitung mean (rata-rata), median (nilai tengah), modus, dan jangkauan data tunggal.',
    passingScore: 75,
    estimatedMinutes: 40,
    orderIndex: 15,
    prerequisiteIds: ['topic-plsv']
  },
  {
    id: 'topic-fase-d-peluang',
    levelId: 'level-d5',
    phaseId: 'phase-d',
    title: 'Peluang Kejadian Tunggal & Majemuk',
    slug: 'peluang-kejadian-fase-d',
    description: 'Titik sampel, ruang sampel n(S), dan menghitung nilai peluang kejadian teoretik P(A) = n(A)/n(S).',
    passingScore: 75,
    estimatedMinutes: 35,
    orderIndex: 16,
    prerequisiteIds: ['topic-fase-d-statistika']
  },

  // --- FASE E (Prioritas Penuh: SMA Kelas 10) ---
  {
    id: 'topic-fase-e-eksponen',
    levelId: 'level-e1',
    phaseId: 'phase-e',
    title: 'Eksponen & Bilangan Berpangkat',
    slug: 'eksponen-bilangan-berpangkat',
    description: 'Sifat-sifat eksponen bulat, bentuk akar, rasionalisasi penyebut, dan fungsi eksponensial.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 14,
    prerequisiteIds: ['topic-pemfaktoran']
  },
  {
    id: 'topic-fase-e-logaritma',
    levelId: 'level-e1',
    phaseId: 'phase-e',
    title: 'Logaritma & Sifat-Sifatnya',
    slug: 'logaritma-sifat-operasi',
    description: 'Definisi logaritma sebagai invers eksponen, basis 10 dan basis e, serta sifat penjumlahan dan pengurangan logaritma.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 15,
    prerequisiteIds: ['topic-fase-e-eksponen']
  },
  {
    id: 'topic-persamaan-kuadrat',
    levelId: 'level-e2',
    phaseId: 'phase-e',
    title: 'Persamaan Kuadrat',
    slug: 'persamaan-kuadrat',
    description: 'Menentukan akar-akar persamaan kuadrat dengan pemfaktoran, melengkapkan kuadrat, dan rumus kuadratik abc.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 16,
    prerequisiteIds: ['topic-pemfaktoran']
  },
  {
    id: 'topic-fungsi-kuadrat',
    levelId: 'level-e3',
    phaseId: 'phase-e',
    title: 'Fungsi Kuadrat & Titik Ekstrem',
    slug: 'fungsi-kuadrat',
    description: 'Menganalisis parabola f(x) = ax² + bx + c, sumbu simetri x = -b/2a, diskriminan D = b² - 4ac, dan titik puncak ekstrem.',
    passingScore: 75,
    estimatedMinutes: 55,
    orderIndex: 17,
    prerequisiteIds: ['topic-persamaan-kuadrat']
  },
  {
    id: 'topic-fase-e-trigonometri',
    levelId: 'level-e4',
    phaseId: 'phase-e',
    title: 'Trigonometri Dasar Segitiga Siku-Siku',
    slug: 'trigonometri-dasar-fase-e',
    description: 'Perbandingan sinus, kosinus, tangen (demi, sami, desa) pada segitiga siku-siku dan sudut istimewa.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 18,
    prerequisiteIds: ['topic-pythagoras']
  },

  // --- FASE F (SMA Kelas 11 - 12 Lanjut) ---
  {
    id: 'topic-fase-f-fungsi',
    levelId: 'level-f1',
    phaseId: 'phase-f',
    title: 'Fungsi Komposisi & Fungsi Invers',
    slug: 'fungsi-komposisi-invers',
    description: 'Operasi (f ∘ g)(x), domain dan range, serta menentukan fungsi invers f⁻¹(x) secara analitik.',
    passingScore: 75,
    estimatedMinutes: 55,
    orderIndex: 19,
    prerequisiteIds: ['topic-fungsi-kuadrat']
  },
  {
    id: 'topic-turunan',
    levelId: 'level-f2',
    phaseId: 'phase-f',
    title: 'Limit & Turunan Fungsi Aljabar',
    slug: 'turunan-fungsi-aljabar',
    description: 'Konsep limit laju perubahan f\'(x), aturan turunan pangkat, garis singgung kurva, dan uji titik stasioner.',
    passingScore: 75,
    estimatedMinutes: 60,
    orderIndex: 20,
    prerequisiteIds: ['topic-fungsi-kuadrat']
  }
];

export const INITIAL_SUBTOPICS: Subtopic[] = [
  { id: 'sub-ba-1', topicId: 'topic-bentuk-aljabar', title: 'Unsur Bentuk Aljabar (Koefisien, Variabel, Konstanta)', description: 'Mengenal dan membedakan komponen 3x + 5', orderIndex: 1 },
  { id: 'sub-ba-2', topicId: 'topic-bentuk-aljabar', title: 'Suku Sejenis & Operasi Penjumlahan/Pengurangan', description: 'Aturan menggabungkan suku dengan variabel dan pangkat sama', orderIndex: 2 },
  { id: 'sub-ba-3', topicId: 'topic-bentuk-aljabar', title: 'Perkalian Bentuk Aljabar & Sifat Distributif', description: 'Perkalian suku tunggal dan suku dua (binomial)', orderIndex: 3 },
  { id: 'sub-pf-1', topicId: 'topic-pemfaktoran', title: 'Faktor Persekutuan Terbesar (FPB)', description: 'Mengeluarkan faktor persekutuan ab + ac = a(b + c)', orderIndex: 1 },
  { id: 'sub-pf-2', topicId: 'topic-pemfaktoran', title: 'Selisih Dua Kuadrat', description: 'Bentuk khusus a² - b² = (a + b)(a - b)', orderIndex: 2 },
  { id: 'sub-pf-3', topicId: 'topic-pemfaktoran', title: 'Pemfaktoran Trinomial Kuadrat ax² + bx + c', description: 'Mencari pasangan bilangan p dan q', orderIndex: 3 },
  { id: 'sub-pk-1', topicId: 'topic-persamaan-kuadrat', title: 'Bentuk Baku & Akar Persamaan Kuadrat', description: 'Bentuk ax² + bx + c = 0', orderIndex: 1 },
  { id: 'sub-pk-2', topicId: 'topic-persamaan-kuadrat', title: 'Penyelesaian dengan Rumus abc Kuadratik', description: 'x = (-b ± √D) / 2a', orderIndex: 2 },
  { id: 'sub-fk-1', topicId: 'topic-fungsi-kuadrat', title: 'Bentuk Grafik Parabola & Diskriminan D', description: 'Arah buka kurva dan pemotongan sumbu X', orderIndex: 1 },
  { id: 'sub-fk-2', topicId: 'topic-fungsi-kuadrat', title: 'Sumbu Simetri dan Titik Balik Puncak Ekstrem', description: 'Rumus x_p = -b/(2a) dan y_p = -D/(4a)', orderIndex: 2 }
];

export const INITIAL_MATERIALS: Record<string, LearningMaterial> = {
  'topic-bentuk-aljabar': {
    id: 'mat-ba',
    topicId: 'topic-bentuk-aljabar',
    title: 'Bentuk Aljabar, Unsur-Unsur & Operasi Dasar',
    learningObjectives: [
      '1. Mengidentifikasi suku-suku dalam suatu bentuk aljabar.',
      '2. Menentukan koefisien dari suatu variabel dengan memperhatikan tandanya.',
      '3. Menentukan konstanta dalam bentuk aljabar.',
      '4. Mengidentifikasi pasangan suku sejenis dan suku tidak sejenis.',
      '5. Melakukan operasi penjumlahan pada bentuk aljabar dengan benar.',
      '6. Melakukan operasi pengurangan bentuk aljabar dengan cermat.',
      '7. Melakukan perkalian suku aljabar menggunakan sifat distributif.'
    ],
    apperception: 'Pernahkah kamu berbelanja di minimarket dan membeli 3 bungkus roti dan 2 kotak susu? Jika harga roti dimisalkan x dan harga susu dimisalkan y, maka total belanjaanmu dapat dituliskan secara ringkas sebagai 3x + 2y. Bentuk seperti inilah yang disebut bentuk aljabar! Aljabar adalah bahasa matematika universal untuk memodelkan kuantitas yang belum diketahui nilainya.',
    basicConcepts: `Pengertian Bentuk Aljabar:
Bentuk aljabar adalah gabungan antara angka (bilangan) dan huruf (variabel) yang dihubungkan dengan tanda operasi hitung (+, -, ×, :).

Perhatikan contoh bentuk aljabar berikut:
3x + 5

Unsur-unsurnya adalah:
1. 3 disebut KOEFISIEN (faktor pengali di depan variabel).
2. x disebut VARIABEL (huruf lambang pengganti nilai yang belum pasti).
3. 5 disebut KONSTANTA (bilangan tetap yang berdiri sendiri tanpa variabel).
4. 3x dan 5 disebut SUKU-SUKU aljabar.

Konsep Suku Sejenis:
Dua suku dikatakan SEJENIS jika memiliki variabel yang sama DAN pangkat variabel yang sama persis.
Contoh suku sejenis:
- 3x dan 5x (sejenis, variabelnya sama-sama x)
- 4a² dan -7a² (sejenis, variabelnya sama-sama a²)

Contoh suku TIDAK sejenis:
- 3x dan 5y (variabel berbeda: x dan y)
- 2x dan 2x² (pangkat berbeda: x pangkat 1 dan x pangkat 2)`,
    detailedExplanation: `Aturan Operasi Bentuk Aljabar:

1. Penjumlahan & Pengurangan:
HANYA suku-suku yang sejenis yang boleh dijumlahkan atau dikurangkan koefisiennya!
Contoh bertingkat:
Contoh 1:
3x + 5x = (3 + 5)x = 8x

Contoh 2:
(2x + 3) + (4x - 1)
= 2x + 4x + 3 - 1
= 6x + 2

Contoh 3:
(5a - 2b) - (3a - 7b)
= 5a - 2b - 3a + 7b (ingat: tanda minus didistribusikan!)
= (5a - 3a) + (-2b + 7b)
= 2a + 5b

2. Perkalian Aljabar (Sifat Distributif):
Kalikan pengali di luar kurung ke setiap suku di dalam tanda kurung!
Contoh:
2(x + 3) = 2(x) + 2(3) = 2x + 6

Perkalian dua suku dua (FOIL: First, Outer, Inner, Last):
(x + 2)(x + 4) = x(x) + x(4) + 2(x) + 2(4)
= x² + 4x + 2x + 8
= x² + 6x + 8`,
    commonMisconceptions: `⚠️ KESALAHAN UMUM YANG SERING DILAKUKAN SISWA:
1. Menjumlahkan suku yang tidak sejenis:
SALAH: 3x + 5 = 8x ❌ (Fatal! Suku bervariabel tidak boleh dijumlahkan dengan konstanta).
BENAR: 3x + 5 tetap 3x + 5 ✅.

2. Lupa mendistribusikan tanda negatif pada pengurangan kurung:
SALAH: -(2x - 7) = -2x - 7 ❌
BENAR: -(2x - 7) = -2x + 7 ✅ (Minus bertemu minus menjadi plus).

3. Mengalikan koefisien tanpa mengalikan variabel:
SALAH: 2x × 3x = 6x ❌
BENAR: 2x × 3x = 6x² ✅ (x dikali x menjadi x²).`,
    summary: 'Bentuk aljabar terdiri atas koefisien, variabel, dan konstanta. Operasi tambah dan kurang hanya berlaku untuk suku-suku sejenis. Pada perkalian aljabar, terapkan sifat distributif dan aturan pangkat aljabar.'
  },

  'topic-fungsi-kuadrat': {
    id: 'mat-fk',
    topicId: 'topic-fungsi-kuadrat',
    title: 'Fungsi Kuadrat, Parabola, & Titik Balik Ekstrem',
    learningObjectives: [
      '1. Menentukan karakteristik bentuk kurva parabola berdasarkan tanda koefisien a dan nilai diskriminan D.',
      '2. Menghitung persamaan sumbu simetri vertikal secara eksak.',
      '3. Menghitung koordinat titik puncak (maksimum/minimum) f(x_p) atau rumus puncak.',
      '4. Menyelesaikan permasalahan kontekstual proyektil dan optimasi keuntungan maksimum.'
    ],
    apperception: 'Saat pemain basket melempar bola ke dalam ring, lintasan bola di udara membentuk kurva melengkung mulus yang simetris. Kurva alamiah ini disebut PARABOLA. Dalam matematika, setiap bentuk lengkungan parabola dimodelkan secara sempurna oleh Fungsi Kuadrat.',
    basicConcepts: `Bentuk Umum Fungsi Kuadrat:
f(x) = ax² + bx + c dengan syarat a ≠ 0.

Karakteristik Kurva Parabola:
1. Nilai a (Kelengkungan & Titik Balik):
- Jika a > 0 (positif), kurva TERBUKA KE ATAS dan memiliki TITIK BALIK MINIMUM.
- Jika a < 0 (negatif), kurva TERBUKA KE BAWAH dan memiliki TITIK BALIK MAKSIMUM.

2. Sumbu Simetri:
Garis tegak vertikal yang membelah kurva parabola menjadi dua bagian simetris:
x_s = -b / (2a)

3. Diskriminan D = b² - 4ac:
- D > 0: kurva memotong sumbu X di 2 titik berbeda.
- D = 0: kurva menyinggung sumbu X di 1 titik.
- D < 0: kurva tidak memotong sumbu X sama sekali.`,
    detailedExplanation: `Titik Puncak (Titik Ekstrem) Parabola P(x_p, y_p):
Koordinat titik balik puncak dirumuskan dengan:
x_p = -b / (2a)
y_p = -D / (4a) = -(b² - 4ac) / (4a)
Atau y_p dapat dihitung langsung dengan mensubstitusi nilai x_p ke f(x): y_p = f(x_p).

Penerapan Nyata: Ketinggian Maksimum Proyektil:
Tinggi peluru h(t) = v₀t - 1/2 gt² adalah fungsi kuadrat dengan koefisien kuadrat negatif (a < 0), sehingga ketinggian maksimum dicapai tepat pada waktu puncak t_puncak = -b / (2a).`,
    commonMisconceptions: `⚠️ KESALAHAN UMUM SISWA:
1. Lupa tanda minus pada rumus sumbu simetri:
SALAH: x = b / (2a) ❌
BENAR: x = -b / (2a) ✅

2. Keliru menentukan jenis ekstrem:
Ketika a = -2 (negatif), siswa sering mengira nilainya minimum karena angkanya minus. Padahal karena kurva membuka ke bawah seperti payung, titik puncaknya adalah MAKSIMUM!`,
    summary: 'Fungsi kuadrat f(x) = ax² + bx + c menghasilkan kurva parabola simetris. Sumbu simetri berada pada x = -b/(2a), dan nilai ekstrem y_p = -D/(4a) menentukan ketinggian maksimum atau biaya minimum.'
  },

  'topic-pemfaktoran': {
    id: 'mat-pf',
    topicId: 'topic-pemfaktoran',
    title: 'Pemfaktoran Aljabar & Bentuk Kuadrat',
    learningObjectives: [
      '1. Menemukan Faktor Persekutuan Terbesar (FPB) dari suku-suku aljabar.',
      '2. Memfaktorkan bentuk selisih dua kuadrat a² - b² = (a + b)(a - b).',
      '3. Memfaktorkan bentuk kuadratik x² + bx + c menjadi (x + p)(x + q).'
    ],
    apperception: 'Pemfaktoran adalah proses memecah suatu ekspresi aljabar menjadi perkalian faktor-faktor pembentuknya, persis seperti menyatakan angka 12 sebagai 3 × 4. Pemfaktoran merupakan fondasi mutlak untuk menyelesaikan persamaan kuadrat dan menyederhanakan pecahan aljabar.',
    basicConcepts: `Tiga Pola Utama Pemfaktoran:
1. Memfaktorkan Faktor Persekutuan (Distributif Terbalik):
ab + ac = a(b + c)
Contoh: 6x² + 9x = 3x(2x + 3)

2. Selisih Dua Kuadrat:
a² - b² = (a + b)(a - b)
Contoh: x² - 16 = (x + 4)(x - 4)

3. Pemfaktoran x² + bx + c:
Cari dua bilangan p dan q sedemikian sehingga:
p + q = b (jumlah suku tengah)
p × q = c (hasil kali konstanta)
Maka: x² + bx + c = (x + p)(x + q)`,
    detailedExplanation: `Langkah demi Langkah Pemfaktoran Trinomial:
Misalkan memfaktorkan x² + 7x + 12:
1. Nilai b = 7 dan c = 12.
2. Cari dua bilangan yang jika dikali = 12 dan jika ditambah = 7.
Pasangan faktor dari 12:
- 1 dan 12 (1 + 12 = 13, bukan 7)
- 2 dan 6 (2 + 6 = 8, bukan 7)
- 3 dan 4 (3 + 4 = 7, TEPAT!)
3. Maka bentuk faktornya adalah: (x + 3)(x + 4).`,
    commonMisconceptions: `⚠️ KESALAHAN UMUM SISWA:
1. Menganggap x² + 16 bisa difaktorkan dengan selisih kuadrat:
SALAH: x² + 16 = (x + 4)(x - 4) ❌
Ingat: Rumus hanya berlaku untuk SELISIH (tanda minus), BUKAN jumlah kuadrat!

2. Kesalahan tanda pada bilangan bulat negatif:
Untuk x² - 5x + 6, dua bilangan yang memenuhi adalah -2 dan -3 (karena -2 × -3 = +6 dan -2 + -3 = -5). Siswa sering salah menggunakan +2 dan +3.`,
    summary: 'Pemfaktoran mengubah bentuk penjumlahan suku menjadi perkalian faktor. Kuasai bentuk FPB aljabar, selisih kuadrat, dan metode mencari pasangan bilangan jumlah-kali.'
  }
};

export const INITIAL_EXAMPLES: Record<string, ExampleItem[]> = {
  'topic-bentuk-aljabar': [
    {
      id: 'ex-ba-1',
      topicId: 'topic-bentuk-aljabar',
      title: 'Menyederhanakan Penjumlahan Suku Sejenis',
      problemStatement: 'Sederhanakan bentuk aljabar berikut:\n3x + 5x',
      difficulty: 'LOTS',
      keyTakeaway: 'Karena kedua suku memiliki variabel yang sama (x), cukup jumlahkan koefisiennya: 3 + 5 = 8.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Identifikasi Suku Sejenis',
          description: 'Suku 3x dan 5x sama-sama memiliki variabel x berpangkat 1, sehingga keduanya sejenis.'
        },
        {
          stepNumber: 2,
          title: 'Jumlahkan Koefisien',
          description: 'Gunakan sifat distributif: (3 + 5)x = 8x.',
          mathExpression: '3x + 5x = 8x'
        }
      ]
    },
    {
      id: 'ex-ba-2',
      topicId: 'topic-bentuk-aljabar',
      title: 'Penjumlahan Bentuk Aljabar Suku Banyak',
      problemStatement: 'Tentukan hasil penjumlahan dari:\n(2x + 3) + (4x - 1)',
      difficulty: 'MOTS',
      keyTakeaway: 'Kelompokkan suku bervariabel dengan suku bervariabel, dan konstanta dengan konstanta.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Buka tanda kurung dan kelompokkan suku sejenis',
          description: 'Kelompokkan suku bervariabel x: 2x + 4x, dan konstanta: +3 - 1.',
          mathExpression: '(2x + 4x) + (3 - 1)'
        },
        {
          stepNumber: 2,
          title: 'Hitung hasil penjumlahan masing-masing kelompok',
          description: '2x + 4x = 6x, dan 3 - 1 = 2.',
          mathExpression: '= 6x + 2'
        }
      ]
    },
    {
      id: 'ex-ba-3',
      topicId: 'topic-bentuk-aljabar',
      title: 'Perkalian Suku Tunggal dengan Sifat Distributif',
      problemStatement: 'Kalikan dan sederhanakan bentuk aljabar berikut:\n2(x + 3)',
      difficulty: 'MOTS',
      keyTakeaway: 'Kalikan bilangan pengali di luar ke setiap suku di dalam kurung: a(b + c) = ab + ac.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Terapkan sifat distributif',
          description: 'Kalikan 2 dengan x, lalu kalikan 2 dengan 3.',
          mathExpression: '2 \\times x + 2 \\times 3'
        },
        {
          stepNumber: 2,
          title: 'Selesaikan perkalian',
          description: 'Hasil akhirnya adalah 2x + 6.',
          mathExpression: '= 2x + 6'
        }
      ]
    },
    {
      id: 'ex-ba-4',
      topicId: 'topic-bentuk-aljabar',
      title: 'Perkalian Dua Bentuk Binomial',
      problemStatement: 'Tentukan hasil perkalian aljabar dari:\n(x + 2)(x + 4)',
      difficulty: 'HOTS',
      keyTakeaway: 'Gunakan metode FOIL (depan, luar, dalam, belakang) kemudian sederhanakan suku tengah yang sejenis.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Kalikan setiap suku',
          description: 'x × x = x²; x × 4 = 4x; 2 × x = 2x; 2 × 4 = 8.',
          mathExpression: 'x^2 + 4x + 2x + 8'
        },
        {
          stepNumber: 2,
          title: 'Gabungkan suku tengah yang sejenis',
          description: '4x + 2x = 6x.',
          mathExpression: '= x^2 + 6x + 8'
        }
      ]
    }
  ],

  'topic-fungsi-kuadrat': [
    {
      id: 'ex-fk-1',
      topicId: 'topic-fungsi-kuadrat',
      title: 'Menentukan Sumbu Simetri dan Titik Puncak Parabola',
      problemStatement: 'Diberikan fungsi kuadrat f(x) = x² - 6x + 8. Tentukan:\na. Persamaan sumbu simetri\nb. Nilai ekstrem dan jenisnya\nc. Koordinat titik puncak parabola',
      difficulty: 'MOTS',
      keyTakeaway: 'Sumbu simetri selalu membagi parabola vertikal tepat pada x = -b/(2a). Nilai y puncak diperoleh dengan mensubstitusi x_p ke rumus fungsi.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Identifikasi koefisien a, b, dan c',
          description: 'Dari f(x) = x² - 6x + 8, diperoleh a = 1, b = -6, dan c = 8. Karena a = 1 > 0, kurva membuka ke atas dan memiliki nilai minimum.',
          mathExpression: 'a = 1, \\quad b = -6, \\quad c = 8'
        },
        {
          stepNumber: 2,
          title: 'Hitung persamaan sumbu simetri',
          description: 'Gunakan rumus x = -b / (2a):',
          mathExpression: 'x_s = -\\frac{-6}{2(1)} = \\frac{6}{2} = 3'
        },
        {
          stepNumber: 3,
          title: 'Hitung nilai ekstrem minimum (y_puncak)',
          description: 'Substitusikan x = 3 ke dalam fungsi f(x):',
          mathExpression: 'f(3) = (3)^2 - 6(3) + 8 = 9 - 18 + 8 = -1'
        },
        {
          stepNumber: 4,
          title: 'Tuliskan koordinat titik puncak',
          description: 'Titik puncak parabola adalah P(3, -1) dengan nilai minimum y = -1.',
          mathExpression: 'P(x_p, y_p) = (3, -1)'
        }
      ]
    }
  ],

  'topic-pemfaktoran': [
    {
      id: 'ex-pf-1',
      topicId: 'topic-pemfaktoran',
      title: 'Memfaktorkan Bentuk Trinomial Kuadrat',
      problemStatement: 'Tentukan akar-akar himpunan penyelesaian dari pemfaktoran x² - 5x + 6 = 0.',
      difficulty: 'LOTS',
      keyTakeaway: 'Cari dua bilangan yang jika dikalikan bernilai +6 dan jika dijumlahkan bernilai -5. Bilangan tersebut adalah -2 dan -3.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Mencari pasangan bilangan p dan q',
          description: 'p × q = 6 dan p + q = -5. Pasangannya adalah -2 dan -3.',
          mathExpression: '(-2) \\times (-3) = 6 \\quad \\text{dan} \\quad (-2) + (-3) = -5'
        },
        {
          stepNumber: 2,
          title: 'Menuliskan bentuk faktor',
          description: '(x - 2)(x - 3) = 0.',
          mathExpression: '(x - 2)(x - 3) = 0'
        },
        {
          stepNumber: 3,
          title: 'Menentukan akar-akar persamaan',
          description: 'x - 2 = 0 atau x - 3 = 0, sehingga x₁ = 2 atau x₂ = 3.',
          mathExpression: 'x_1 = 2 \\quad \\text{atau} \\quad x_2 = 3'
        }
      ]
    }
  ]
};

// --- TOPIC ASSESSMENT QUESTIONS (Minimal 10 soal per sample topic) ---
export const INITIAL_QUESTIONS: Question[] = [
  // 1. Diagnostic Questions 1 - 30
  ...DIAGNOSTIC_QUESTIONS_30,

  // 2. Sample Topic 1: Bentuk Aljabar (10 Questions: LOTS, MOTS, HOTS)
  {
    id: 'ba-q1',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Koefisien dari variabel y pada bentuk aljabar 7x² - 5y + 12 adalah...',
    mathExpression: '7x^2 - 5y + 12',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '-5' },
      { id: 'B', text: '5' },
      { id: 'C', text: '7' },
      { id: 'D', text: '12' }
    ],
    correctAnswer: 'A',
    explanation: 'Koefisien di depan y adalah -5 (tanda minus merupakan bagian dari koefisien).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Unsur Bentuk Aljabar'
  },
  {
    id: 'ba-q2',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Pasangan suku yang merupakan suku sejenis adalah...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4a²b dan -3a²b' },
      { id: 'B', text: '5x dan 5y' },
      { id: 'C', text: '2p² dan 2p³' },
      { id: 'D', text: '3ab dan 3bc' }
    ],
    correctAnswer: 'A',
    explanation: 'Suku sejenis harus memiliki variabel dan pangkat variabel yang sama persis. Pada pilihan A, keduanya memiliki a²b.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Suku Sejenis'
  },
  {
    id: 'ba-q3',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Hasil dari 3x + 5x adalah...',
    mathExpression: '3x + 5x = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '8x' },
      { id: 'B', text: '8' },
      { id: 'C', text: '15x' },
      { id: 'D', text: '8x²' }
    ],
    correctAnswer: 'A',
    explanation: 'Kedua suku sejenis bervariabel x, jumlahkan koefisiennya: (3 + 5)x = 8x.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Operasi Penjumlahan Aljabar'
  },
  {
    id: 'ba-q4',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Hasil penyederhanaan dari (2x + 3) + (4x - 1) adalah...',
    mathExpression: '(2x + 3) + (4x - 1) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '6x + 2' },
      { id: 'B', text: '6x + 4' },
      { id: 'C', text: '8x - 3' },
      { id: 'D', text: '6x - 2' }
    ],
    correctAnswer: 'A',
    explanation: 'Gabungkan suku sejenis: (2x + 4x) + (3 - 1) = 6x + 2.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Operasi Aljabar Suku Banyak'
  },
  {
    id: 'ba-q5',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Hasil perkalian distributif 2(x + 3) adalah...',
    mathExpression: '2(x + 3) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '2x + 6' },
      { id: 'B', text: '2x + 3' },
      { id: 'C', text: 'x + 6' },
      { id: 'D', text: '5x' }
    ],
    correctAnswer: 'A',
    explanation: 'Kalikan 2 dengan x dan 2 dengan 3: 2(x) + 2(3) = 2x + 6.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Sifat Distributif'
  },
  {
    id: 'ba-q6',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Bentuk sederhana dari (8p - 5q) - (3p - 2q) adalah...',
    mathExpression: '(8p - 5q) - (3p - 2q) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '5p - 3q' },
      { id: 'B', text: '5p - 7q' },
      { id: 'C', text: '11p - 7q' },
      { id: 'D', text: '5p + 3q' }
    ],
    correctAnswer: 'A',
    explanation: 'Distribusikan tanda minus: 8p - 5q - 3p + 2q = (8p - 3p) + (-5q + 2q) = 5p - 3q.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Pengurangan Aljabar'
  },
  {
    id: 'ba-q7',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Hasil dari perkalian binomial (x + 2)(x + 4) adalah...',
    mathExpression: '(x + 2)(x + 4) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x² + 6x + 8' },
      { id: 'B', text: 'x² + 8x + 6' },
      { id: 'C', text: 'x² + 8' },
      { id: 'D', text: '2x + 6' }
    ],
    correctAnswer: 'A',
    explanation: 'x² + 4x + 2x + 8 = x² + 6x + 8.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Perkalian Binomial'
  },
  {
    id: 'ba-q8',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Sebuah persegi panjang memiliki panjang (3x + 2) cm dan lebar (x + 1) cm. Keliling persegi panjang tersebut dalam x adalah...',
    mathExpression: 'K = 2(p + l)',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '8x + 6 cm' },
      { id: 'B', text: '4x + 3 cm' },
      { id: 'C', text: '3x² + 5x + 2 cm' },
      { id: 'D', text: '6x + 4 cm' }
    ],
    correctAnswer: 'A',
    explanation: 'Keliling = 2[(3x + 2) + (x + 1)] = 2[4x + 3] = 8x + 6 cm.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Aplikasi Geometri Aljabar'
  },
  {
    id: 'ba-q9',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Jika nilai x = 4 dan y = -2, maka nilai dari bentuk aljabar 3x² - 2y + 5 adalah...',
    mathExpression: '3(4)^2 - 2(-2) + 5 = ?',
    questionType: 'numerical',
    options: [
      { id: 'A', text: '57' },
      { id: 'B', text: '49' },
      { id: 'C', text: '41' },
      { id: 'D', text: '53' }
    ],
    correctAnswer: 'A',
    explanation: '3(16) - 2(-2) + 5 = 48 + 4 + 5 = 57.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Substitusi Nilai Aljabar'
  },
  {
    id: 'ba-q10',
    topicId: 'topic-bentuk-aljabar',
    questionText: 'Hasil pemangkatan bentuk aljabar (2x - 3)² adalah...',
    mathExpression: '(2x - 3)^2 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4x² - 12x + 9' },
      { id: 'B', text: '4x² - 9' },
      { id: 'C', text: '4x² + 9' },
      { id: 'D', text: '4x² - 6x + 9' }
    ],
    correctAnswer: 'A',
    explanation: '(a - b)² = a² - 2ab + b². Maka (2x)² - 2(2x)(3) + (3)² = 4x² - 12x + 9.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Kuadrat Binomial'
  },

  // 3. Sample Topic 2: Fungsi Kuadrat (10 Questions)
  {
    id: 'fk-q1',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Grafik fungsi kuadrat f(x) = -2x² + 8x - 5 memiliki bentuk kurva parabola yang...',
    mathExpression: 'f(x) = -2x^2 + 8x - 5',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Terbuka ke bawah dan memiliki nilai balik maksimum' },
      { id: 'B', text: 'Terbuka ke atas dan memiliki nilai balik minimum' },
      { id: 'C', text: 'Terbuka ke atas dan memiliki nilai balik maksimum' },
      { id: 'D', text: 'Membuka ke kanan mendatar' }
    ],
    correctAnswer: 'A',
    explanation: 'Karena koefisien a = -2 < 0, kurva parabola terbuka ke bawah dan memiliki titik puncak tertinggi (maksimum).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Karakteristik Kurva Parabola'
  },
  {
    id: 'fk-q2',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Persamaan sumbu simetri dari grafik fungsi kuadrat f(x) = 3x² - 12x + 7 adalah...',
    mathExpression: 'x_s = -\\frac{b}{2a}',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x = 2' },
      { id: 'B', text: 'x = -2' },
      { id: 'C', text: 'x = 4' },
      { id: 'D', text: 'x = -4' }
    ],
    correctAnswer: 'A',
    explanation: 'x = -b / (2a) = -(-12) / (2 × 3) = 12 / 6 = 2.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Sumbu Simetri'
  },
  {
    id: 'fk-q3',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Nilai diskriminan dari fungsi kuadrat g(x) = x² - 6x + 9 adalah...',
    mathExpression: 'D = b^2 - 4ac',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '0 (menyinggung sumbu X di 1 titik)' },
      { id: 'B', text: '72 (memotong sumbu X di 2 titik)' },
      { id: 'C', text: '-36 (tidak memotong sumbu X)' },
      { id: 'D', text: '9' }
    ],
    correctAnswer: 'A',
    explanation: 'D = b² - 4ac = (-6)² - 4(1)(9) = 36 - 36 = 0. Menyinggung sumbu X di tepat 1 titik.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Diskriminan Parabola'
  },
  {
    id: 'fk-q4',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Titik puncak dari grafik fungsi kuadrat f(x) = x² - 4x + 1 adalah...',
    mathExpression: 'P(x_p, y_p) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(2, -3)' },
      { id: 'B', text: '(-2, 13)' },
      { id: 'C', text: '(4, 1)' },
      { id: 'D', text: '(2, 3)' }
    ],
    correctAnswer: 'A',
    explanation: 'x_p = -(-4) / 2(1) = 2. f(2) = (2)² - 4(2) + 1 = 4 - 8 + 1 = -3. P(2, -3).',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Titik Puncak'
  },
  {
    id: 'fk-q5',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Tinggi h (meter) roket setelah t detik dimodelkan dengan h(t) = 40t - 5t². Tinggi maksimum yang dicapai roket adalah...',
    mathExpression: 'h_{\\text{maks}} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '80 meter' },
      { id: 'B', text: '60 meter' },
      { id: 'C', text: '100 meter' },
      { id: 'D', text: '40 meter' }
    ],
    correctAnswer: 'A',
    explanation: 't_puncak = -40 / (2 × -5) = 4 detik. h(4) = 40(4) - 5(16) = 160 - 80 = 80 meter.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Nilai Ekstrem Kontekstual'
  },
  {
    id: 'fk-q6',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Grafik f(x) = x² - 5x + 6 memotong sumbu Y pada koordinat...',
    mathExpression: 'x = 0 \\implies f(0) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(0, 6)' },
      { id: 'B', text: '(6, 0)' },
      { id: 'C', text: '(0, -5)' },
      { id: 'D', text: '(0, 1)' }
    ],
    correctAnswer: 'A',
    explanation: 'Titik potong sumbu Y terjadi ketika x = 0: f(0) = (0)² - 5(0) + 6 = 6. Jadi titik potongnya adalah (0, 6).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Titik Potong Sumbu'
  },
  {
    id: 'fk-q7',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Sebuah fungsi kuadrat memotong sumbu X di titik (1, 0) dan (5, 0) serta melalui titik (0, 10). Rumus fungsinya adalah...',
    mathExpression: 'f(x) = a(x - x_1)(x - x_2)',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'f(x) = 2x² - 12x + 10' },
      { id: 'B', text: 'f(x) = x² - 6x + 5' },
      { id: 'C', text: 'f(x) = 2x² + 12x - 10' },
      { id: 'D', text: 'f(x) = -2x² + 12x + 10' }
    ],
    correctAnswer: 'A',
    explanation: 'f(x) = a(x - 1)(x - 5). Masukkan (0, 10): 10 = a(-1)(-5) → 5a = 10 → a = 2. f(x) = 2(x² - 6x + 5) = 2x² - 12x + 10.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Menyusun Fungsi Kuadrat'
  },
  {
    id: 'fk-q8',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Jika f(x) = x² + 2kx + (k + 6) menyinggung sumbu X, maka nilai k positif adalah...',
    mathExpression: 'D = 0 \\implies b^2 - 4ac = 0',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '2' },
      { id: 'C', text: '4' },
      { id: 'D', text: '6' }
    ],
    correctAnswer: 'A',
    explanation: 'D = (2k)² - 4(1)(k + 6) = 4k² - 4k - 24 = 0 → k² - k - 6 = 0 → (k - 3)(k + 2) = 0. Nilai k positif adalah 3.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Analisis Parameter Diskriminan'
  },
  {
    id: 'fk-q9',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Berapakah nilai minimum fungsi kuadrat f(x) = 2x² - 8x + 11?',
    mathExpression: 'y_p = f(x_p) = ?',
    questionType: 'numerical',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '2' },
      { id: 'C', text: '5' },
      { id: 'D', text: '-3' }
    ],
    correctAnswer: 'A',
    explanation: 'x_p = -(-8) / (2 × 2) = 2. f(2) = 2(2)² - 8(2) + 11 = 8 - 16 + 11 = 3.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Nilai Minimum Parabola'
  },
  {
    id: 'fk-q10',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Manakah dari pernyataan berikut yang BENAR tentang grafik f(x) = x² + 4?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Kurva berada seluruhnya di atas sumbu X (definit positif)' },
      { id: 'B', text: 'Kurva memotong sumbu X di dua titik' },
      { id: 'C', text: 'Kurva memiliki nilai maksimum di y = 4' },
      { id: 'D', text: 'Kurva terbuka ke bawah' }
    ],
    correctAnswer: 'A',
    explanation: 'Karena a = 1 > 0 dan D = 0² - 4(1)(4) = -16 < 0, grafik berada seluruhnya di atas sumbu X (definit positif).',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Definit Positif'
  },

  // 4. Sample Topic 3: Pemfaktoran Aljabar (Prasyarat/Remedial - 10 Questions)
  {
    id: 'pf-q1',
    topicId: 'topic-pemfaktoran',
    questionText: 'Bentuk faktor persekutuan terbesar dari 8x³y - 12x²y² adalah...',
    mathExpression: '8x^3y - 12x^2y^2 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4x²y(2x - 3y)' },
      { id: 'B', text: '2xy(4x² - 6xy)' },
      { id: 'C', text: '4xy(2x² - 3y)' },
      { id: 'D', text: '4x³y(2 - 3y)' }
    ],
    correctAnswer: 'A',
    explanation: 'FPB angka 8 dan 12 adalah 4; variabel bersekutu pangkat terkecil adalah x² dan y. Maka faktornya 4x²y(2x - 3y).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'FPB Aljabar'
  },
  {
    id: 'pf-q2',
    topicId: 'topic-pemfaktoran',
    questionText: 'Faktorisasi lengkap dari selisih kuadrat 9x² - 49 adalah...',
    mathExpression: '9x^2 - 49 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(3x + 7)(3x - 7)' },
      { id: 'B', text: '(9x + 7)(x - 7)' },
      { id: 'C', text: '(3x - 7)²' },
      { id: 'D', text: '(3x + 49)(3x - 1)' }
    ],
    correctAnswer: 'A',
    explanation: '(3x)² - (7)² = (3x + 7)(3x - 7). Bentuk selisih dua kuadrat.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Selisih Dua Kuadrat'
  },
  {
    id: 'pf-q3',
    topicId: 'topic-pemfaktoran',
    questionText: 'Hasil pemfaktoran dari bentuk trinomial x² + 2x - 24 adalah...',
    mathExpression: 'x^2 + 2x - 24 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(x + 6)(x - 4)' },
      { id: 'B', text: '(x - 6)(x + 4)' },
      { id: 'C', text: '(x + 8)(x - 3)' },
      { id: 'D', text: '(x - 12)(x + 2)' }
    ],
    correctAnswer: 'A',
    explanation: 'Dua bilangan dengan jumlah p + q = 2 dan hasil kali p × q = -24 adalah +6 dan -4. Jadi (x + 6)(x - 4).',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Pemfaktoran Trinomial'
  },
  {
    id: 'pf-q4',
    topicId: 'topic-pemfaktoran',
    questionText: 'Faktorkanlah bentuk kuadrat 3x² + 10x + 8:',
    mathExpression: '3x^2 + 10x + 8 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(3x + 4)(x + 2)' },
      { id: 'B', text: '(3x + 2)(x + 4)' },
      { id: 'C', text: '(3x + 8)(x + 1)' },
      { id: 'D', text: '(x + 2)(x + 4)' }
    ],
    correctAnswer: 'A',
    explanation: 'a × c = 3 × 8 = 24. Dua bilangan yang dikali = 24 dan ditambah = 10 adalah 4 dan 6. Pecah 10x: 3x² + 6x + 4x + 8 = 3x(x + 2) + 4(x + 2) = (3x + 4)(x + 2).',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Faktorisasi ax² + bx + c'
  },
  {
    id: 'pf-q5',
    topicId: 'topic-pemfaktoran',
    questionText: 'Pemfaktoran dari x² - 10x + 25 adalah...',
    mathExpression: 'x^2 - 10x + 25 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(x - 5)²' },
      { id: 'B', text: '(x + 5)²' },
      { id: 'C', text: '(x - 25)(x - 1)' },
      { id: 'D', text: '(x - 5)(x + 5)' }
    ],
    correctAnswer: 'A',
    explanation: 'Bentuk kuadrat sempurna a² - 2ab + b² = (a - b)². Di sini a = x dan b = 5, sehingga (x - 5)²',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Kuadrat Sempurna'
  },
  {
    id: 'pf-q6',
    topicId: 'topic-pemfaktoran',
    questionText: 'Faktor persekutuan dari 15ab² dan 25a²b adalah...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '5ab' },
      { id: 'B', text: '5a²b²' },
      { id: 'C', text: '15ab' },
      { id: 'D', text: '25ab' }
    ],
    correctAnswer: 'A',
    explanation: 'FPB 15 dan 25 adalah 5; faktor persekutuan variabel adalah a dan b. Jadi 5ab.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'FPB Suku Aljabar'
  },
  {
    id: 'pf-q7',
    topicId: 'topic-pemfaktoran',
    questionText: 'Hasil pemfaktoran dari 2x² - 8 adalah...',
    mathExpression: '2x^2 - 8 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '2(x + 2)(x - 2)' },
      { id: 'B', text: '(2x + 4)(x - 2)' },
      { id: 'C', text: '2(x² - 4)' },
      { id: 'D', text: '(2x - 2)(x + 4)' }
    ],
    correctAnswer: 'A',
    explanation: 'Keluarkan faktor 2 terlebih dahulu: 2(x² - 4). Lalu faktorkan selisih kuadrat: 2(x + 2)(x - 2).',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Faktorisasi Bertahap'
  },
  {
    id: 'pf-q8',
    topicId: 'topic-pemfaktoran',
    questionText: 'Akar-akar penyelesaian dari persamaan (2x - 5)(x + 3) = 0 adalah...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x = 5/2 atau x = -3' },
      { id: 'B', text: 'x = -5/2 atau x = 3' },
      { id: 'C', text: 'x = 5 atau x = -3' },
      { id: 'D', text: 'x = 2/5 atau x = 3' }
    ],
    correctAnswer: 'A',
    explanation: '2x - 5 = 0 → x = 5/2. Atau x + 3 = 0 → x = -3.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Akar Faktor'
  },
  {
    id: 'pf-q9',
    topicId: 'topic-pemfaktoran',
    questionText: 'Bentuk sederhana dari pecahan aljabar (x² - 9) / (x + 3) untuk x ≠ -3 adalah...',
    mathExpression: '\\frac{x^2 - 9}{x + 3} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x - 3' },
      { id: 'B', text: 'x + 3' },
      { id: 'C', text: 'x - 9' },
      { id: 'D', text: '1' }
    ],
    correctAnswer: 'A',
    explanation: '(x + 3)(x - 3) / (x + 3) = x - 3.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Penyederhanaan Pecahan Aljabar'
  },
  {
    id: 'pf-q10',
    topicId: 'topic-pemfaktoran',
    questionText: 'Jika x² + bx + 16 merupakan bentuk kuadrat sempurna dengan b > 0, maka nilai b adalah...',
    questionType: 'numerical',
    options: [
      { id: 'A', text: '8' },
      { id: 'B', text: '4' },
      { id: 'C', text: '16' },
      { id: 'D', text: '32' }
    ],
    correctAnswer: 'A',
    explanation: '(x + 4)² = x² + 8x + 16, maka nilai b = 8.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Bentuk Kuadrat Sempurna'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'as-diagnostic',
    title: 'Asesmen Diagnostik Awal Matematika (30 Soal Adaptif Fase A - F)',
    type: 'DIAGNOSTIC',
    durationMinutes: 30,
    passingScore: 75,
    totalQuestions: 30
  },
  {
    id: 'as-bentuk-aljabar',
    topicId: 'topic-bentuk-aljabar',
    title: 'Asesmen Kompetensi: Bentuk Aljabar & Operasi Suku',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fungsi-kuadrat',
    topicId: 'topic-fungsi-kuadrat',
    title: 'Asesmen Kompetensi: Fungsi Kuadrat & Titik Balik Ekstrem',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-pemfaktoran-prereq',
    topicId: 'topic-pemfaktoran',
    title: 'Asesmen Prasyarat & Remedial: Pemfaktoran Aljabar',
    type: 'PREREQUISITE',
    durationMinutes: 20,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-bilangan',
    topicId: 'topic-fase-d-bilangan',
    title: 'Asesmen Kompetensi: Bilangan Bulat & Rasional',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-rasio',
    topicId: 'topic-fase-d-rasio',
    title: 'Asesmen Kompetensi: Rasio dan Proporsi',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-plsv',
    topicId: 'topic-plsv',
    title: 'Asesmen Kompetensi: Persamaan Linear Satu Variabel (PLSV)',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-spldv',
    topicId: 'topic-fase-d-spldv',
    title: 'Asesmen Kompetensi: Sistem Persamaan Linear Dua Variabel (SPLDV)',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-fungsi',
    topicId: 'topic-fase-d-fungsi',
    title: 'Asesmen Kompetensi: Relasi dan Fungsi Linear',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-pythagoras',
    topicId: 'topic-pythagoras',
    title: 'Asesmen Kompetensi: Teorema Pythagoras & Geometri',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-statistika',
    topicId: 'topic-fase-d-statistika',
    title: 'Asesmen Kompetensi: Statistika & Ukuran Pemusatan Data',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  },
  {
    id: 'as-fase-d-peluang',
    topicId: 'topic-fase-d-peluang',
    title: 'Asesmen Kompetensi: Peluang Kejadian Tunggal & Majemuk',
    type: 'TOPIC',
    durationMinutes: 25,
    passingScore: 75,
    totalQuestions: 10
  }
];

import { CurriculumSource, CurriculumUnit, Competency } from '../src/types';

export const INITIAL_CURRICULUM_SOURCES: CurriculumSource[] = [
  {
    id: 'src-resmi-fase-d',
    name: 'Dokumen Standar Kurikulum Merdeka Matematika SMP (Fase D)',
    phaseCode: 'FASE_D',
    subject: 'Matematika',
    isOfficial: true,
    sourceType: 'DOCUMENT_TEXT',
    rawContent: 'Capaian Pembelajaran (CP) Matematika Fase D: Peserta didik dapat mengoperasikan secara efisien bilangan bulat dan pecahan, menerapkan konsep rasio dan proporsi, menyelesaikan bentuk aljabar, persamaan linear satu variabel, SPLDV, relasi fungsi, memahami teorema Pythagoras, ukuran pemusatan statistika, dan peluang kejadian.',
    cpText: 'Pada akhir Fase D, peserta didik dapat menyelesaikan masalah kontekstual menggunakan konsep bilangan, aljabar, geometri, analisis data dan peluang.',
    tpText: '1. Memahami operasi bilangan bulat & rasional.\n2. Menggunakan konsep rasio senilai dan berbalik nilai.\n3. Memanipulasi bentuk aljabar & menyelesaikan PLSV/SPLDV.\n4. Menganalisis fungsi linear dan garis lurus.\n5. Mengaplikasikan Teorema Pythagoras.\n6. Menghitung mean, median, modus dan peluang kejadian.',
    atpText: 'Bilangan Bulat & Rasional → Rasio dan Proporsi → Bentuk Aljabar → PLSV → SPLDV → Relasi & Fungsi → Geometri & Pythagoras → Statistika → Peluang',
    createdAt: new Date().toISOString(),
    createdBy: 'Puskur Kemendikbudristek'
  },
  {
    id: 'src-resmi-fase-e',
    name: 'Dokumen Standar Kurikulum Merdeka Matematika SMA (Fase E)',
    phaseCode: 'FASE_E',
    subject: 'Matematika',
    isOfficial: true,
    sourceType: 'DOCUMENT_TEXT',
    rawContent: 'Capaian Pembelajaran (CP) Matematika Fase E: Peserta didik dapat menggeneralisasi sifat eksponen dan logaritma, menyelesaikan sistem persamaan kuadrat, menganalisis kurva fungsi kuadrat, dan perbandingan trigonometri dasar segitiga siku-siku.',
    cpText: 'Peserta didik dapat memodelkan fenomena alamiah dan sosial dengan fungsi kuadrat, eksponensial, dan trigonometri.',
    tpText: '1. Mengoperasikan bilangan berpangkat & logaritma.\n2. Menyelesaikan persamaan dan fungsi kuadrat.\n3. Menentukan rasio trigonometri segitiga siku-siku.',
    atpText: 'Eksponen & Logaritma → Persamaan Kuadrat → Fungsi Kuadrat & Titik Ekstrem → Trigonometri Segitiga Siku-Siku',
    createdAt: new Date().toISOString(),
    createdBy: 'Puskur Kemendikbudristek'
  }
];

export const INITIAL_COMPETENCIES: Competency[] = [
  { id: 'comp-d1', code: 'KD-D-01', element: 'Bilangan', title: 'Operasi Bilangan Bulat & Rasional', description: 'Menghitung operasi aritmatika bulat, urutan operasi, FPB & KPK.', cognitiveLevel: 'LOTS', phaseCode: 'FASE_D', orderIndex: 1 },
  { id: 'comp-d2', code: 'KD-D-02', element: 'Bilangan', title: 'Perbandingan Senilai & Berbalik Nilai', description: 'Membedakan dan menghitung rasio proporsional kontekstual.', cognitiveLevel: 'MOTS', phaseCode: 'FASE_D', orderIndex: 2 },
  { id: 'comp-d3', code: 'KD-D-03', element: 'Aljabar', title: 'Operasi Suku Aljabar', description: 'Menyederhanakan suku sejenis dan perkalian distributif.', cognitiveLevel: 'LOTS', phaseCode: 'FASE_D', orderIndex: 3 },
  { id: 'comp-d4', code: 'KD-D-04', element: 'Aljabar', title: 'Penyelesaian PLSV & SPLDV', description: 'Menemukan nilai variabel pada persamaan dan pemodelan cerita.', cognitiveLevel: 'MOTS', phaseCode: 'FASE_D', orderIndex: 4 },
  { id: 'comp-d5', code: 'KD-D-05', element: 'Aljabar', title: 'Relasi dan Fungsi Linear', description: 'Menentukan gradien, rumus fungsi, dan diagram panah.', cognitiveLevel: 'MOTS', phaseCode: 'FASE_D', orderIndex: 5 },
  { id: 'comp-d6', code: 'KD-D-06', element: 'Geometri', title: 'Teorema Pythagoras & Geometri Ruang', description: 'Menerapkan hubungan a² + b² = c² pada segitiga siku-siku.', cognitiveLevel: 'MOTS', phaseCode: 'FASE_D', orderIndex: 6 },
  { id: 'comp-d7', code: 'KD-D-07', element: 'Analisis Data dan Peluang', title: 'Ukuran Pemusatan Data', description: 'Menghitung mean, median, modus data tunggal.', cognitiveLevel: 'LOTS', phaseCode: 'FASE_D', orderIndex: 7 },
  { id: 'comp-d8', code: 'KD-D-08', element: 'Analisis Data dan Peluang', title: 'Peluang Teoretik Kejadian', description: 'Menentukan titik sampel dan probabilitas P(A) = n(A)/n(S).', cognitiveLevel: 'HOTS', phaseCode: 'FASE_D', orderIndex: 8 }
];

export const INITIAL_CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: 'unit-d-bilangan',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Bilangan',
    cp: 'Peserta didik dapat membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional dan irasional, bilangan desimal, serta menggunakannya dalam pemodelan.',
    tp: 'Memahami bilangan bulat, operasi hitung campuran, FPB, KPK, dan estimasi nilai bilangan rasional.',
    atp: 'Unit ke-1 pada Alur Tujuan Pembelajaran Fase D (Kelas 7 Semester 1).',
    topicTitle: 'Bilangan Bulat & Rasional',
    subtopics: ['Konsep Bilangan Bulat Positif & Negatif', 'Operasi Hitung Campuran', 'FPB dan KPK dalam Kehidupan Nyata'],
    competencies: ['KD-D-01'],
    prerequisites: [{ title: 'Operasi Pecahan Campuran, Desimal & Rasio', topicId: 'topic-operasi-pecahan', reasoning: 'Fondasi aritmatika pecahan dari Fase C' }],
    learningSequence: 1,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-rasio',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Bilangan',
    cp: 'Peserta didik dapat menggunakan konsep rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah sehari-hari.',
    tp: 'Menganalisis perbandingan senilai dan berbalik nilai pada tabel, grafik, dan persamaan konversi.',
    atp: 'Unit ke-2 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Rasio dan Proporsi',
    subtopics: ['Rasio Satuan & Skala Peta', 'Perbandingan Senilai', 'Perbandingan Berbalik Nilai'],
    competencies: ['KD-D-02'],
    prerequisites: [{ title: 'Bilangan Bulat & Rasional', topicId: 'topic-fase-d-bilangan', reasoning: 'Operasi perkalian dan pembagian bilangan rasional' }],
    learningSequence: 2,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-aljabar',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Aljabar',
    cp: 'Peserta didik dapat mengenali, memprediksi dan menggeneralisasi pola, serta menyajikan dan memanipulasi bentuk aljabar.',
    tp: 'Menyederhanakan bentuk aljabar linear dan melakukan perkalian sifat distributif.',
    atp: 'Unit ke-3 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Bentuk Aljabar & Operasi Dasar',
    subtopics: ['Koefisien, Variabel, Konstanta', 'Operasi Penjumlahan & Pengurangan Suku Sejenis', 'Perkalian Sifat Distributif'],
    competencies: ['KD-D-03'],
    prerequisites: [{ title: 'Rasio dan Proporsi', topicId: 'topic-fase-d-rasio', reasoning: 'Pemahaman representasi perbandingan variabel' }],
    learningSequence: 3,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-plsv',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Aljabar',
    cp: 'Peserta didik dapat memahami relasi dan fungsi, serta menyelesaikan persamaan dan pertidaksamaan linear satu variabel.',
    tp: 'Menentukan solusi persamaan linear satu variabel ax + b = c.',
    atp: 'Unit ke-4 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Persamaan Linear Satu Variabel (PLSV)',
    subtopics: ['Konsep Kesetaraan Persamaan', 'Penyelesaian Aljabar PLSV', 'Pemodelan Soal Cerita'],
    competencies: ['KD-D-04'],
    prerequisites: [{ title: 'Bentuk Aljabar & Operasi Dasar', topicId: 'topic-bentuk-aljabar', reasoning: 'Pengelompokan suku dan pemindahan ruas aljabar' }],
    learningSequence: 4,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-spldv',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Aljabar',
    cp: 'Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel melalui beberapa cara untuk penyelesaian masalah.',
    tp: 'Menentukan himpunan penyelesaian SPLDV dengan metode eliminasi dan substitusi.',
    atp: 'Unit ke-5 pada Alur Tujuan Pembelajaran Fase D (Kelas 8).',
    topicTitle: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
    subtopics: ['Metode Substitusi', 'Metode Eliminasi', 'Aplikasi Penentuan Harga Barang'],
    competencies: ['KD-D-04'],
    prerequisites: [{ title: 'Persamaan Linear Satu Variabel (PLSV)', topicId: 'topic-plsv', reasoning: 'Substitusi satu variabel ke variabel lain' }],
    learningSequence: 5,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-fungsi',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Aljabar',
    cp: 'Peserta didik dapat menyajikan, menganalisis, dan menyelesaikan masalah dengan menggunakan relasi, fungsi dan persamaan garis lurus.',
    tp: 'Menganalisis relasi, pemetaan fungsi f(x) = mx + c, domain, kodomain, range, dan kemiringan garis (gradien).',
    atp: 'Unit ke-6 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Relasi dan Fungsi Linear',
    subtopics: ['Diagram Panah & Notasi Fungsi', 'Menghitung Nilai Fungsi', 'Kemiringan Garis Lurus (Gradien m)'],
    competencies: ['KD-D-05'],
    prerequisites: [{ title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)', topicId: 'topic-fase-d-spldv', reasoning: 'Grafik garis dan titik potong dua variabel' }],
    learningSequence: 6,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-geometri',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Geometri',
    cp: 'Peserta didik dapat menggunakan hubungan sudut, membuktikan dan menerapkan teorema Pythagoras.',
    tp: 'Menghitung panjang hipotenusa dan sisi tegak segitiga siku-siku serta membuktikan tripel Pythagoras.',
    atp: 'Unit ke-7 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Teorema Pythagoras & Geometri',
    subtopics: ['Dalil Pythagoras a² + b² = c²', 'Tripel Pythagoras Populer', 'Aplikasi Jarak Dua Titik'],
    competencies: ['KD-D-06'],
    prerequisites: [{ title: 'Bentuk Aljabar & Operasi Dasar', topicId: 'topic-bentuk-aljabar', reasoning: 'Kuadrat dan akar kuadrat aljabar' }],
    learningSequence: 7,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-statistika',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Analisis Data dan Peluang',
    cp: 'Peserta didik dapat merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data untuk menjawab pertanyaan dengan ukuran pemusatan.',
    tp: 'Menghitung mean, median, modus, dan menganalisis dampak nilai pencilan (outlier).',
    atp: 'Unit ke-8 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Statistika Dasar & Ukuran Pemusatan',
    subtopics: ['Mean (Rata-Rata)', 'Median (Nilai Tengah)', 'Modus & Jangkauan'],
    competencies: ['KD-D-07'],
    prerequisites: [{ title: 'Persamaan Linear Satu Variabel (PLSV)', topicId: 'topic-plsv', reasoning: 'Rumus rata-rata melibatkan persamaan linear' }],
    learningSequence: 8,
    isOfficialVerified: true
  },
  {
    id: 'unit-d-peluang',
    sourceId: 'src-resmi-fase-d',
    phaseCode: 'FASE_D',
    element: 'Analisis Data dan Peluang',
    cp: 'Peserta didik dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana.',
    tp: 'Menghitung peluang teoretik kejadian tunggal P(A) = n(A)/n(S).',
    atp: 'Unit ke-9 pada Alur Tujuan Pembelajaran Fase D.',
    topicTitle: 'Peluang Kejadian Tunggal & Majemuk',
    subtopics: ['Ruang Sampel & Titik Sampel', 'Peluang Teoretik', 'Frekuensi Harapan'],
    competencies: ['KD-D-08'],
    prerequisites: [{ title: 'Statistika Dasar & Ukuran Pemusatan', topicId: 'topic-fase-d-statistika', reasoning: 'Frekuensi data dan distribusi proporsi' }],
    learningSequence: 9,
    isOfficialVerified: true
  }
];

