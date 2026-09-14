/**
 * MathPath Curriculum Data Store
 * Kurikulum Matematika Indonesia Fase A - Fase F
 */

import { Phase, Level, Topic, Subtopic, LearningMaterial, ExampleItem, Question, Assessment } from '../src/types';

export const INITIAL_PHASES: Phase[] = [
  {
    id: 'phase-a',
    code: 'FASE_A',
    name: 'Fase A (Kelas 1 - 2 SD)',
    description: 'Fondasi bilangan cacah, penjumlahan, pengurangan, dan pola gambar dasar.',
    orderIndex: 1
  },
  {
    id: 'phase-b',
    code: 'FASE_B',
    name: 'Fase B (Kelas 3 - 4 SD)',
    description: 'Perkalian, pembagian, konsep pecahan senilai, pengukuran panjang dan luas.',
    orderIndex: 2
  },
  {
    id: 'phase-c',
    code: 'FASE_C',
    name: 'Fase C (Kelas 5 - 6 SD)',
    description: 'Operasi hitung pecahan campuran, desimal, rasio, dan bangun ruang sederhana.',
    orderIndex: 3
  },
  {
    id: 'phase-d',
    code: 'FASE_D',
    name: 'Fase D (Kelas 7 - 9 SMP)',
    description: 'Bentuk aljabar, persamaan linear satu variabel, teorema Pythagoras, dan statistika dasar.',
    orderIndex: 4
  },
  {
    id: 'phase-e',
    code: 'FASE_E',
    name: 'Fase E (Kelas 10 SMA/SMK)',
    description: 'Eksponen & logaritma, persamaan kuadrat, fungsi kuadrat, dan vektor dasar.',
    orderIndex: 5
  },
  {
    id: 'phase-f',
    code: 'FASE_F',
    name: 'Fase F (Kelas 11 - 12 SMA/SMK)',
    description: 'Trigonometri analitik, limit fungsi, kalkulus turunan dan integral, statistika inferensial.',
    orderIndex: 6
  }
];

