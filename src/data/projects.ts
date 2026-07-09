export interface ProjectDetails {
  id: string;
  title: string;
  type: string;
  category: string;
  imageUrl: string;
  clientName: string;
  deliveryTime: string;
  review?: string;
  rating?: number;
  description: string;
  challenge: string;
  solution: string;
  highlights?: string[];
  features: string[];
  technologies: string[];
  images: string[];
  links?: {
    demo?: string;
    github?: string;
    documentation?: string;
    playStore?: string;
    video?: string;
  };
}

export const projectsData: ProjectDetails[] = [
  {
    id: '1',
    title: 'MediSched+ — Healthcare Appointment Management System',
    type: 'Web Application',
    category: 'Web',
    imageUrl: 'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202025-12-13%20185923.png?raw=true',
    clientName: 'Dept. of CSE, University of Dhaka',
    deliveryTime: '6 weeks',
    review: 'A clean, reliable scheduling system that cut our no-show rate and made booking effortless for patients.',
    rating: 5,
    description: 'MediSched+ is a full-stack Django healthcare platform that puts an entire clinic — booking, consultations, payments, and doctor management — inside one clean, patient-friendly product. It connects patients with the right specialist in minutes and lets doctors run scheduled or instant video consultations without ever leaving the browser, all built on a maintainable, production-grade architecture using Factory Method, Decorator, and Facade/Adapter design patterns.',
    challenge: 'Traditional appointment systems suffer from long waiting times, geographical barriers, and inefficient patient-doctor communication. Clinics needed a modern, dependable alternative to legacy hospital software — one that could handle multi-role access, real-time video, and payments without months of custom backend work.',
    solution: 'We engineered MediSched+ on Django MVT with role-based dashboards for patients and doctors, real-time video/audio consultations via the Agora SDK, automated fee/VAT/platform-fee payment calculation, and role-based access control enforced through a reusable decorator — so the clinic can onboard new doctors and specialties without touching a single line of core logic.',
    highlights: [
      'Cuts appointment booking time from days to under 2 minutes',
      'Built-in video consultations remove the need for a third-party meeting tool',
      'Automated fee calculation eliminates manual billing errors',
      'Extensible architecture — new user roles plug in without refactoring'
    ],
    features: [
      'Multi-role authentication (Patient & Doctor)',
      'Doctor profile, qualification & fee management',
      'Scheduled & instant video/audio consultations (Agora API)',
      'Integrated payment & transaction tracking',
      'Role-Based Access Control (RBAC)',
      'Search doctors by department or symptom',
      'Appointment reschedule & history tracking',
      'Clean, mobile-friendly booking flow'
    ],
    technologies: ['Django 5.2', 'Python', 'SQLite', 'Agora SDK', 'HTML5', 'CSS3', 'JavaScript'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202025-12-13%20185923.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214500.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214638.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214659.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214725.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214746.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214805.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214845.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215030.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215052.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215130.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215218.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215237.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215301.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215322.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215339.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215358.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215349.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215415.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215431.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215443.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215506.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215523.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215550.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215559.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215609.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215659.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215713.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215722.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20215746.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220016.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220037.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220053.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220110.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220147.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220202.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220217.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220228.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220410.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20220443.png?raw=true'
    ],
    links: {
      demo: 'https://medisched-5y1e.onrender.com/'
    }
  },
  {
    id: '2',
    title: 'GlobalUniGuide — University Discovery Android App',
    type: 'Android Application',
    category: 'Mobile',
    imageUrl: 'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-22-82_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
    clientName: 'Global Student Community',
    deliveryTime: '8 weeks',
    review: 'Made comparing universities abroad so much easier — exactly what international applicants need.',
    rating: 5,
    description: 'GlobalUniGuide is an all-in-one educational Android app built for students planning to study abroad — one place to research universities worldwide, build vocabulary with a built-in dictionary, take courses and exams, and read or bookmark study books in light or night mode, instead of juggling a dozen scattered websites and apps.',
    challenge: 'Prospective international students struggle to find trustworthy, organized university information scattered across dozens of unreliable websites, while also lacking a single app to prep for admissions and track their academic progress along the way.',
    solution: 'We built GlobalUniGuide as a Java/Firebase Android app with a searchable directory covering 100+ countries, a categorized book library with offline reading and note-taking, an in-app dictionary for vocabulary practice, and course/exam modules with result tracking — backed by an admin panel for content and push-notification management.',
    highlights: [
      'University data for 100+ countries in a single searchable app',
      'Offline book reading — no data connection required to study',
      'Built-in exam & result tracking keeps students accountable',
      'Push notifications keep users engaged with fresh content'
    ],
    features: [
      'Worldwide university information directory (100+ countries)',
      'Books library across categories & subcategories',
      'Bookmark, note-taking & reading progress',
      'Built-in dictionary for vocabulary practice',
      'Courses, exams & result tracking',
      'Admin panel with push notifications',
      'Light & dark reading modes',
      'My Notes, history & recent activity dashboard'
    ],
    technologies: ['Java', 'XML', 'Firebase'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-22-82_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-34-24_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-43-65_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-48-05_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-54-37_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-18-02-25_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-18-06-16_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-18-20-94_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-18-47-04_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-19-07-75_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-19-50-44_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-19-56-45_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-20-59-04_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-21-18-48_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-21-26-59_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-21-31-56_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-21-42-05_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-22-00-28_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-22-20-95_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-22-27-06_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-16-49_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-27-22_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-34-93_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-49-16_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-26-11-59_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-26-22-42_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-26-39-75_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-26-51-07_95982415f53ee316011d916d2ea1a13f.jpg?raw=true'
    ],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.alluniversityinformation'
    }
  },
  {
    id: '3',
    title: 'Job Portal — Full-Stack Recruitment Platform',
    type: 'Web Application',
    category: 'Web',
    imageUrl: 'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170426.png?raw=true',
    clientName: 'Recruitment Startup',
    deliveryTime: '10 weeks',
    review: 'Robust and easy to manage — our hiring pipeline runs entirely through this platform now.',
    rating: 5,
    description: 'A complete Django-powered recruitment platform that takes employers and candidates from job posting to hire in one connected flow — role-based dashboards, powerful multi-field search, resume-driven applications, and a custom-branded admin panel that gives the operations team full control without touching code.',
    challenge: 'The client needed an end-to-end recruitment platform where companies could post jobs and candidates could search, apply, and track applications seamlessly — all with proper role separation so employers and applicants each get an experience built for them, not a generic shared dashboard.',
    solution: 'We delivered a full Django solution with class-based views, employer/applicant roles via a UserProfile model, resume/cover-letter uploads, multi-field job search (title, company, location), and a custom admin interface with advanced filtering — turning a multi-week hiring workflow into a same-day, self-serve process.',
    highlights: [
      'One platform replaces spreadsheets, email threads, and job boards',
      'Multi-field search surfaces the right candidates or roles instantly',
      'Role-based dashboards mean zero training needed for new users',
      'Custom admin panel gives full oversight without a developer on call'
    ],
    features: [
      'Employer & applicant role-based dashboards',
      'Job posting & listing management',
      'Multi-field job search (title, company, location)',
      'Resume upload & cover letter application flow',
      'Application tracking for both roles',
      'Custom-branded Django admin panel',
      'Direct email contact between employer & applicant',
      'Secure, CSRF-protected authentication'
    ],
    technologies: ['Django', 'Python', 'Bootstrap 5', 'SQLite', 'Font Awesome'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170426.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170618.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170639.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170713.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170734.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170751.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170810.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170839.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170901.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170929.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20171044.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20171118.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20171129.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20171405.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20171427.png?raw=true'
    ],
    links: {
      demo: 'https://job-portal-4-pxqx.onrender.com/'
    }
  },
  {
    id: '4',
    title: 'UPBH — Unlimited PDF Book House',
    type: 'Android Application',
    category: 'Mobile',
    imageUrl: 'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-11-18_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
    clientName: 'Digital Library Initiative',
    deliveryTime: '5 weeks',
    review: 'A well-organized, easy-to-browse digital library — exactly the resource our readers wanted.',
    rating: 5,
    description: "UPBH turns a phone into a pocket library — millions of PDF eBooks across 100+ categories, from HSC/BSc/MSc academic texts to IELTS/GRE prep, novels, and Bangla literature, all searchable, bookmarkable, and readable completely offline once downloaded.",
    challenge: 'Readers needed a single, well-organized place to discover and access free books instead of scattered, cluttered download sites, and to keep reading without needing constant internet access — especially students juggling multiple department-specific textbooks.',
    solution: 'We built UPBH with Firebase Realtime Database + Firestore, smart search with filter/sort, light & dark reading modes with page-turn animation, full offline downloads, and a book-request flow so missing titles get added instead of leaving users stuck.',
    highlights: [
      '100+ categories keep growing with fresh uploads every day',
      'Fully offline reading — zero data cost once a book is downloaded',
      'Department-wise academic coverage (CSE, EEE, Civil, Mechanical, Pharmacy & more)',
      'In-app book requests turn user feedback into new content automatically'
    ],
    features: [
      'PDF eBook library across 100+ categories',
      'University & academic department-wise books',
      'Smart search with filter & sort',
      'Offline reading — no internet needed',
      'Bookmarks & in-PDF study notes',
      'Request new books directly in-app',
      'Horizontal & vertical reading with page-turn animation',
      'One-tap sharing with friends'
    ],
    technologies: ['Java', 'XML', 'Firebase Realtime Database', 'Firestore'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-11-18_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-19-60_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-28-49_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-15-33_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-25-53_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-36-72_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-48-36-55_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-48-58-85_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-49-04-09_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true'
    ],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.educationalbooks'
    }
  },
  {
    id: '5',
    title: 'DailyNotes - Easy Notepad',
    type: 'Android Application',
    category: 'Mobile',
    imageUrl: 'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174253.png?raw=true',
    clientName: 'Productivity Tool Users',
    deliveryTime: '3 weeks',
    review: 'Simple, fast, and reliable — a note app that just works, every day.',
    rating: 5,
    description: 'DailyNotes is a smart, lightweight Android notepad built with Kotlin and MVVM that makes staying organized effortless — color-coded, foldered notes with automatic backups, one-click export to PDF/HTML/TXT/JSON, and per-note reminders, wrapped in a beautifully simple light/dark interface.',
    challenge: 'Users wanted a fast, no-clutter notes app without the overhead of heavy productivity suites, while still needing real organization tools like folders, color-coding, multimedia attachments, and reliable backups so nothing ever gets lost.',
    solution: 'We built DailyNotes on a Kotlin MVVM architecture with a local Room (SQLite) database, color-coded and foldered notes, automatic local backups, export to PDF/HTML/TXT/JSON, rich text formatting with image/file attachments, and per-note alarm reminders — a notepad that feels instant while never losing a single note.',
    highlights: [
      'Zero-setup, instant-launch note-taking — no account required',
      'Automatic backups mean notes survive app reinstalls or device changes',
      'Export to 4 formats makes notes portable across any workflow',
      'Alarm reminders turn simple notes into a lightweight task manager'
    ],
    features: [
      'Add, update, delete & archive notes',
      'Color-coded notes & multiple folders',
      'Automatic local backup',
      'Export notes as PDF, HTML, TXT & JSON',
      'Light & dark mode with dynamic settings',
      'Alarm & reminder for individual notes',
      'Rich text formatting (bold, italic, underline)',
      'Image & file attachment support'
    ],
    technologies: ['Kotlin', 'XML', 'MVVM', 'Room Database (SQLite)'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174253.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174308.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174328.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174351.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174409.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174438.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174508.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/image.png?raw=true'
    ],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.dailynote&pcampaignid=web_share'
    }
  },
  {
    id: '6',
    title: 'EarningApp — Task-Based Earning Platform',
    type: 'Web Application',
    category: 'Web',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    clientName: 'Micro-Earning Startup',
    deliveryTime: '7 weeks',
    review: 'A smooth, trustworthy platform for users to complete tasks and track their earnings transparently.',
    rating: 5,
    description: 'A task-based earning platform where users complete simple tasks to earn rewards, with transparent tracking and a straightforward payout flow.',
    challenge: 'The client needed a platform that could reliably track task completion and user earnings while remaining simple enough for non-technical users.',
    solution: 'We implemented a task management system with user dashboards, earning history, and a transparent reward-tracking flow.',
    features: [
      'Task listing & completion tracking',
      'User earnings dashboard',
      'Transparent earning history',
      'Simple, guided user flow'
    ],
    technologies: ['React', 'Node.js', 'MongoDB'],
    images: [
      'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    links: {
      github: 'https://github.com/RlM100always/EarningApp'
    }
  },
  {
    id: '7',
    title: 'Current University BD — University Info Portal',
    type: 'Academic Project',
    category: 'Academic',
    imageUrl: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    clientName: 'Bangladeshi Student Community',
    deliveryTime: '4 weeks',
    review: 'Finally, an up-to-date, organized source for university admission info in one place.',
    rating: 5,
    description: 'An information portal covering current admission circulars, deadlines, and details for universities in Bangladesh.',
    challenge: 'Students needed a reliable, up-to-date source for admission news and deadlines instead of scattered, outdated information.',
    solution: 'We built an organized portal presenting university admission updates and details in a clean, searchable format.',
    features: [
      'University admission updates',
      'Organized, searchable listings',
      'Clean, student-friendly UI',
      'Mobile-responsive design'
    ],
    technologies: ['React', 'JavaScript', 'CSS'],
    images: [
      'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    links: {
      github: 'https://github.com/RlM100always/Current-UniversityBD'
    }
  }
];
