import React from 'react';
import { Code, Smartphone, Brain, Shield, Database, Globe, Zap, CheckCircle, ArrowRight, GraduationCap, Palette, Brush, Megaphone, Code2, Package, Bot, Wand2, Bug, Search, Store, PenLine, Newspaper, Target, Layout, Clapperboard, Feather, Mic, BookOpen, Image, Images, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

const Services: React.FC = () => {
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };
  const services = [
    {
      id: 'web',
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with cutting-edge technologies and modern frameworks.',
      features: [
        'Responsive Design & Mobile-First Approach',
        'Modern Frameworks (React, Vue, Angular)',
        'SEO Optimization & Performance',
        'E-commerce Solutions',
        'Content Management Systems',
        'Progressive Web Apps (PWA)'
      ],
      technologies: ['React', 'Next.js', 'Vue.js', 'Node.js', 'PHP', 'Python'],
      pricing: 'Starting from $500',
      deliveryTime: '4-8 weeks',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/17.jpg'
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android with exceptional user experience.',
      features: [
        'Native iOS & Android Development',
        'Cross-platform Solutions (React Native, Flutter)',
        'UI/UX Design Excellence',
        'App Store Optimization',
        'Push Notifications & Analytics',
        'Offline Functionality'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java'],
      pricing: 'Starting from $500',
      deliveryTime: '6-12 weeks',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/3.jpg'
    },
    // {
    //   id: 'cloud',
    //   icon: Cloud,
    //   title: 'Cloud Solutions',
    //   description: 'Scalable cloud infrastructure, migration services, and DevOps solutions for modern businesses.',
    //   features: [
    //     'AWS & Azure Cloud Services',
    //     'DevOps & CI/CD Pipelines',
    //     'Microservices Architecture',
    //     'Auto-scaling & Load Balancing',
    //     'Cloud Migration Services',
    //     'Monitoring & Analytics'
    //   ],
    //   technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    //   pricing: 'Starting from $3,000',
    //   deliveryTime: '3-6 weeks',
    //   color: 'from-green-500 to-green-700',
    //   bgColor: 'bg-green-50 dark:bg-green-900/20',
    //   textColor: 'text-green-600 dark:text-green-400',
    //   image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'
    // },
    {
      id: 'ai',
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by artificial intelligence and machine learning technologies.',
      features: [
        'Custom AI Model Development',
        'Data Analytics & Insights',
        'Process Automation',
        'Predictive Analysis',
        'Natural Language Processing',
        'Computer Vision Solutions'
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI'],
      pricing: 'Starting from $500',
      deliveryTime: '8-16 weeks',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/15.jpg'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions and vulnerability assessments to protect your digital assets.',
      features: [
        'Security Audits & Assessments',
        'Penetration Testing',
        'Compliance Management',
        'Risk Assessment & Mitigation',
        'Security Training',
        '24/7 Monitoring Services'
      ],
      technologies: ['Nessus', 'Metasploit', 'Wireshark', 'OWASP', 'Burp Suite'],
      pricing: 'Starting from $500',
      deliveryTime: '2-4 weeks',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/5.jpg'
    },
    {
      id: 'database',
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design, optimization, and management for scalable applications.',
      features: [
        'Database Design & Architecture',
        'Performance Tuning & Optimization',
        'Data Migration Services',
        'Backup & Recovery Solutions',
        'Data Warehousing',
        'Real-time Analytics'
      ],
      technologies: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase','Sqlite'],
      pricing: 'Starting from $500',
      deliveryTime: '2-6 weeks',
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/7.jpg'
    },
    {
      id: 'academic',
      icon: GraduationCap,
      title: 'Academic Projects & Thesis',
      description: 'Professional assistance for university students with projects, thesis, and assignments.',
      features: [
        'Research Projects & Methodology',
        'Thesis Writing & Documentation',
        'Assignment Help & Consultation',
        'Data Analysis & Visualization',
        'Literature Review & Citations',
        'Academic Presentation Design'
      ],
      technologies: ['SPSS', 'R', 'Python', 'LaTeX', 'Mendeley', 'EndNote'],
      pricing: 'Starting from $100',
      deliveryTime: '1-4 weeks',
      color: 'from-teal-500 to-teal-700',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/16.jpg'
    },
    {
      id: 'design',
      icon: Palette,
      title: 'UI & UX Design',
      description: 'Beautiful and intuitive user interfaces that deliver exceptional user experiences.',
      features: [
        'User Research & Analysis',
        'Wireframing & Prototyping',
        'Interactive Design Systems',
        'Usability Testing',
        'Brand Identity Design',
        'Mobile-First Design'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle', 'Framer'],
      pricing: 'Starting from $500',
      deliveryTime: '2-5 weeks',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/10.jpg'
    },
    {
      id: 'personal-branding',
      icon: Brush,
      title: 'Personal Branding & Portfolio Websites',
      description: 'Stand out from the crowd with a stunning, conversion-focused personal brand and portfolio website — complete with a powerful admin dashboard so you can manage content, leads, and analytics without writing a single line of code.',
      features: [
        'Bespoke, Conversion-Focused Design',
        'Secure Admin Dashboard (CMS)',
        'Blog & Case-Study Management',
        'Lead Capture & Contact Forms',
        'SEO-Ready & Lightning Fast',
        'Mobile-First & Accessible'
      ],
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Sanity', 'Vercel'],
      pricing: 'Starting from $400',
      deliveryTime: '2-4 weeks',
      color: 'from-rose-500 to-rose-700',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/2.jpg'
    },
    {
      id: 'digital-marketing',
      icon: Megaphone,
      title: 'Digital Marketing',
      description: 'Grow your audience and revenue across every channel that matters — Facebook, Pinterest, Instagram, Telegram, and WhatsApp. We craft data-driven campaigns that turn scrolls into sales and followers into loyal customers.',
      features: [
        'Facebook & Instagram Ad Campaigns',
        'Pinterest & Telegram Growth',
        'WhatsApp Business Automation',
        'Content Strategy & Calendar',
        'Audience Targeting & Retargeting',
        'Monthly Performance Reports'
      ],
      technologies: ['Meta Business Suite', 'Canva', 'Hootsuite', 'Mailchimp', 'Google Analytics'],
      pricing: 'Starting from $250/mo',
      deliveryTime: 'Ongoing',
      color: 'from-fuchsia-500 to-fuchsia-700',
      bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/12.jpg'
    },
    {
      id: 'programming',
      icon: Code2,
      title: 'Programming Solutions',
      description: 'From quick scripts to full systems, our engineers solve your toughest coding challenges with clean, well-documented, and scalable code in the languages and stacks you already use.',
      features: [
        'Custom Script & Tool Development',
        'Algorithm & Logic Optimization',
        'Code Refactoring & Modernization',
        'API Integration & Automation',
        'Full-Stack Web Applications',
        'Clear Docs & Handover'
      ],
      technologies: ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C++'],
      pricing: 'Starting from $150',
      deliveryTime: '1-3 weeks',
      color: 'from-cyan-500 to-cyan-700',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/13.jpg'
    },
    {
      id: 'custom-software',
      icon: Package,
      title: 'Custom Software Development',
      description: 'Off-the-shelf tools slow you down. We build tailor-made software — desktop, web, or cloud — engineered around your exact workflows, so your business runs faster, smarter, and on your terms.',
      features: [
        'Bespoke Web & Desktop Apps',
        'Workflow & Process Automation',
        'Third-Party Integrations',
        'Scalable Cloud Architecture',
        'Role-Based Access Control',
        'Dedicated Support & Maintenance'
      ],
      technologies: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
      pricing: 'Starting from $800',
      deliveryTime: '6-14 weeks',
      color: 'from-violet-500 to-violet-700',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      textColor: 'text-violet-600 dark:text-violet-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/11.jpg'
    },
    {
      id: 'prompt-engineering',
      icon: Bot,
      title: 'Prompt Engineering',
      description: 'Unlock the true power of AI. We design, test, and optimize prompts and AI workflows that deliver consistent, high-quality results for your support, content, and operations — every single time.',
      features: [
        'Custom Prompt Libraries',
        'LLM Workflow Automation',
        'RAG & Knowledge-Base Setup',
        'AI Chatbot Personas',
        'Quality & Guardrail Testing',
        'Team AI Training'
      ],
      technologies: ['OpenAI', 'Claude', 'LangChain', 'Python', 'Vector DBs'],
      pricing: 'Starting from $300',
      deliveryTime: '1-2 weeks',
      color: 'from-amber-500 to-amber-700',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/0.jpg'
    },
    {
      id: 'vibe-coding',
      icon: Wand2,
      title: 'Vibe Coding & Product Engineering',
      description: 'Got an idea but not the code? We turn your vision into a working, shippable product — fast. From MVP to launch-ready SaaS, we engineer with speed, quality, and momentum.',
      features: [
        'Rapid MVP & Prototype Builds',
        'Full Product Lifecycle Engineering',
        'AI-Assisted Development',
        'UX-First Iteration',
        'Launch & Go-To-Market Support',
        'Scalable Architecture'
      ],
      technologies: ['React', 'Next.js', 'Supabase', 'Vercel', 'Framer', 'AI Tools'],
      pricing: 'Starting from $600',
      deliveryTime: '4-10 weeks',
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/8.jpg'
    },
    {
      id: 'bug-fixing',
      icon: Bug,
      title: 'Bug Fixing & Deployment Support',
      description: 'Broken build? Stuck deploy? Our experts diagnose, fix, and ship your code with confidence — so you stop firefighting and get back to building what matters.',
      features: [
        'Rapid Bug Diagnosis & Fixes',
        'CI/CD Pipeline Setup',
        'Cloud & Server Deployment',
        'Performance & Crash Fixes',
        'Rollback & Monitoring',
        'Handover & Best Practices'
      ],
      technologies: ['Git', 'Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Linux'],
      pricing: 'Starting from $100',
      deliveryTime: '1-5 days',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/4.jpg'
    },
    {
      id: 'seo-aeo-geo',
      icon: Search,
      title: 'SEO, AEO & GEO Services',
      description: 'Be found everywhere — on Google, in AI answers, and through generative engines. We optimize your content for classic SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).',
      features: [
        'Technical & On-Page SEO',
        'Answer Engine Optimization (AEO)',
        'Generative Engine Optimization (GEO)',
        'Structured Data & Schema',
        'Content & Entity Strategy',
        'Rank & Visibility Tracking'
      ],
      technologies: ['Schema.org', 'Google Search Console', 'Ahrefs', 'Surfer SEO', 'GA4'],
      pricing: 'Starting from $300/mo',
      deliveryTime: 'Ongoing',
      color: 'from-lime-500 to-lime-700',
      bgColor: 'bg-lime-50 dark:bg-lime-900/20',
      textColor: 'text-lime-600 dark:text-lime-400',
      image: 'https://loremflickr.com/800/600/seo?lock=24'
    },
    {
      id: 'google-meta-business',
      icon: Store,
      title: 'Google Business & Meta Business Services',
      description: 'Own your local presence. We set up and optimize your Google Business Profile and Meta Business suite to win trust, reviews, and customers right where they search.',
      features: [
        'Google Business Profile Setup',
        'Meta Business Suite Management',
        'Review & Reputation Strategy',
        'Local SEO & Listings',
        'Posts, Offers & Updates',
        'Insights & Reporting'
      ],
      technologies: ['Google Business Profile', 'Meta Business Suite', 'Canva', 'Google Maps'],
      pricing: 'Starting from $200/mo',
      deliveryTime: '1-2 weeks setup',
      color: 'from-sky-500 to-sky-700',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      textColor: 'text-sky-600 dark:text-sky-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/9.jpg'
    },
    {
      id: 'content-writing',
      icon: PenLine,
      title: 'Content Writing',
      description: 'Words that sell. Our expert writers craft clear, compelling, and conversion-focused copy — from web pages to product descriptions — that speaks directly to your audience and turns readers into paying customers.',
      features: [
        'Conversion-Focused Copy',
        'Brand Voice & Tone Matching',
        'SEO-Friendly Writing',
        'Product & Service Descriptions',
        'Email & Newsletter Copy',
        'Plan-Based Revisions'
      ],
      technologies: ['Grammarly', 'Surfer SEO', 'Notion', 'Google Docs', 'Copy.ai'],
      pricing: 'Starting from $50',
      deliveryTime: '2-5 days',
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/14.jpg'
    },
    {
      id: 'articles-blog',
      icon: Newspaper,
      title: 'Articles & Blog Posts',
      description: 'Own your niche and win organic traffic with well-researched, engaging articles and blog posts. We write content that ranks on Google and keeps readers coming back for more.',
      features: [
        'SEO-Optimized Long-Form Posts',
        'In-Depth Research & Facts',
        'Engaging Headlines & Hooks',
        'Internal & External Linking',
        'Consistent Publishing Calendar',
        '100% Plagiarism-Free'
      ],
      technologies: ['Surfer SEO', 'Ahrefs', 'Grammarly', 'WordPress', 'NeuronWriter'],
      pricing: 'Starting from $40/post',
      deliveryTime: '3-7 days',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/1.jpg'
    },
    {
      id: 'content-strategy',
      icon: Target,
      title: 'Content Strategy',
      description: 'Stop posting and start growing. We build data-backed content strategies — topics, calendars, and funnels — that put your brand in front of the right people at exactly the right time.',
      features: [
        'Audience & Competitor Research',
        'Content Pillars & Calendar',
        'SEO & Keyword Roadmap',
        'Funnel & Distribution Plan',
        'Performance KPIs & Reporting',
        'Monthly Strategy Reviews'
      ],
      technologies: ['Google Analytics', 'Ahrefs', 'Notion', 'Trello', 'Semrush'],
      pricing: 'Starting from $300/mo',
      deliveryTime: 'Ongoing',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      image: 'https://loremflickr.com/800/600/marketingstrategy?lock=28'
    },
    {
      id: 'website-content',
      icon: Layout,
      title: 'Website Content',
      description: 'First impressions close deals. We write sharp, persuasive website copy — home, about, services, and landing pages — engineered to build trust and drive visitors to take action.',
      features: [
        'Home & Landing Page Copy',
        'About & Brand Story',
        'Service & Product Pages',
        'Clear Calls-to-Action',
        'Tone & Messaging Guide',
        'Conversion-Ready Structure'
      ],
      technologies: ['Figma', 'Webflow', 'WordPress', 'Grammarly', 'Hemingway'],
      pricing: 'Starting from $150',
      deliveryTime: '3-6 days',
      color: 'from-teal-500 to-teal-700',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      image: 'https://loremflickr.com/800/600/website?lock=29'
    },
    {
      id: 'scriptwriting',
      icon: Clapperboard,
      title: 'Scriptwriting',
      description: 'From YouTube to corporate videos, we write tight, engaging scripts that hold attention and deliver your message — with hooks, pacing, and CTAs that convert viewers into customers.',
      features: [
        'YouTube & Reels Scripts',
        'Video Sales Letters (VSL)',
        'Explainer & Demo Scripts',
        'Hook & Retention Techniques',
        'On-Screen Caption Notes',
        'Revision Rounds Included'
      ],
      technologies: ['Final Draft', 'Notion', 'Descript', 'Google Docs'],
      pricing: 'Starting from $80/script',
      deliveryTime: '2-4 days',
      color: 'from-cyan-500 to-cyan-700',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      image: 'https://loremflickr.com/800/600/screenplay?lock=30'
    },
    {
      id: 'creative-writing',
      icon: Feather,
      title: 'Creative Writing',
      description: 'Stories that stick. Our creative writers craft brand narratives, short stories, and poetic copy that make your business memorable and emotionally connect with your audience.',
      features: [
        'Brand Story & Narrative',
        'Short Stories & Fiction',
        'Poetry & Taglines',
        'Social Media Storytelling',
        'Emotional Hook Writing',
        'Custom Tone & Style'
      ],
      technologies: ['Notion', 'Scrivener', 'Google Docs', 'Grammarly'],
      pricing: 'Starting from $60',
      deliveryTime: '2-5 days',
      color: 'from-sky-500 to-sky-700',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      textColor: 'text-sky-600 dark:text-sky-400',
      image: 'https://loremflickr.com/800/600/typewriter?lock=31'
    },

    {
      id: 'research-summaries',
      icon: BookOpen,
      title: 'Research & Summaries',
      description: 'Save hours of reading. We deliver clear, accurate research and executive summaries — academic, market, or technical — so you get the insights you need, fast.',
      features: [
        'Academic & Literature Reviews',
        'Market & Industry Research',
        'Executive Summaries',
        'Data Synthesis & Insights',
        'Citations & References',
        'Clear, Structured Reports'
      ],
      technologies: ['Zotero', 'Mendeley', 'Python', 'Excel', 'LaTeX'],
      pricing: 'Starting from $50',
      deliveryTime: '2-5 days',
      color: 'from-fuchsia-500 to-fuchsia-700',
      bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
      image: 'https://loremflickr.com/800/600/research?lock=34'
    },
    {
      id: 'ai-image-making',
      icon: Image,
      title: 'AI Image Generation',
      description: 'Stunning visuals on demand. We craft high-quality, on-brand AI images — logos, illustrations, product shots, and social graphics — without the cost or wait of a photo shoot.',
      features: [
        'Custom AI Illustrations',
        'Product & Mockup Images',
        'Social Media Graphics',
        'Brand-Consistent Styles',
        'High-Resolution Exports',
        'Commercial Usage Rights'
      ],
      technologies: ['Midjourney', 'DALL·E', 'Stable Diffusion', 'Adobe Firefly', 'Canva'],
      pricing: 'Starting from $30/image',
      deliveryTime: '1-2 days',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      image: 'https://img.aitechworlds.com/aitechworlds-services/6.jpg'
    },
    {
      id: 'ai-poster-book',
      icon: Images,
      title: 'AI Poster & Book Design',
      description: 'From eye-catching posters to print-ready books, we design and lay out your visuals with AI — fast, affordable, and polished for both digital and print.',
      features: [
        'Event & Promo Posters',
        'Book Layout & Formatting',
        'Cover Design',
        'Print-Ready PDFs',
        'eBook & KDP Setup',
        'Multiple Revision Rounds'
      ],
      technologies: ['Canva', 'Midjourney', 'Adobe InDesign', 'Blurb', 'Kindle Direct'],
      pricing: 'Starting from $60/project',
      deliveryTime: '3-6 days',
      color: 'from-rose-500 to-rose-700',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      image: 'https://loremflickr.com/800/600/poster?lock=36'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
      <SEO
        title="Our Services — Web, Mobile, AI, Content, Branding, Marketing & Custom Software"
        description="Explore AiTechWorlds' services: content writing, blog posts, content strategy, website copy, scriptwriting, creative writing, podcast & speech writing, research, AI image & poster/book design, personal branding, digital marketing, programming, custom software, prompt engineering, vibe coding, bug fixing, SEO/AEO/GEO, and Google & Meta Business — delivered remotely worldwide."
        path="/services"
        keywords={['content writing services', 'blog writing', 'AI image generation', 'scriptwriting', 'digital marketing', 'prompt engineering', 'custom software development', 'personal branding website', 'SEO AEO GEO services', 'bug fixing and deployment']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
            <Zap size={16} className="mr-2" />
            Our Services
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">IT Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From web development to AI solutions, we deliver cutting-edge technology services that drive business growth and innovation for clients worldwide.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-12 sm:space-y-16">
          {services.map((service, index) => (
            <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 ${service.bgColor} rounded-full text-sm font-medium ${service.textColor} mb-4`}>
                  <service.icon size={16} className="mr-2" />
                  {service.title}
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {service.title}
                </h2>
                
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckCircle size={18} className={`mr-3 mt-0.5 ${service.textColor} flex-shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Technologies We Use:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                  <div className={`p-3 sm:p-4 ${service.bgColor} rounded-lg`}>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Starting Price</h4>
                    <p className={`text-base sm:text-lg font-bold ${service.textColor}`}>{service.pricing}</p>
                  </div>
                  <div className={`p-3 sm:p-4 ${service.bgColor} rounded-lg`}>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Delivery Time</h4>
                    <p className={`text-base sm:text-lg font-bold ${service.textColor}`}>{service.deliveryTime}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/order"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="relative z-10 aspect-video overflow-hidden rounded-2xl">
                    {!imageErrors.has(service.id) ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        loading="lazy"
                        onError={() => handleImageError(service.id)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        <div className="text-center p-4">
                          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Image unavailable</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play size={20} className="text-white ml-1 sm:w-6 sm:h-6" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center">
          <Globe size={32} className="mx-auto mb-4 sm:mb-6 opacity-80 sm:w-12 sm:h-12" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Transform Your Business?</h3>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have chosen AiTechWorlds for their digital transformation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Project
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;