export const INITIAL_LEVELS: Level[] = [
  { id: 'level-a1', phaseId: 'phase-a', name: 'Level A1: Bilangan Cacah & Penjumlahan', gradeEquivalent: 'Kelas 1 SD', orderIndex: 1 },
  { id: 'level-b1', phaseId: 'phase-b', name: 'Level B1: Pecahan Senilai & Perkalian', gradeEquivalent: 'Kelas 3-4 SD', orderIndex: 2 },
  { id: 'level-c1', phaseId: 'phase-c', name: 'Level C1: Operasi Pecahan & Rasio', gradeEquivalent: 'Kelas 5-6 SD', orderIndex: 3 },
  { id: 'level-d1', phaseId: 'phase-d', name: 'Level D1: Fondasi Bentuk Aljabar', gradeEquivalent: 'Kelas 7 SMP', orderIndex: 4 },
  { id: 'level-d2', phaseId: 'phase-d', name: 'Level D2: Persamaan Linear Satu Variabel', gradeEquivalent: 'Kelas 7 SMP', orderIndex: 5 },
  { id: 'level-d3', phaseId: 'phase-d', name: 'Level D3: Pemfaktoran Aljabar', gradeEquivalent: 'Kelas 8 SMP', orderIndex: 6 },
  { id: 'level-d4', phaseId: 'phase-d', name: 'Level D4: Teorema Pythagoras & Geometri', gradeEquivalent: 'Kelas 8 SMP', orderIndex: 7 },
  { id: 'level-e1', phaseId: 'phase-e', name: 'Level E1: Eksponen dan Logaritma', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 8 },
  { id: 'level-e2', phaseId: 'phase-e', name: 'Level E2: Persamaan Kuadrat', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 9 },
  { id: 'level-e3', phaseId: 'phase-e', name: 'Level E3: Fungsi Kuadrat & Grafiknya', gradeEquivalent: 'Kelas 10 SMA', orderIndex: 10 },
  { id: 'level-f1', phaseId: 'phase-f', name: 'Level F1: Turunan Fungsi Aljabar', gradeEquivalent: 'Kelas 11 SMA', orderIndex: 11 }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'topic-pecahan-senilai',
    levelId: 'level-b1',
    phaseId: 'phase-b',
    title: 'Pecahan Senilai',
    slug: 'pecahan-senilai',
    description: 'Memahami konsep pecahan senilai dengan visualisasi model konkret dan perkalian pembilang-penyebut.',
    passingScore: 75,
    estimatedMinutes: 30,
    orderIndex: 1,
    prerequisiteIds: []
  },
  {
    id: 'topic-operasi-pecahan',
    levelId: 'level-c1',
    phaseId: 'phase-c',
    title: 'Operasi Pecahan Campuran & Rasio',
    slug: 'operasi-pecahan',
    description: 'Menjumlahkan, mengurangkan, dan menyelesaikan permasalahan rasio pecahan.',
    passingScore: 75,
    estimatedMinutes: 40,
    orderIndex: 2,
    prerequisiteIds: ['topic-pecahan-senilai']
  },
  {
    id: 'topic-bentuk-aljabar',
    levelId: 'level-d1',
    phaseId: 'phase-d',
    title: 'Bentuk Aljabar & Operasi Dasar',
    slug: 'bentuk-aljabar',
    description: 'Mengenal variabel, koefisien, konstanta, suku sejenis, serta penjumlahan & perkalian aljabar.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 3,
    prerequisiteIds: []
  },
  {
    id: 'topic-plsv',
    levelId: 'level-d2',
    phaseId: 'phase-d',
    title: 'Persamaan Linear Satu Variabel (PLSV)',
    slug: 'persamaan-linear-satu-variabel',
    description: 'Menyelesaikan persamaan linear bentuk ax + b = c dengan sifat kesetaraan aljabar.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 4,
    prerequisiteIds: ['topic-bentuk-aljabar']
  },
  {
    id: 'topic-pemfaktoran',
    levelId: 'level-d3',
    phaseId: 'phase-d',
    title: 'Pemfaktoran Aljabar',
    slug: 'pemfaktoran-aljabar',
    description: 'Memfaktorkan suku aljabar persekutuan dan bentuk kuadrat ax² + bx + c serta selisih dua kuadrat.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 5,
    prerequisiteIds: ['topic-bentuk-aljabar']
  },
  {
    id: 'topic-pythagoras',
    levelId: 'level-d4',
    phaseId: 'phase-d',
    title: 'Teorema Pythagoras',
    slug: 'teorema-pythagoras',
    description: 'Hubungan kuadrat sisi miring segitiga siku-siku (a² + b² = c²) dan penerapannya dalam masalah kontekstual.',
    passingScore: 75,
    estimatedMinutes: 45,
    orderIndex: 6,
    prerequisiteIds: []
  },
  {
    id: 'topic-persamaan-kuadrat',
    levelId: 'level-e2',
    phaseId: 'phase-e',
    title: 'Persamaan Kuadrat',
    slug: 'persamaan-kuadrat',
    description: 'Menentukan akar-akar persamaan kuadrat dengan pemfaktoran, melengkapkan kuadrat sempurna, dan rumus kuadratik abc.',
    passingScore: 75,
    estimatedMinutes: 50,
    orderIndex: 7,
    prerequisiteIds: ['topic-pemfaktoran']
  },
  {
    id: 'topic-fungsi-kuadrat',
    levelId: 'level-e3',
    phaseId: 'phase-e',
    title: 'Fungsi Kuadrat & Titik Ekstrem',
    slug: 'fungsi-kuadrat',
    description: 'Menganalisis parabola, titik puncak (-b/2a, -D/4a), sumbu simetri, diskriminan, dan nilai maksimum/minimum.',
    passingScore: 75,
    estimatedMinutes: 55,
    orderIndex: 8,
    prerequisiteIds: ['topic-persamaan-kuadrat']
  },
  {
    id: 'topic-turunan',
    levelId: 'level-f1',
    phaseId: 'phase-f',
    title: 'Turunan Fungsi Aljabar',
    slug: 'turunan-fungsi-aljabar',
    description: 'Konsep limit laju perubahan f\'(x), aturan pangkat turunan, gradien garis singgung, dan aplikasi titik stasioner.',
    passingScore: 75,
    estimatedMinutes: 60,
    orderIndex: 9,
    prerequisiteIds: ['topic-fungsi-kuadrat']
  }
];

export const INITIAL_SUBTOPICS: Subtopic[] = [
  { id: 'sub-1', topicId: 'topic-bentuk-aljabar', title: 'Unsur-Unsur Bentuk Aljabar', description: 'Variabel, koefisien, konstanta, derajat aljabar', orderIndex: 1 },
  { id: 'sub-2', topicId: 'topic-bentuk-aljabar', title: 'Suku Sejenis & Penjumlahan', description: 'Menyederhanakan suku sejenis', orderIndex: 2 },
  { id: 'sub-3', topicId: 'topic-bentuk-aljabar', title: 'Perkalian Suku Tunggal & Distribusi', description: 'Sifat distributif a(b + c)', orderIndex: 3 },
  { id: 'sub-4', topicId: 'topic-pemfaktoran', title: 'Faktor Persekutuan Terbesar (FPB)', description: 'Mengeluarkan faktor yang sama ab + ac = a(b + c)', orderIndex: 1 },
  { id: 'sub-5', topicId: 'topic-pemfaktoran', title: 'Selisih Dua Kuadrat', description: 'Bentuk a² - b² = (a + b)(a - b)', orderIndex: 2 },
  { id: 'sub-6', topicId: 'topic-pemfaktoran', title: 'Pemfaktoran x² + bx + c', description: 'Mencari pasangan bilangan p + q = b dan p × q = c', orderIndex: 3 },
  { id: 'sub-7', topicId: 'topic-persamaan-kuadrat', title: 'Bentuk Umum Persamaan Kuadrat', description: 'ax² + bx + c = 0 dengan a ≠ 0', orderIndex: 1 },
  { id: 'sub-8', topicId: 'topic-persamaan-kuadrat', title: 'Metode Pemfaktoran', description: 'Menemukan akar x₁ dan x₂', orderIndex: 2 },
  { id: 'sub-9', topicId: 'topic-persamaan-kuadrat', title: 'Rumus Kuadratik (Rumus abc)', description: 'x = (-b ± √(b² - 4ac)) / (2a)', orderIndex: 3 },
  { id: 'sub-10', topicId: 'topic-fungsi-kuadrat', title: 'Karakteristik Parabola & Diskriminan', description: 'Arah bukaan a > 0 atau a < 0 dan diskriminan D', orderIndex: 1 },
  { id: 'sub-11', topicId: 'topic-fungsi-kuadrat', title: 'Sumbu Simetri dan Titik Puncak', description: 'Koordinat puncak (x_p, y_p) = (-b/2a, -D/4a)', orderIndex: 2 }
];

