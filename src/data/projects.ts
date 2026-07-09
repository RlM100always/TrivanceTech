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
    description: 'A full-stack Django healthcare platform connecting patients with doctors for scheduled and instant video consultations, built around Factory Method, Decorator, and Facade/Adapter design patterns for a maintainable, extensible architecture.',
    challenge: 'Traditional appointment systems suffer from long waiting times, geographical barriers, and inefficient patient-doctor communication — clinics needed a modern, dependable alternative without legacy hospital software overhead.',
    solution: 'We built MediSched+ on Django MVT with role-based dashboards for patients and doctors, real-time video/audio consultations via the Agora SDK, integrated fee/VAT/platform-fee payment calculation, and role-based access control enforced through a reusable decorator.',
    features: [
      'Multi-role authentication (Patient & Doctor)',
      'Doctor profile, qualification & fee management',
      'Scheduled & instant video/audio consultations (Agora API)',
      'Integrated payment & transaction tracking',
      'Role-Based Access Control (RBAC)',
      'Search doctors by department or symptom'
    ],
    technologies: ['Django 5.2', 'Python', 'SQLite', 'Agora SDK', 'HTML5', 'CSS3', 'JavaScript'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202025-12-13%20185923.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214500.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214638.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214659.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214725.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/medisched/Screenshot%202026-01-13%20214746.png?raw=true'
    ],
    links: {
      demo: 'https://medisched-5y1e.onrender.com/',
      github: 'https://github.com/RlM100always/MediSched-',
      video: 'https://drive.google.com/file/d/11F2RGwGhlgrLPCdUoSuOsynVfDvypIaA/view?usp=drive_link'
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
    description: 'A comprehensive educational Android app that helps university students research global universities, practice vocabulary with a built-in dictionary, take courses and exams, and read/bookmark books across categories in light or night mode.',
    challenge: 'Prospective international students struggle to find trustworthy, organized university information scattered across dozens of sites, while also lacking a single app to prep and track their academic progress.',
    solution: 'We built GlobalUniGuide as a Java/Firebase Android app with a searchable university directory, a categorized book library with offline reading and note-taking, an in-app dictionary, and course/exam modules with result tracking — plus an admin panel for content and notification management.',
    features: [
      'Worldwide university information directory',
      'Books library across categories & subcategories',
      'Bookmark, note-taking & reading progress',
      'Built-in dictionary for vocabulary practice',
      'Courses, exams & result tracking',
      'Admin panel with push notifications'
    ],
    technologies: ['Java', 'XML', 'Firebase'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-22-82_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-34-24_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-43-65_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/User/Screenshot_2025-01-26-11-17-48-05_92a872e6c8130c21f03b274d6cc23fbd.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-16-49_95982415f53ee316011d916d2ea1a13f.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/globaluniguide/Admin/Screenshot_2025-01-26-11-25-27-22_95982415f53ee316011d916d2ea1a13f.jpg?raw=true'
    ],
    links: {
      github: 'https://github.com/RlM100always/GlobalUniGuide/tree/master',
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.alluniversityinformation',
      video: 'https://drive.google.com/file/d/1QsAZZL6_ErVE52QN1chiLu8QiVj13lo4/view'
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
    description: 'A Django-based job portal connecting employers and job seekers with role-based dashboards, multi-field job search, and a complete application-to-hire workflow, including a custom-branded admin panel.',
    challenge: 'The client needed an end-to-end recruitment platform where companies could post jobs and candidates could search, apply, and track applications seamlessly, all with proper role separation.',
    solution: 'We delivered a full Django solution with class-based views, employer/applicant roles via a UserProfile model, resume/cover-letter uploads, multi-field job search (title, company, location), and a custom admin interface with advanced filtering.',
    features: [
      'Employer & applicant role-based dashboards',
      'Job posting & listing management',
      'Multi-field job search (title, company, location)',
      'Resume upload & cover letter application flow',
      'Application tracking for both roles',
      'Custom-branded Django admin panel'
    ],
    technologies: ['Django', 'Python', 'Bootstrap 5', 'SQLite', 'Font Awesome'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170426.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170618.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170639.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170713.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170734.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/job_portal/Screenshot%202025-07-26%20170751.png?raw=true'
    ],
    links: {
      demo: 'https://job-portal-4-pxqx.onrender.com/',
      github: 'https://github.com/RlM100always/job-portal',
      video: 'https://drive.google.com/file/d/1A4gClbqfhehrr_q8tSPdA34dlpJN7z9P/view'
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
    description: 'An Android digital library app offering millions of PDF eBooks across 100+ categories — academic, professional, and literary — with offline reading, bookmarking, and daily fresh uploads.',
    challenge: 'Readers needed a single, well-organized place to discover and access free books instead of scattered, cluttered download sites, and to keep reading without needing constant internet access.',
    solution: 'We built UPBH with Firebase Realtime Database + Firestore, smart search with filter/sort, light & dark reading modes with page-turn animation, offline downloads, and a book-request flow for missing titles.',
    features: [
      'PDF eBook library across 100+ categories',
      'University & academic department-wise books',
      'Smart search with filter & sort',
      'Offline reading — no internet needed',
      'Bookmarks & in-PDF study notes',
      'Request new books directly in-app'
    ],
    technologies: ['Java', 'XML', 'Firebase Realtime Database', 'Firestore'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-11-18_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-19-60_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-45-28-49_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-15-33_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-25-53_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/EducationalBook/Screenshot/Screenshot_2025-01-24-19-46-36-72_3a24a73f6a9ac5d7365b7e1fde02371c.jpg?raw=true'
    ],
    links: {
      github: 'https://github.com/RlM100always/UPBH-Unlimited-Pdf-Book-House',
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.educationalbooks',
      video: 'https://drive.google.com/file/d/1KM-1wsNOjYppvT2ZMYeVspK-fagTX_Na/view'
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
    description: 'A smart, lightweight Android notepad app built with Kotlin and MVVM, offering color-coded notes, folders, auto backup, multi-format export, and reminders for effortless daily organization.',
    challenge: 'Users wanted a fast, no-clutter notes app without the overhead of heavy productivity suites, while still needing organization tools like folders, color-coding, and reliable backups.',
    solution: 'We built DailyNotes on a Kotlin MVVM architecture with a local Room (SQLite) database, color-coded and foldered notes, automatic local backups, export to PDF/HTML/TXT/JSON, and per-note alarm reminders.',
    features: [
      'Add, update, delete & archive notes',
      'Color-coded notes & multiple folders',
      'Automatic local backup',
      'Export notes as PDF, HTML, TXT & JSON',
      'Light & dark mode with dynamic settings',
      'Alarm & reminder for individual notes'
    ],
    technologies: ['Kotlin', 'XML', 'MVVM', 'Room Database (SQLite)'],
    images: [
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174253.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174308.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174328.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174351.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174409.png?raw=true',
      'https://github.com/RlM100always/Hisab/blob/main/dailynotes/Screenshot%202025-07-11%20174438.png?raw=true'
    ],
    links: {
      github: 'https://github.com/RlM100always',
      playStore: 'https://play.google.com/store/apps/details?id=com.techtravelcoder.dailynote&pcampaignid=web_share',
      video: 'https://drive.google.com/file/d/1odUPnFmQ-dppIlhmc23CDLpgVs6mkThW/view'
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
