import {
  Users,
  Award,
  Globe,
  Target,
  Eye,
  Heart,
  Zap,
  Code,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Cpu,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  MapPin,
  Bug,
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';
import SectionHeading from '../components/ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../components/ui/motion/Reveal';

const stats = [
  { number: '50+', label: 'Projects Completed', icon: CheckCircle },
  { number: '15+', label: 'Happy Clients', icon: Users },
  { number: '10+', label: 'Expert Developers', icon: Code },
  { number: '99%', label: 'Client Satisfaction', icon: Star },
];

const pillars = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To empower businesses worldwide with cutting-edge technology solutions that drive growth, efficiency, and innovation in the digital age.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To become a globally trusted and innovative technology solutions provider, setting new standards for excellence in every project we deliver.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description:
      'Innovation, integrity, excellence, and client satisfaction are at the core of everything we do. We believe in building lasting partnerships through trust and quality.',
  },
];

const services = [
  { icon: Code, title: 'Web Development', description: 'Custom web applications built with cutting-edge technologies' },
  { icon: Smartphone, title: 'Mobile Development', description: 'Native and cross-platform mobile applications' },
  { icon: Database, title: 'Database Solutions', description: 'Scalable database design and optimization' },
  { icon: Code, title: 'Software Development', description: 'Software solutions tailored to your business needs' },
  {
    icon: Cloud,
    title: 'University Projects & Thesis',
    description: 'University projects, thesis and assignments for Global Students',
  },
  { icon: Shield, title: 'Cybersecurity', description: 'Comprehensive security solutions and audits' },
  { icon: Cpu, title: 'AI & Machine Learning', description: 'Intelligent solutions powered by AI technology' },
];

const team = [
  {
    name: 'Md. Rakib Hossain',
    position: 'CEO & Founder',
    badge: 'Founder',
    icon: Zap,
    image:
      'https://media.licdn.com/dms/image/v2/D5603AQFVSIKpkRw5FQ/profile-displayphoto-crop_800_800/B56Z866GhOGoAI-/0/1783399738471?e=1785369600&v=beta&t=N8KW4fVDVQzNbaqcDhICasW5Lm5qRR1DQKTNRR3kePs',
    description:
      'Visionary leader with 5+ years in IT industry, driving AiTechWorlds’ remote-first mission worldwide.',
  },
  {
    name: 'Md Al Habib',
    position: 'Software Engineer & AI Developer',
    badge: 'Vibe Coding Expert',
    icon: Cpu,
    image: 'https://img.aitechworlds.com/profile/ChatGPT%20Image%20Jul%209%2C%202026%2C%2011_40_57%20AM.webp',
    description:
      'AI-focused software engineer turning ideas into intelligent, production-ready products through rapid, AI-assisted development.',
  },
  {
    name: 'Shamshur Rahman',
    position: 'Problem Solver and Cloud Expert',
    badge: 'Cloud Expert',
    icon: Cloud,
    image: 'https://avatars.githubusercontent.com/u/109974472?v=4',
    description:
      'Solves complex infrastructure challenges and architects reliable, scalable cloud deployments for every project.',
  },
  {
    name: 'Abdullah Al Arman Emon',
    position: 'Software Testing Expert & Prompt Engineer',
    badge: 'QA & Prompt Engineering',
    icon: Bug,
    image: 'https://img.aitechworlds.com/profile/ChatGPT%20Image%20Jul%209%2C%202026%2C%2001_31_41%20PM.webp',
    description:
      'Ensures every release is bug-free through rigorous testing, and crafts high-precision prompts that power our AI-driven workflows.',
  },
];

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'Started with a vision to make world-class tech solutions accessible to clients everywhere',
  },
  { year: '2023', title: 'First Major Client', description: 'Secured partnership with leading financial institution' },
  { year: '2024', title: 'Team Expansion', description: 'Grew to 10+ talented professionals' },
  { year: '2025', title: 'Global Expansion', description: 'Serving clients across 5+ countries' },
];

const differentiators = [
  {
    icon: Globe,
    title: 'Remote-First, Worldwide',
    description:
      'No offices, no timezone excuses — a distributed senior team that works alongside you wherever you are.',
  },
  {
    icon: Award,
    title: 'Global Standards',
    description: 'International best practices and cutting-edge technologies applied to every project.',
  },
  {
    icon: CheckCircle,
    title: 'Proven Track Record',
    description: '50+ delivered projects and a 99% client satisfaction rate speak for the quality of the work.',
  },
];