export const INITIAL_MATERIALS: Record<string, LearningMaterial> = {
  'topic-fungsi-kuadrat': {
    id: 'mat-fk',
    topicId: 'topic-fungsi-kuadrat',
    title: 'Fungsi Kuadrat, Parabola, & Titik Ekstrem',
    learningObjectives: [
      'Menentukan karakteristik grafik fungsi kuadrat berdasarkan tanda koefisien a dan diskriminan D.',
      'Menghitung koordinat sumbu simetri dan titik balik puncak (maksimum/minimum) secara matematis.',
      'Menyelesaikan permasalahan kontekstual lintasan proyektil atau keuntungan maksimum menggunakan nilai ekstrem fungsi kuadrat.'
    ],
    apperception: 'Pernahkah kamu memperhatikan lintasan bola basket yang dilempar menuju ring, atau semprotan air mancur taman? Lintasan lengkung mulus tersebut mengikuti kurva parabola matematika yang dimodelkan oleh Fungsi Kuadrat. Melalui materi ini, kita dapat memprediksi ketinggian puncak tertinggi dan waktu jatuhnya secara presisi!',
    basicConcepts: 'Fungsi kuadrat adalah fungsi polinomial berderajat dua dengan bentuk umum:\n\nf(x) = ax^2 + bx + c \\quad (a \\neq 0)\n\nGrafik fungsi kuadrat berbentuk parabola simetris vertikal. Nilai a menentukan arah kurva terbuka (ke atas jika a > 0, ke bawah jika a < 0), sedangkan konstanta c menunjukkan titik potong grafik terhadap sumbu Y pada (0, c).',
    detailedExplanation: '1. Titik Puncak (Titik Balik Ekstrem)\nTitik puncak parabola terjadi saat gradien perubahan fungsi bernilai nol. Koordinat titik puncak P(x_p, y_p) dapat dihitung dengan rumus:\n\nx_p = -\\frac{b}{2a}\n\ny_p = -\\frac{D}{4a} = f(x_p)\n\ndi mana diskriminan D didefinisikan sebagai D = b^2 - 4ac.\n\n2. Sumbu Simetri\nGaris tegak lurus sumbu X yang membagi parabola menjadi dua sisi simetris adalah garis x = -b/(2a).\n\n3. Peran Nilai Diskriminan (D)\n- Jika D > 0: grafik memotong sumbu X di 2 titik berlainan.\n- Jika D = 0: grafik menyinggung sumbu X di 1 titik puncak.\n- Jika D < 0: grafik tidak pernah memotong sumbu X (definit positif jika a > 0, atau definit negatif jika a < 0).',
    commonMisconceptions: '❌ Kesalahan Umum: Siswa sering lupa tanda negatif pada sumbu simetri x_p = -b/(2a), sehingga menghasilkan x_p yang berlawanan tanda.\n❌ Kesalahan Umum: Menganggap nilai minimum selalu nol. Nilai minimum parabola terbuka ke atas adalah nilai y_p = -D/(4a), yang bisa bernilai negatif, nol, atau positif.',
    summary: 'Fungsi kuadrat f(x) = ax² + bx + c memiliki grafik parabola dengan titik puncak (-b/2a, -D/4a). Jika a > 0 parabola memiliki nilai minimum (terbuka ke atas), dan jika a < 0 parabola memiliki nilai maksimum (terbuka ke bawah).'
  },
  'topic-persamaan-kuadrat': {
    id: 'mat-pk',
    topicId: 'topic-persamaan-kuadrat',
    title: 'Persamaan Kuadrat & Penyelesaian Akarnya',
    learningObjectives: [
      'Menyatakan bentuk baku persamaan kuadrat ax² + bx + c = 0.',
      'Menemukan himpunan penyelesaian menggunakan metode pemfaktoran dan rumus kuadratik abc.',
      'Menganalisis jenis akar menggunakan nilai diskriminan D.'
    ],
    apperception: 'Ketika merancang luas tanah persegi panjang di mana panjangnya 4 meter lebih dari lebarnya, persamaan luas akan menghasilkan variabel berpangkat dua: L = p × l = (l + 4) × l = l² + 4l. Untuk menemukan ukuran sebenarnya, kita memerlukan teknik persamaan kuadrat!',
    basicConcepts: 'Bentuk umum persamaan kuadrat adalah:\n\nax^2 + bx + c = 0 \\quad (a \\neq 0)\n\nAkar-akar persamaan kuadrat adalah nilai pengganti x yang membuat ruas kiri sama dengan nol.',
    detailedExplanation: 'Metode 1: Pemfaktoran\nJika ax² + bx + c dapat dinyatakan dalam bentuk (x - x₁)(x - x₂) = 0, maka akar-akarnya adalah x = x₁ atau x = x₂.\n\nMetode 2: Rumus Kuadratik (Rumus abc)\nUntuk persamaan kuadrat sembarang, rumus penyelesaiannya adalah:\n\nx_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n\nDi mana D = b² - 4ac adalah diskriminan yang menentukan jenis akar:\n- D > 0: Dua akar real berbeda\n- D = 0: Dua akar real kembar\n- D < 0: Tidak memiliki akar real (akar imajiner).',
    commonMisconceptions: '❌ Kesalahan Umum: Membagi kedua ruas dengan x pada persamaan seperti x² = 6x, sehingga kehilangan akar x = 0!\nBentuk yang benar: x² - 6x = 0 → x(x - 6) = 0 → x = 0 atau x = 6.',
    summary: 'Persamaan kuadrat ax² + bx + c = 0 diselesaikan dengan pemfaktoran atau rumus abc: x = (-b ± √(b² - 4ac)) / 2a. Diskriminan D = b² - 4ac menentukan banyaknya akar real.'
  },
  'topic-pemfaktoran': {
    id: 'mat-pf',
    topicId: 'topic-pemfaktoran',
    title: 'Pemfaktoran Bentuk Aljabar',
    learningObjectives: [
      'Menentukan faktor persekutuan aljabar menggunakan sifat distributif.',
      'Memfaktorkan bentuk selisih dua kuadrat a² - b² = (a + b)(a - b).',
      'Memfaktorkan bentuk kuadrat x² + bx + c menjadi (x + p)(x + q).'
    ],
    apperception: 'Bayangkan kamu memiliki ubin berbentuk persegi besar dengan luas x² dan ubin persegi panjang dengan luas 5x. Jika digabungkan, total luasnya x² + 5x. Dengan menarik faktor yang sama, kita tahu ukuran panjang dan lebarnya adalah x(x + 5). Inilah esensi pemfaktoran!',
    basicConcepts: 'Pemfaktoran adalah proses menuliskan suatu bentuk aljabar sebagai hasil kali dari faktor-faktornya. Ini merupakan kebalikan dari operasi perkalian suku aljabar.',
    detailedExplanation: '1. Sifat Distributif (Faktor Persekutuan)\nab + ac = a(b + c)\nContoh: 6x² + 9x = 3x(2x + 3)\n\n2. Selisih Dua Kuadrat\na^2 - b^2 = (a + b)(a - b)\nContoh: x² - 16 = (x + 4)(x - 4)\n\n3. Bentuk Kuadrat x² + bx + c\nCarilah dua bilangan bulat p dan q sedemikian sehingga:\np + q = b \\quad \\text{dan} \\quad p \\times q = c\nMaka:\nx^2 + bx + c = (x + p)(x + q)',
    commonMisconceptions: '❌ Kesalahan: Menuliskan x² + 9 = (x + 3)(x - 3). Yang benar adalah selisih dua kuadrat (tanda minus): x² - 9 = (x + 3)(x - 3), bukan penjumlahan kuadrat!',
    summary: 'Pemfaktoran memecah bentuk polinomial ke bentuk perkalian faktor: faktor persekutuan, selisih dua kuadrat a² - b² = (a+b)(a-b), dan faktorisasi kuadrat (x+p)(x+q).'
  },
  'topic-bentuk-aljabar': {
    id: 'mat-ba',
    topicId: 'topic-bentuk-aljabar',
    title: 'Fondasi Bentuk Aljabar & Operasi Dasar',
    learningObjectives: [
      'Mengidentifikasi variabel, koefisien, konstanta, dan suku sejenis.',
      'Melakukan operasi penjumlahan dan pengurangan suku-suku sejenis.',
      'Menerapkan sifat distributif perkalian aljabar.'
    ],
    apperception: 'Jika kamu membeli 3 buku tulis dan 2 pensil, lalu temanmu membeli 2 buku tulis dan 1 pensil, bagaimana kamu menghitung total belanjaan tanpa harus mencampurkan buku dan pensil? Dalam matematika, kita memodelkannya dengan variabel: 3b + 2p + 2b + p = 5b + 3p!',
    basicConcepts: 'Variabel adalah lambang pengganti bilangan yang belum diketahui nilainya (misal x, y). Koefisien adalah angka pengali variabel (pada 5x, koefisiennya 5). Konstanta adalah bilangan tetap tanpa variabel. Suku sejenis adalah suku-suku yang variabel dan pangkatnya sama.',
    detailedExplanation: 'Operasi Penjumlahan & Pengurangan:\nHanya suku-suku sejenis yang dapat dijumlahkan atau dikurangkan koefisiennya:\n3x + 5x = (3 + 5)x = 8x\n4x^2 + 2x \\quad \\text{(tidak dapat disederhanakan karena pangkat x berbeda!)}\n\nOperasi Perkalian:\na(bx + c) = abx + ac\n(x + a)(x + b) = x^2 + (a + b)x + ab',
    commonMisconceptions: '❌ Menjumlahkan suku yang tidak sejenis: 2x + 3 = 5x (Salah! 2x dan 3 adalah suku tidak sejenis, tidak bisa disatukan menjadi 5x).',
    summary: 'Bentuk aljabar menyederhanakan suku sejenis dengan menjumlahkan/mengurangkan koefisiennya, dan menggunakan sifat distributif untuk perkalian suku aljabar.'
  },
  'topic-plsv': {
    id: 'mat-plsv',
    topicId: 'topic-plsv',
    title: 'Persamaan Linear Satu Variabel (PLSV)',
    learningObjectives: [
      'Mengenal bentuk umum persamaan linear satu variabel ax + b = c.',
      'Menyelesaikan persamaan menggunakan operasi setara pada kedua ruas.',
      'Menyelesaikan soal cerita kontekstual dengan pemodelan PLSV.'
    ],
    apperception: 'Timbangan dua lengan yang seimbang adalah gambaran sempurna dari persamaan aljabar. Jika kamu mengambil beban yang sama dari kedua piringan, timbangan akan tetap seimbang!',
    basicConcepts: 'Bentuk umum PLSV adalah ax + b = c (dengan a ≠ 0). Prinsip kesetaraan: apa pun operasi aritmatika (tambah, kurang, kali, bagi bukan nol) yang dilakukan di ruas kiri harus dilakukan pula di ruas kanan.',
    detailedExplanation: 'Contoh Penyelesaian:\n3x + 7 = 22\nLangkah 1: Kurangkan kedua ruas dengan 7:\n3x + 7 - 7 = 22 - 7\n3x = 15\nLangkah 2: Bagi kedua ruas dengan 3:\nx = 5\n\nPemeriksaan: 3(5) + 7 = 15 + 7 = 22 (Terbukti Benar).',
    commonMisconceptions: '❌ Pindah ruas tanpa membalik tanda operasi: dari x + 5 = 12 ditulis x = 12 + 5 (Salah! Penjumlahan menjadi pengurangan saat diisolasi: x = 12 - 5).',
    summary: 'PLSV diselesaikan dengan mengisolasi variabel menggunakan prinsip perlakuan setara pada kedua ruas persamaan hingga diperoleh nilai variabel tunggal.'
  }
};

