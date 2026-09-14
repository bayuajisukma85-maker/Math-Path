import { Question } from '../src/types';

/**
 * 30 Real Diagnostic Questions spanning 10 Essential Competency Domains
 * 1. Bilangan (3 questions)
 * 2. Operasi Hitung (3 questions)
 * 3. Pecahan (3 questions)
 * 4. Rasio & Perbandingan (3 questions)
 * 5. Bentuk Aljabar (3 questions)
 * 6. Persamaan Linear (3 questions)
 * 7. Geometri & Teorema Pythagoras (3 questions)
 * 8. Statistika (3 questions)
 * 9. Peluang (3 questions)
 * 10. Relasi & Fungsi (3 questions)
 */
export const DIAGNOSTIC_QUESTIONS_30: Question[] = [
  // --- 1. BILANGAN (Fase A - D) ---
  {
    id: 'diag-q1',
    topicId: 'diagnostic',
    questionText: 'Sebuah kapal selam berada di kedalaman 180 meter di bawah permukaan laut. Kapal tersebut kemudian naik sejauh 65 meter. Posisi kapal selam sekarang berada pada kedalaman...',
    mathExpression: '-180 + 65 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '115 meter di bawah permukaan laut' },
      { id: 'B', text: '245 meter di bawah permukaan laut' },
      { id: 'C', text: '125 meter di bawah permukaan laut' },
      { id: 'D', text: '65 meter di bawah permukaan laut' }
    ],
    correctAnswer: 'A',
    explanation: 'Kedalaman dinyatakan dengan bilangan negatif: -180 meter. Kapal naik 65 meter: -180 + 65 = -115 meter, yang artinya 115 meter di bawah permukaan laut.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Bilangan'
  },
  {
    id: 'diag-q2',
    topicId: 'diagnostic',
    questionText: 'Nilai dari 24 - (-16) + (-30) adalah...',
    mathExpression: '24 - (-16) + (-30) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '10' },
      { id: 'B', text: '-22' },
      { id: 'C', text: '70' },
      { id: 'D', text: '-10' }
    ],
    correctAnswer: 'A',
    explanation: '24 - (-16) = 24 + 16 = 40. Kemudian 40 + (-30) = 40 - 30 = 10.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Bilangan'
  },
  {
    id: 'diag-q3',
    topicId: 'diagnostic',
    questionText: 'Kelipatan Persekutuan Terkecil (KPK) dan Faktor Persekutuan Terbesar (FPB) dari 24 dan 36 berturut-turut adalah...',
    mathExpression: '\\text{KPK}(24, 36) \\quad \\text{dan} \\quad \\text{FPB}(24, 36)',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '72 dan 12' },
      { id: 'B', text: '48 dan 6' },
      { id: 'C', text: '72 dan 6' },
      { id: 'D', text: '144 dan 12' }
    ],
    correctAnswer: 'A',
    explanation: 'Faktorisasi prima: 24 = 2^3 × 3; 36 = 2^2 × 3^2. FPB = 2^2 × 3 = 12. KPK = 2^3 × 3^2 = 8 × 9 = 72.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Bilangan'
  },

  // --- 2. OPERASI HITUNG (Fase A - D) ---
  {
    id: 'diag-q4',
    topicId: 'diagnostic',
    questionText: 'Hasil dari operasi hitung campuran 150 + 50 × 4 - 200 : 5 adalah...',
    mathExpression: '150 + (50 \\times 4) - (200 : 5) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '310' },
      { id: 'B', text: '760' },
      { id: 'C', text: '150' },
      { id: 'D', text: '290' }
    ],
    correctAnswer: 'A',
    explanation: 'Dahulukan perkalian dan pembagian: 50 × 4 = 200; 200 : 5 = 40. Maka: 150 + 200 - 40 = 350 - 40 = 310.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Operasi Hitung'
  },
  {
    id: 'diag-q5',
    topicId: 'diagnostic',
    questionText: 'Ibu membeli 3 kantong beras masing-masing seberat 5 kg dan 4 kantong gula masing-masing 2 kg. Total belanjaan Ibu adalah...',
    mathExpression: '(3 \\times 5) + (4 \\times 2) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '23 kg' },
      { id: 'B', text: '21 kg' },
      { id: 'C', text: '27 kg' },
      { id: 'D', text: '25 kg' }
    ],
    correctAnswer: 'A',
    explanation: 'Beras = 3 × 5 = 15 kg. Gula = 4 × 2 = 8 kg. Total = 15 + 8 = 23 kg.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Operasi Hitung'
  },
  {
    id: 'diag-q6',
    topicId: 'diagnostic',
    questionText: 'Dalam sebuah kompetisi dengan 40 soal, jawaban benar bernilai 4, salah bernilai -2, dan tidak dijawab bernilai 0. Siswa menjawab 32 soal benar dan 5 soal salah. Nilai siswa tersebut adalah...',
    mathExpression: '32(4) + 5(-2) + 3(0) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '118' },
      { id: 'B', text: '128' },
      { id: 'C', text: '108' },
      { id: 'D', text: '120' }
    ],
    correctAnswer: 'A',
    explanation: 'Nilai benar = 32 × 4 = 128. Nilai salah = 5 × (-2) = -10. Nilai total = 128 - 10 = 118.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Operasi Hitung'
  },

  // --- 3. PECAHAN (Fase B - C) ---
  {
    id: 'diag-q7',
    topicId: 'diagnostic',
    questionText: 'Pecahan yang senilai dengan 3/4 adalah...',
    mathExpression: '\\frac{3}{4} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '6/8' },
      { id: 'B', text: '9/15' },
      { id: 'C', text: '12/20' },
      { id: 'D', text: '5/6' }
    ],
    correctAnswer: 'A',
    explanation: 'Kalikan pembilang dan penyebut dengan 2: (3 × 2) / (4 × 2) = 6/8.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Pecahan'
  },
  {
    id: 'diag-q8',
    topicId: 'diagnostic',
    questionText: 'Hasil dari 2/3 + 3/5 adalah...',
    mathExpression: '\\frac{2}{3} + \\frac{3}{5} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '19/15' },
      { id: 'B', text: '5/8' },
      { id: 'C', text: '6/15' },
      { id: 'D', text: '1 1/15' }
    ],
    correctAnswer: 'A',
    explanation: 'KPK dari 3 dan 5 adalah 15. 2/3 = 10/15 dan 3/5 = 9/15. Maka 10/15 + 9/15 = 19/15 (atau 1 4/15).',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Pecahan'
  },
  {
    id: 'diag-q9',
    topicId: 'diagnostic',
    questionText: 'Pak Ahmad memiliki sebidang tanah seluas 600 m². Sebanyak 2/5 bagian dibangun rumah, 1/4 bagian dijadikan taman, dan sisanya kolam ikan. Luas kolam ikan adalah...',
    mathExpression: '600 \\times \\left(1 - \\frac{2}{5} - \\frac{1}{4}\\right) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '210 m²' },
      { id: 'B', text: '240 m²' },
      { id: 'C', text: '150 m²' },
      { id: 'D', text: '180 m²' }
    ],
    correctAnswer: 'A',
    explanation: 'Rumah = 2/5 × 600 = 240 m². Taman = 1/4 × 600 = 150 m². Kolam ikan = 600 - (240 + 150) = 600 - 390 = 210 m².',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Pecahan'
  },

  // --- 4. RASIO & PERBANDINGAN (Fase C - D) ---
  {
    id: 'diag-q10',
    topicId: 'diagnostic',
    questionText: 'Perbandingan banyak kelereng Amir dan Budi adalah 3 : 5. Jika jumlah kelereng mereka berdua adalah 40 butir, banyak kelereng Budi adalah...',
    mathExpression: '\\frac{5}{3 + 5} \\times 40 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '25 butir' },
      { id: 'B', text: '15 butir' },
      { id: 'C', text: '20 butir' },
      { id: 'D', text: '30 butir' }
    ],
    correctAnswer: 'A',
    explanation: 'Jumlah bagian = 3 + 5 = 8 bagian. Kelereng Budi = (5 / 8) × 40 = 25 butir.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Rasio'
  },
  {
    id: 'diag-q11',
    topicId: 'diagnostic',
    questionText: 'Pada peta berskala 1 : 250.000, jarak antara kota P dan kota Q adalah 6 cm. Jarak sebenarnya antara kedua kota tersebut adalah...',
    mathExpression: '6 \\text{ cm} \\times 250.000 = ? \\text{ km}',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '15 km' },
      { id: 'B', text: '150 km' },
      { id: 'C', text: '1,5 km' },
      { id: 'D', text: '25 km' }
    ],
    correctAnswer: 'A',
    explanation: 'Jarak sebenarnya = 6 × 250.000 cm = 1.500.000 cm = 15.000 m = 15 km.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Rasio'
  },
  {
    id: 'diag-q12',
    topicId: 'diagnostic',
    questionText: 'Sebuah pekerjaan dapat diselesaikan oleh 12 orang pekerja dalam waktu 20 hari. Jika pekerjaan tersebut ingin diselesaikan dalam 15 hari, banyak pekerja tambahan yang diperlukan adalah...',
    mathExpression: '12 \\times 20 = x \\times 15',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4 orang' },
      { id: 'B', text: '16 orang' },
      { id: 'C', text: '6 orang' },
      { id: 'D', text: '8 orang' }
    ],
    correctAnswer: 'A',
    explanation: 'Perbandingan berbalik nilai: x = (12 × 20) / 15 = 240 / 15 = 16 pekerja. Pekerja tambahan yang diperlukan = 16 - 12 = 4 orang.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Rasio'
  },

  // --- 5. BENTUK ALJABAR (Fase D) ---
  {
    id: 'diag-q13',
    topicId: 'diagnostic',
    questionText: 'Pada bentuk aljabar 4x² - 7x + 9, koefisien dari variabel x dan nilai konstanta berturut-turut adalah...',
    mathExpression: '4x^2 - 7x + 9',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '-7 dan 9' },
      { id: 'B', text: '7 dan 9' },
      { id: 'C', text: '4 dan -7' },
      { id: 'D', text: '-7 dan 4' }
    ],
    correctAnswer: 'A',
    explanation: 'Variabel x memiliki pengali koefisien -7 (sertakan tanda negatifnya), sedangkan suku yang tidak memuat variabel adalah konstanta bernilai 9.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Aljabar'
  },
  {
    id: 'diag-q14',
    topicId: 'diagnostic',
    questionText: 'Bentuk sederhana dari (5x - 3) + (2x + 8) adalah...',
    mathExpression: '(5x - 3) + (2x + 8) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '7x + 5' },
      { id: 'B', text: '7x - 5' },
      { id: 'C', text: '10x - 24' },
      { id: 'D', text: '3x + 11' }
    ],
    correctAnswer: 'A',
    explanation: 'Kelompokkan suku sejenis: (5x + 2x) + (-3 + 8) = 7x + 5.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Aljabar'
  },
  {
    id: 'diag-q15',
    topicId: 'diagnostic',
    questionText: 'Hasil perkalian aljabar dari (2x + 3)(x - 4) adalah...',
    mathExpression: '(2x + 3)(x - 4) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '2x² - 5x - 12' },
      { id: 'B', text: '2x² + 5x - 12' },
      { id: 'C', text: '2x² - 12' },
      { id: 'D', text: '2x² - 8x + 3' }
    ],
    correctAnswer: 'A',
    explanation: '(2x)(x) + (2x)(-4) + (3)(x) + (3)(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Aljabar'
  },

  // --- 6. PERSAMAAN LINEAR (Fase D) ---
  {
    id: 'diag-q16',
    topicId: 'diagnostic',
    questionText: 'Penyelesaian dari persamaan linear 4x - 5 = 19 adalah nilai x = ...',
    mathExpression: '4x - 5 = 19 \\implies x = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '6' },
      { id: 'B', text: '5' },
      { id: 'C', text: '7' },
      { id: 'D', text: '8' }
    ],
    correctAnswer: 'A',
    explanation: '4x = 19 + 5 = 24. x = 24 / 4 = 6.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Persamaan Linear'
  },
  {
    id: 'diag-q17',
    topicId: 'diagnostic',
    questionText: 'Penyelesaian dari persamaan 3(2x - 1) = 4x + 9 adalah...',
    mathExpression: '3(2x - 1) = 4x + 9',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x = 6' },
      { id: 'B', text: 'x = 4' },
      { id: 'C', text: 'x = 5' },
      { id: 'D', text: 'x = 3' }
    ],
    correctAnswer: 'A',
    explanation: '6x - 3 = 4x + 9 → 6x - 4x = 9 + 3 → 2x = 12 → x = 6.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Persamaan Linear'
  },
  {
    id: 'diag-q18',
    topicId: 'diagnostic',
    questionText: 'Umur ayah 3 kali umur Budi. Selisih umur mereka adalah 28 tahun. Umur Budi sekarang adalah...',
    mathExpression: '3x - x = 28',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '14 tahun' },
      { id: 'B', text: '12 tahun' },
      { id: 'C', text: '16 tahun' },
      { id: 'D', text: '18 tahun' }
    ],
    correctAnswer: 'A',
    explanation: 'Misalkan umur Budi = x. Umur ayah = 3x. Selisih: 3x - x = 28 → 2x = 28 → x = 14 tahun.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Persamaan Linear'
  },

  // --- 7. GEOMETRI & PENGUKURAN (Fase B - D) ---
  {
    id: 'diag-q19',
    topicId: 'diagnostic',
    questionText: 'Sebuah persegi panjang memiliki panjang 14 cm dan lebar 8 cm. Keliling dan luas persegi panjang tersebut adalah...',
    mathExpression: 'K = 2(p + l), \\quad L = p \\times l',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Keliling 44 cm, Luas 112 cm²' },
      { id: 'B', text: 'Keliling 22 cm, Luas 112 cm²' },
      { id: 'C', text: 'Keliling 44 cm, Luas 56 cm²' },
      { id: 'D', text: 'Keliling 88 cm, Luas 224 cm²' }
    ],
    correctAnswer: 'A',
    explanation: 'Keliling = 2(14 + 8) = 2(22) = 44 cm. Luas = 14 × 8 = 112 cm².',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Geometri'
  },
  {
    id: 'diag-q20',
    topicId: 'diagnostic',
    questionText: 'Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 9 cm dan 12 cm. Berdasarkan Teorema Pythagoras, panjang sisi miringnya (hipotenusa) adalah...',
    mathExpression: 'c^2 = a^2 + b^2 = 9^2 + 12^2',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '15 cm' },
      { id: 'B', text: '17 cm' },
      { id: 'C', text: '13 cm' },
      { id: 'D', text: '21 cm' }
    ],
    correctAnswer: 'A',
    explanation: 'c² = 9² + 12² = 81 + 144 = 225. c = √225 = 15 cm.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Geometri'
  },
  {
    id: 'diag-q21',
    topicId: 'diagnostic',
    questionText: 'Sebuah balok memiliki ukuran panjang 10 cm, lebar 6 cm, dan tinggi 5 cm. Volume balok tersebut adalah...',
    mathExpression: 'V = p \\times l \\times t = 10 \\times 6 \\times 5',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '300 cm³' },
      { id: 'B', text: '210 cm³' },
      { id: 'C', text: '280 cm³' },
      { id: 'D', text: '350 cm³' }
    ],
    correctAnswer: 'A',
    explanation: 'Volume balok = panjang × lebar × tinggi = 10 × 6 × 5 = 300 cm³.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Geometri'
  },

  // --- 8. STATISTIKA (Fase D - E) ---
  {
    id: 'diag-q22',
    topicId: 'diagnostic',
    questionText: 'Nilai ulangan matematika 7 orang siswa adalah: 7, 8, 6, 9, 8, 7, 9. Nilai rata-rata (mean) dari data tersebut adalah...',
    mathExpression: '\\bar{x} = \\frac{\\sum x_i}{n} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '7,71' },
      { id: 'B', text: '8,00' },
      { id: 'C', text: '7,50' },
      { id: 'D', text: '8,25' }
    ],
    correctAnswer: 'A',
    explanation: 'Jumlah data = 7 + 8 + 6 + 9 + 8 + 7 + 9 = 54. Rata-rata = 54 / 7 ≈ 7,71.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Statistika'
  },
  {
    id: 'diag-q23',
    topicId: 'diagnostic',
    questionText: 'Diberikan data nilai: 65, 70, 75, 80, 80, 85, 90, 95. Median dari kumpulan nilai tersebut adalah...',
    mathExpression: '\\text{Median} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '80' },
      { id: 'B', text: '77,5' },
      { id: 'C', text: '82,5' },
      { id: 'D', text: '85' }
    ],
    correctAnswer: 'A',
    explanation: 'Data terurut memiliki n = 8 nilai. Median adalah rata-rata suku ke-4 dan ke-5: (80 + 80) / 2 = 80.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Statistika'
  },
  {
    id: 'diag-q24',
    topicId: 'diagnostic',
    questionText: 'Modus dari data frekuensi: nilai 60 (3 anak), nilai 70 (8 anak), nilai 80 (12 anak), nilai 90 (5 anak) adalah...',
    mathExpression: '\\text{Modus} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '80' },
      { id: 'B', text: '12' },
      { id: 'C', text: '70' },
      { id: 'D', text: '75' }
    ],
    correctAnswer: 'A',
    explanation: 'Modus adalah nilai dengan frekuensi kemunculan terbanyak, yaitu nilai 80 (muncul sebanyak 12 kali).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Statistika'
  },

  // --- 9. PELUANG (Fase D - E) ---
  {
    id: 'diag-q25',
    topicId: 'diagnostic',
    questionText: 'Sebuah dadu bermata 6 dilempar sekali. Peluang munculnya mata dadu prima (2, 3, 5) adalah...',
    mathExpression: 'P(A) = \\frac{n(A)}{n(S)} = \\frac{3}{6} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '1/2' },
      { id: 'B', text: '1/3' },
      { id: 'C', text: '1/6' },
      { id: 'D', text: '2/3' }
    ],
    correctAnswer: 'A',
    explanation: 'Mata dadu prima = {2, 3, 5}, jadi n(A) = 3. Ruang sampel n(S) = 6. Peluang = 3/6 = 1/2.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Peluang'
  },
  {
    id: 'diag-q26',
    topicId: 'diagnostic',
    questionText: 'Dalam sebuah kantong terdapat 5 kelereng merah, 3 kelereng biru, dan 2 kelereng kuning. Diambil sebuah kelereng secara acak. Peluang terambil kelereng bukan kuning adalah...',
    mathExpression: 'P(K^c) = 1 - P(K) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4/5' },
      { id: 'B', text: '1/5' },
      { id: 'C', text: '3/10' },
      { id: 'D', text: '7/10' }
    ],
    correctAnswer: 'A',
    explanation: 'Total kelereng = 5 + 3 + 2 = 10. Bukan kuning = merah + biru = 8. Peluang = 8/10 = 4/5.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Peluang'
  },
  {
    id: 'diag-q27',
    topicId: 'diagnostic',
    questionText: 'Dua keping uang logam dilempar bersamaan satu kali. Peluang muncul paling sedikit satu sisi angka (A) adalah...',
    mathExpression: 'S = \\{AA, AG, GA, GG\\}',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '3/4' },
      { id: 'B', text: '1/2' },
      { id: 'C', text: '1/4' },
      { id: 'D', text: '2/3' }
    ],
    correctAnswer: 'A',
    explanation: 'Ruang sampel S = {AA, AG, GA, GG} dengan n(S) = 4. Kejadian paling sedikit satu angka = {AA, AG, GA} dengan n(A) = 3. Peluang = 3/4.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Peluang'
  },

  // --- 10. RELASI & FUNGSI (Fase D - E) ---
  {
    id: 'diag-q28',
    topicId: 'diagnostic',
    questionText: 'Diketahui fungsi linear f(x) = 3x - 5. Nilai dari f(4) adalah...',
    mathExpression: 'f(4) = 3(4) - 5 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '7' },
      { id: 'B', text: '12' },
      { id: 'C', text: '17' },
      { id: 'D', text: '9' }
    ],
    correctAnswer: 'A',
    explanation: 'Substitusikan x = 4 ke f(x): f(4) = 3(4) - 5 = 12 - 5 = 7.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Fungsi'
  },
  {
    id: 'diag-q29',
    topicId: 'diagnostic',
    questionText: 'Persamaan sumbu simetri dari fungsi kuadrat f(x) = x² - 6x + 8 adalah garis...',
    mathExpression: 'x = -\\frac{b}{2a}',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x = 3' },
      { id: 'B', text: 'x = -3' },
      { id: 'C', text: 'x = 6' },
      { id: 'D', text: 'x = -6' }
    ],
    correctAnswer: 'A',
    explanation: 'a = 1, b = -6. Rumus sumbu simetri: x = -b / (2a) = -(-6) / (2 × 1) = 6 / 2 = 3.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Fungsi'
  },
  {
    id: 'diag-q30',
    topicId: 'diagnostic',
    questionText: 'Nilai minimum dari grafik fungsi kuadrat f(x) = x² - 4x - 5 adalah...',
    mathExpression: 'y_p = -\\frac{D}{4a} \\quad \\text{atau} \\quad f(x_p)',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '-9' },
      { id: 'B', text: '2' },
      { id: 'C', text: '-5' },
      { id: 'D', text: '-13' }
    ],
    correctAnswer: 'A',
    explanation: 'Sumbu simetri x_p = -(-4) / 2(1) = 2. Nilai minimum: f(2) = (2)² - 4(2) - 5 = 4 - 8 - 5 = -9.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Fungsi'
  }
];