const About = () => (
  <PageShell>
    <SEO
      title="About AiTechWorlds — Remote-First AI & Tech Team"
      description="Meet the remote-first team behind AiTechWorlds — real engineers delivering web, mobile, and AI solutions to clients worldwide, no physical office required."
      path="/about"
      keywords={['about AiTechWorlds', 'remote tech team', 'software development company team']}
    />

    <PageHero
      eyebrow="Remote-First · Serving Clients Worldwide"
      eyebrowIcon={<MapPin size={13} />}
      title="The team behind your next product"
      highlight="your next product"
      description="No account managers, no outsourced juniors — you work directly with the senior engineers and designers who build your product, wherever you are in the world."
      crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      actions={
        <>
          <ActionButton to="/order" size="lg">
            Start Your Project
            <ArrowRight size={18} />
          </ActionButton>
          <ActionButton to="/contact" variant="ghost" size="lg">
            Get In Touch
          </ActionButton>
        </>
      }
    />

    {/* Stats */}
    <Section tone="muted" compact>
      <StaggerContainer className="grid grid-cols-2 gap-6 lg:grid-cols-4 sm:gap-8" stagger={0.07}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <GlassCard className="group h-full text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                <stat.icon size={22} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{stat.number}</div>
              <div className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 sm:text-base">
                {stat.label}
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>

    {/* Mission / Vision / Values */}
    <Section tone="plain">
      <SectionHeading
        eyebrow="What Drives Us"
        title="Our mission & vision"
        highlight="mission & vision"
        description="Driving digital transformation for clients around the world."
        className="mb-12 sm:mb-16"
      />

      <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:gap-8" stagger={0.08}>
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.title}>
            <GlassCard className="group h-full text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110">
                <pillar.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">{pillar.description}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>

    {/* Expertise */}
    <Section tone="muted">
      <SectionHeading
        eyebrow="Capabilities"
        title="Our expertise"
        highlight="expertise"
        description="Comprehensive technology solutions tailored to meet your business needs."
        className="mb-12 sm:mb-16"
      />

      <StaggerContainer
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8"
        stagger={0.06}
      >
        {services.map((service) => (
          <StaggerItem key={service.title}>
            <GlassCard className="group h-full">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                <service.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                {service.description}
              </p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>

    {/* Team */}
    <Section tone="plain">
      <SectionHeading
        eyebrow="The People"
        title="Meet the team you'll actually work with"
        highlight="actually work with"
        description="Experienced professionals driving digital transformation for clients worldwide."
        className="mb-12 sm:mb-16"
      />

      <StaggerContainer
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8"
        stagger={0.08}
      >
        {team.map((member) => (
          <StaggerItem key={member.name}>
            <GlassCard as="article" className="group h-full text-center">
              <div className="relative mb-6">
                <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 p-1 shadow-lg transition-shadow duration-300 group-hover:shadow-primary-500/30 sm:h-36 sm:w-36">
                  <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-white dark:ring-neutral-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-md ring-4 ring-white dark:ring-neutral-900">
                  <member.icon size={16} className="text-white" />
                </div>
              </div>

              <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                {member.badge}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">{member.position}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {member.description}
              </p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>

    {/* Timeline */}
    <Section tone="muted">
      <SectionHeading
        eyebrow="Our Journey"
        title="From first commit to global delivery"
        highlight="global delivery"
        description="Key milestones on the path to becoming a trusted technology partner."
        className="mb-12 sm:mb-16"
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Rail: left-aligned on mobile, centred from sm up. */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary-500/60 via-primary-500/30 to-transparent sm:left-1/2 sm:-translate-x-1/2"
        />

        <StaggerContainer className="space-y-8 sm:space-y-12" stagger={0.1}>
          {milestones.map((milestone, index) => (
            <StaggerItem key={milestone.year}>
              <div
                className={`relative flex items-start gap-6 pl-12 sm:pl-0 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                <div className="sm:w-1/2">
                  <GlassCard className={index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}>
                    <div className="text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">
                      {milestone.year}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                      {milestone.description}
                    </p>
                  </GlassCard>
                </div>

                <div className="absolute left-4 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg ring-4 ring-neutral-50 dark:ring-neutral-950 sm:static sm:h-12 sm:w-12 sm:translate-x-0 sm:ring-0">
                  <TrendingUp size={16} className="text-white" />
                </div>

                <div className="hidden sm:block sm:w-1/2" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Section>

    {/* Why choose us */}
    <Section tone="plain">
      <SectionHeading
        eyebrow="Why AiTechWorlds"
        title="Why teams choose us"
        highlight="choose us"
        description="A distributed senior team held to global engineering standards."
        className="mb-12 sm:mb-16"
      />

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8" stagger={0.08}>
        {differentiators.map((item) => (
          <StaggerItem key={item.title}>
            <GlassCard className="group h-full text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110">
                <item.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                {item.description}
              </p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>

    {/* CTA */}
    <Section tone="accent" compact>
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Like what you see? Let's build yours.
          </h2>
          <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
            The same team, process and standards you just read about — applied to your project. Get a quote in 24
            hours.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ActionButton to="/order" size="lg">
            Start Your Project
            <ArrowRight size={18} />
          </ActionButton>
          <ActionButton to="/projects" variant="ghost" size="lg">
            View Our Work
          </ActionButton>
        </div>
      </div>
    </Section>
  </PageShell>
);

export default About;