export const INITIAL_EXAMPLES: Record<string, ExampleItem[]> = {
  'topic-fungsi-kuadrat': [
    {
      id: 'ex-fk-1',
      topicId: 'topic-fungsi-kuadrat',
      title: 'Menentukan Titik Puncak Parabola f(x) = x² - 6x + 8',
      problemStatement: 'Diberikan fungsi kuadrat f(x) = x^2 - 6x + 8. Tentukan:\na. Sumbu simetri\nb. Nilai ekstrem dan jenisnya\nc. Koordinat titik puncak parabola',
      difficulty: 'MOTS',
      keyTakeaway: 'Sumbu simetri selalu membagi parabola secara vertikal tepat pada x = -b/(2a). Nilai y puncak diperoleh dengan mensubstitusi x_p ke dalam rumus fungsi.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Identifikasi koefisien a, b, dan c',
          description: 'Dari f(x) = x² - 6x + 8, kita peroleh koefisien:\na = 1, b = -6, c = 8.\nKarena a = 1 > 0, grafik parabola terbuka ke ATAS dan memiliki nilai MINIMUM.',
          mathExpression: 'a = 1 > 0 \\implies \\text{Parabola Terbuka ke Atas}'
        },
        {
          stepNumber: 2,
          title: 'Hitung sumbu simetri (x_p)',
          description: 'Gunakan rumus sumbu simetri:\nx_p = -b / (2a) = -(-6) / (2 × 1) = 6 / 2 = 3.',
          mathExpression: 'x_p = -\\frac{-6}{2(1)} = 3'
        },
        {
          stepNumber: 3,
          title: 'Hitung nilai ekstrem minimum (y_p)',
          description: 'Substitusikan x_p = 3 ke dalam fungsi kuadrat:\nf(3) = (3)² - 6(3) + 8 = 9 - 18 + 8 = -1.',
          mathExpression: 'y_p = f(3) = 3^2 - 6(3) + 8 = -1'
        },
        {
          stepNumber: 4,
          title: 'Tuliskan koordinat titik puncak',
          description: 'Koordinat titik puncak minimum kurva parabola adalah (3, -1).',
          mathExpression: 'P(x_p, y_p) = (3, -1)'
        }
      ]
    }
  ],
  'topic-persamaan-kuadrat': [
    {
      id: 'ex-pk-1',
      topicId: 'topic-persamaan-kuadrat',
      title: 'Menyelesaikan x² - 5x + 6 = 0 dengan Pemfaktoran',
      problemStatement: 'Tentukan akar-akar himpunan penyelesaian dari persamaan kuadrat x^2 - 5x + 6 = 0.',
      difficulty: 'LOTS',
      keyTakeaway: 'Cari dua bilangan yang jika dikalikan bernilai +6 dan jika dijumlahkan bernilai -5. Bilangan tersebut adalah -2 dan -3.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Mencari pasangan bilangan p dan q',
          description: 'Kita mencari p dan q dengan syarat p × q = 6 dan p + q = -5.\nPasangan faktor dari 6 adalah (-2) dan (-3), karena (-2) × (-3) = 6 dan (-2) + (-3) = -5.',
          mathExpression: 'p = -2, \\quad q = -3'
        },
        {
          stepNumber: 2,
          title: 'Tulis bentuk faktorisasi',
          description: 'Ubah persamaan kuadrat menjadi hasil kali dua faktor linear:\n(x - 2)(x - 3) = 0.',
          mathExpression: '(x - 2)(x - 3) = 0'
        },
        {
          stepNumber: 3,
          title: 'Tentukan masing-masing akar',
          description: 'Agar hasil perkalian sama dengan 0, salah satu faktor harus bernilai 0:\nx - 2 = 0 → x₁ = 2\nx - 3 = 0 → x₂ = 3.',
          mathExpression: 'x_1 = 2 \\quad \\text{atau} \\quad x_2 = 3'
        }
      ]
    }
  ],
  'topic-pemfaktoran': [
    {
      id: 'ex-pf-1',
      topicId: 'topic-pemfaktoran',
      title: 'Memfaktorkan 2x² + 7x + 3',
      problemStatement: 'Faktorkanlah bentuk kuadrat 2x^2 + 7x + 3.',
      difficulty: 'MOTS',
      keyTakeaway: 'Pada ax² + bx + c dengan a ≠ 1, cari dua bilangan yang hasil kalinya a × c = 6 dan jumlahnya b = 7 (yaitu 1 dan 6), lalu pecah suku tengahnya.',
      stepByStepSolution: [
        {
          stepNumber: 1,
          title: 'Hitung nilai a × c dan pecah suku tengah',
          description: 'a × c = 2 × 3 = 6. Pasangan yang berjumlah 7 adalah 1 dan 6.\nPecah 7x menjadi x + 6x: 2x² + 6x + x + 3.',
          mathExpression: '2x^2 + 6x + x + 3'
        },
        {
          stepNumber: 2,
          title: 'Faktorkan secara berpasangan (pengelompokan)',
          description: 'Kelompokkan: (2x² + 6x) + (x + 3) = 2x(x + 3) + 1(x + 3).',
          mathExpression: '2x(x + 3) + 1(x + 3)'
        },
        {
          stepNumber: 3,
          title: 'Tarik faktor persekutuan yang sama',
          description: 'Karena (x + 3) sama di kedua suku, tarik keluar menjadi:\n(2x + 1)(x + 3).',
          mathExpression: '(2x + 1)(x + 3)'
        }
      ]
    }
  ]
};

