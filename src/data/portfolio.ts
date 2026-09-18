export const profile = {
  firstName: "Andhika",
  lastName: "Rafi",
  roles: ["Network Engineer", "System Administrator", "IT Support"],
  desc: "Berfokus pada keamanan siber, dukungan teknis IT, dan administrasi sistem. Membantu menjaga keamanan serta kelancaran operasional teknologi informasi.",
  location: "Bogor, Jawa Barat, Indonesia",
  email: "andhikarafi321@gmail.com",
  whatsapp: "+62 857-7222-8046",
  whatsappLink: "https://wa.me/6285772228046",
  github: "https://github.com/dhiksn",
  linkedin: "https://linkedin.com/in/andhikarafi",
  instagram: "https://instagram.com/andhika_itsu",
  cv: "/assets/docs/Andhika_CV.pdf",
  photo: "/assets/img/cover2.webp",
};

export const about = {
  intro:
    "Saya adalah siswa TJKT di SMK Wikrama Bogor yang memiliki minat besar pada System Administration dan IT Support. Saya senang mempelajari cara menjaga keamanan sistem serta memastikan perangkat dan jaringan berjalan dengan optimal.",
  paragraphs: [
    "Saya memiliki pengalaman dasar dalam troubleshooting hardware dan software, administrasi Linux, serta konfigurasi jaringan menggunakan MikroTik dan Cisco. Saya terus mengembangkan kemampuan melalui praktik dan proyek nyata.",
    "Saat ini saya fokus mempelajari keamanan jaringan dan administrasi sistem. Saya percaya bahwa sistem yang aman dan andal merupakan fondasi penting bagi setiap organisasi di era digital.",
  ],
  counters: [
    { label: "Proyek Selesai", value: 4 },
    { label: "Sertifikat", value: 8 },
  ],
};

export const skills = [
  "Mikrotik",
  "Cisco",
  "Ubuntu Server",
  "Nginx",
  "Apache",
  "Git",
  "DHCP",
  "VLAN",
  "DNS Server",
];

export const education = [
  {
    school: "Sekolah Dasar Amaliah, Bogor",
    role: "Siswa",
    logo: "/assets/img/edu/amaliah.webp",
    start: "2015",
    end: "2021",
    present: false,
    whiteBg: true,
  },
  {
    school: "Sekolah Menengah Pertama Islam Terpadu Roudlotul Jannah, Bogor",
    role: "Siswa",
    logo: "/assets/img/edu/smpit-rj.png",
    start: "2021",
    end: "2024",
    present: false,
    whiteBg: true,
  },
  {
    school: "Sekolah Menengah Kejuruan Wikrama, Bogor",
    role: "TJKT — Kelas 11",
    logo: "/assets/img/edu/wikrama.png",
    start: "Juni 2024",
    end: "Sekarang",
    present: true,
    whiteBg: false,
  },
];

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDesc?: string;
  tech?: string[];
  image: string;
  github?: string;
  demo?: string;
  demotype?: "download";
  readUrl?: string;
  downloadFile?: string;
  pdfFile?: string;
};

export const projects: Project[] = [
  {
    id: 4,
    slug: "autodeploy-ai",
    title: "AutoDeploy AI",
    description:
      "CLI tool yang mengotomatisasi deploy ke GitHub — git init otomatis, AI generate commit message via Groq/OpenAI/Ollama, dan auto push dalam satu command.",
    longDesc:
      "AutoDeploy AI adalah global CLI yang menyederhanakan workflow git deploy. Cukup jalankan `autodeploy` dari folder mana pun — tool ini akan otomatis git init jika belum ada, validasi repo GitHub, generate commit message menggunakan AI (Groq, OpenAI, atau Ollama), lalu push ke GitHub.",
    tech: ["Python", "Groq", "OpenAI", "Ollama", "Git", "PyPI"],
    image: "/assets/img/autodeploy-thumb.webp",
    github: "https://github.com/dhiksn/auto-deploy",
    demo: "https://pypi.org/project/autodeploy-ai/",
  },
  {
    id: 3,
    slug: "dokumentasi-asat",
    title: "Dokumentasi ASAT Praktik TJKT",
    description:
      "Dokumentasi lengkap hasil pelaksanaan ASAT (Asesmen Sumatif Akhir Tahun) Praktik jurusan Teknik Jaringan Komputer dan Telekomunikasi.",
    demotype: "download",
    image: "/assets/img/asat-thumb.webp",
    downloadFile: "/assets/docs/ASAT.docx",
    pdfFile: "/assets/docs/ASAT.pdf",
  },
  {
    id: 2,
    slug: "dokumentasi-superlab",
    title: "Dokumentasi Superlab ASJ",
    description:
      "Implementasi layanan server Debian 10 meliputi SSH, DHCP, DNS, FTP, Web Server, dan Mail Server. Fokus pada administrasi Linux dan troubleshooting sistem.",
    demotype: "download",
    image: "/assets/img/superlab-thumb.webp",
    downloadFile: "/assets/docs/Superlab.docx",
    pdfFile: "/assets/docs/Superlab.pdf",
  },
  {
    id: 1,
    slug: "raisaver",
    title: "RaiSaver",
    description:
      "Platform download video YouTube, Tiktok, dan Instagram tersedia sebagai aplikasi Flutter (Android/iOS) dan website, dengan backend FastAPI dan dukungan resolusi hingga 4K.",
    longDesc:
      "RaiSaver adalah platform downloader YouTube, Tiktok, dan Instagram yang hadir dalam dua versi: aplikasi mobile Flutter untuk Android/iOS dengan UI glassmorphism, dan website yang bisa diakses langsung di browser. Backend dibangun dengan FastAPI dan yt-dlp, serta FFmpeg untuk merging video dan audio secara otomatis.",
    tech: ["Flutter", "HTML", "JavaScript", "Python", "yt-dlp", "FFmpeg"],
    image: "/assets/img/raisaver.png",
    github: "https://github.com/dhiksn/downloader",
    demo: "https://raisaver.netlify.app/",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const certificates = [
  { id: 1, title: "Cisco Dasar", image: "/sertifikat/cisco.webp" },
  { id: 2, title: "Cyber Security Dasar", image: "/sertifikat/cyber.webp" },
  { id: 3, title: "Jaringan Komputer Dasar", image: "/sertifikat/jaringan.webp" },
  { id: 4, title: "Linux", image: "/sertifikat/linux.webp" },
  { id: 5, title: "Virtual Machine Fundamental", image: "/sertifikat/vm.webp" },
  { id: 6, title: "Network Fundamental", image: "/sertifikat/n-fun.webp" },
  { id: 7, title: "Introduction to CyberSecurity", image: "/sertifikat/introduction.webp" },
  { id: 8, title: "Introduction to Kali Linux Basics", image: "/sertifikat/kali-linux.webp" },
];