export const INITIAL_QUESTIONS: Question[] = [
  // Diagnostic Questions (Fase A to Fase F foundations)
  {
    id: 'diag-q1',
    topicId: 'diagnostic',
    questionText: 'Hasil dari perhitungan 125 + 375 - 240 adalah...',
    mathExpression: '125 + 375 - 240 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '260' },
      { id: 'B', text: '280' },
      { id: 'C', text: '310' },
      { id: 'D', text: '360' }
    ],
    correctAnswer: 'A',
    explanation: '125 + 375 = 500. Kemudian 500 - 240 = 260.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Bilangan Cacah (Fase A/B)'
  },
  {
    id: 'diag-q2',
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
    explanation: 'Jika pembilang dan penyebut 3/4 dikali 2, hasilnya adalah 6/8.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Pecahan (Fase B)'
  },
  {
    id: 'diag-q3',
    topicId: 'diagnostic',
    questionText: 'Hasil operasi hitung aljabar (5x - 3) + (2x + 8) adalah...',
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
    conceptTag: 'Bentuk Aljabar (Fase D)'
  },
  {
    id: 'diag-q4',
    topicId: 'diagnostic',
    questionText: 'Penyelesaian dari persamaan linear 4x - 5 = 19 adalah nilai x = ...',
    mathExpression: '4x - 5 = 19 \\implies x = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '5' },
      { id: 'B', text: '6' },
      { id: 'C', text: '7' },
      { id: 'D', text: '8' }
    ],
    correctAnswer: 'B',
    explanation: '4x = 19 + 5 = 24. Maka x = 24 / 4 = 6.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Persamaan Linear (Fase D)'
  },
  {
    id: 'diag-q5',
    topicId: 'diagnostic',
    questionText: 'Bentuk pemfaktoran dari x² - 25 adalah...',
    mathExpression: 'x^2 - 25 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(x - 5)(x - 5)' },
      { id: 'B', text: '(x + 5)(x - 5)' },
      { id: 'C', text: '(x + 25)(x - 1)' },
      { id: 'D', text: 'x(x - 25)' }
    ],
    correctAnswer: 'B',
    explanation: 'Ini adalah bentuk selisih dua kuadrat a² - b² = (a + b)(a - b) dengan a = x dan b = 5.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Pemfaktoran (Fase D)'
  },
  {
    id: 'diag-q6',
    topicId: 'diagnostic',
    questionText: 'Pada segitiga siku-siku dengan panjang sisi tegak 6 cm dan 8 cm, panjang sisi miringnya adalah...',
    mathExpression: 'c = \\sqrt{6^2 + 8^2} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '9 cm' },
      { id: 'B', text: '10 cm' },
      { id: 'C', text: '12 cm' },
      { id: 'D', text: '14 cm' }
    ],
    correctAnswer: 'B',
    explanation: 'c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Geometri & Pythagoras (Fase D)'
  },
  {
    id: 'diag-q7',
    topicId: 'diagnostic',
    questionText: 'Akar-akar dari persamaan kuadrat x² - 7x + 12 = 0 adalah...',
    mathExpression: 'x^2 - 7x + 12 = 0 \\implies x_1, x_2 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'x = 3 atau x = 4' },
      { id: 'B', text: 'x = -3 atau x = -4' },
      { id: 'C', text: 'x = 2 atau x = 6' },
      { id: 'D', text: 'x = -2 atau x = -6' }
    ],
    correctAnswer: 'A',
    explanation: '(x - 3)(x - 4) = 0 sehingga x = 3 atau x = 4.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Persamaan Kuadrat (Fase E)'
  },
  {
    id: 'diag-q8',
    topicId: 'diagnostic',
    questionText: 'Titik puncak dari grafik fungsi kuadrat f(x) = x² - 4x + 1 adalah...',
    mathExpression: 'f(x) = x^2 - 4x + 1 \\implies P(x_p, y_p) = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(2, -3)' },
      { id: 'B', text: '(-2, 13)' },
      { id: 'C', text: '(4, 1)' },
      { id: 'D', text: '(2, 3)' }
    ],
    correctAnswer: 'A',
    explanation: 'x_p = -b/(2a) = -(-4)/(2) = 2. y_p = 2² - 4(2) + 1 = 4 - 8 + 1 = -3. Jadi titik puncak adalah (2, -3).',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Fungsi Kuadrat (Fase E)'
  },

  // Topic Assessment Questions: Fungsi Kuadrat
  {
    id: 'fk-q1',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Grafik fungsi kuadrat f(x) = -2x² + 8x - 5 memiliki kurva yang...',
    mathExpression: 'f(x) = -2x^2 + 8x - 5',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Terbuka ke atas dan memiliki nilai minimum' },
      { id: 'B', text: 'Terbuka ke bawah dan memiliki nilai maksimum' },
      { id: 'C', text: 'Terbuka ke atas dan memiliki nilai maksimum' },
      { id: 'D', text: 'Membuka ke kanan' }
    ],
    correctAnswer: 'B',
    explanation: 'Karena koefisien a = -2 < 0, parabola terbuka ke bawah dan memiliki titik balik tertinggi (nilai maksimum).',
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
      { id: 'A', text: 'x = -2' },
      { id: 'B', text: 'x = 2' },
      { id: 'C', text: 'x = 4' },
      { id: 'D', text: 'x = -4' }
    ],
    correctAnswer: 'B',
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
    explanation: 'D = b² - 4ac = (-6)² - 4(1)(9) = 36 - 36 = 0. Artinya kurva menyinggung sumbu X di tepat satu titik.',
    points: 10,
    difficulty: 'MOTS',
    conceptTag: 'Diskriminan Parabola'
  },
  {
    id: 'fk-q4',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Tinggi h (dalam meter) sebuah roket mainan setelah t detik dimodelkan dengan fungsi h(t) = 40t - 5t². Tinggi maksimum yang dicapai roket tersebut adalah...',
    mathExpression: 'h(t) = 40t - 5t^2 \\implies h_{\\text{maks}} = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '60 meter' },
      { id: 'B', text: '80 meter' },
      { id: 'C', text: '100 meter' },
      { id: 'D', text: '120 meter' }
    ],
    correctAnswer: 'B',
    explanation: 'Waktu puncak t = -b/(2a) = -40/(2 × -5) = 4 detik. Ketinggian maksimum h(4) = 40(4) - 5(4)² = 160 - 5(16) = 160 - 80 = 80 meter.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Penerapan Nilai Ekstrem Kontekstual'
  },
  {
    id: 'fk-q5',
    topicId: 'topic-fungsi-kuadrat',
    questionText: 'Sebuah fungsi kuadrat memotong sumbu X di titik (1, 0) dan (5, 0), serta melalui titik (0, 10). Rumus fungsi kuadrat tersebut adalah...',
    mathExpression: 'f(x) = a(x - x_1)(x - x_2)',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'f(x) = 2x² - 12x + 10' },
      { id: 'B', text: 'f(x) = x² - 6x + 5' },
      { id: 'C', text: 'f(x) = 2x² + 12x - 10' },
      { id: 'D', text: 'f(x) = -2x² + 12x - 10' }
    ],
    correctAnswer: 'A',
    explanation: 'f(x) = a(x - 1)(x - 5). Titik (0, 10) → 10 = a(0 - 1)(0 - 5) → 10 = 5a → a = 2. Maka f(x) = 2(x² - 6x + 5) = 2x² - 12x + 10.',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Menyusun Fungsi Kuadrat'
  },

  // Prerequisite / Remedial Assessment Questions: Pemfaktoran Aljabar
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
    explanation: 'FPB dari 8 dan 12 adalah 4; variabel persekutuan pangkat terkecil adalah x² dan y. Sehingga faktornya adalah 4x²y(2x - 3y).',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'FPB Aljabar'
  },
  {
    id: 'pf-q2',
    topicId: 'topic-pemfaktoran',
    questionText: 'Faktorisasi lengkap dari 9x² - 49 adalah...',
    mathExpression: '9x^2 - 49 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(3x + 7)(3x - 7)' },
      { id: 'B', text: '(9x + 7)(x - 7)' },
      { id: 'C', text: '(3x - 7)²' },
      { id: 'D', text: '(3x + 49)(3x - 1)' }
    ],
    correctAnswer: 'A',
    explanation: '(3x)² - (7)² = (3x + 7)(3x - 7). Selisih dua kuadrat.',
    points: 10,
    difficulty: 'LOTS',
    conceptTag: 'Selisih Dua Kuadrat'
  },
  {
    id: 'pf-q3',
    topicId: 'topic-pemfaktoran',
    questionText: 'Hasil pemfaktoran dari x² + 2x - 24 adalah...',
    mathExpression: 'x^2 + 2x - 24 = ?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '(x + 6)(x - 4)' },
      { id: 'B', text: '(x - 6)(x + 4)' },
      { id: 'C', text: '(x + 8)(x - 3)' },
      { id: 'D', text: '(x - 12)(x + 2)' }
    ],
    correctAnswer: 'A',
    explanation: 'Cari dua bilangan dengan p + q = 2 dan p × q = -24. Bilangan tersebut adalah +6 dan -4. Jadi (x + 6)(x - 4).',
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
    explanation: '3 × 8 = 24. Dua bilangan yang dikali = 24 dan ditambah = 10 adalah 4 dan 6. Pecah 10x: 3x² + 6x + 4x + 8 = 3x(x + 2) + 4(x + 2) = (3x + 4)(x + 2).',
    points: 10,
    difficulty: 'HOTS',
    conceptTag: 'Faktorisasi ax² + bx + c'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'as-diagnostic',
    title: 'Asesmen Diagnostik Awal Matematika (Fase A - F)',
    type: 'DIAGNOSTIC',
    durationMinutes: 15,
    passingScore: 75,
    totalQuestions: 8
  },
  {
    id: 'as-fungsi-kuadrat',
    topicId: 'topic-fungsi-kuadrat',
    title: 'Asesmen Kompetensi: Fungsi Kuadrat & Titik Ekstrem',
    type: 'TOPIC',
    durationMinutes: 20,
    passingScore: 75,
    totalQuestions: 5
  },
  {
    id: 'as-pemfaktoran-prereq',
    topicId: 'topic-pemfaktoran',
    title: 'Asesmen Prasyarat & Remedial: Pemfaktoran Aljabar',
    type: 'PREREQUISITE',
    durationMinutes: 15,
    passingScore: 75,
    totalQuestions: 4
  }
];
