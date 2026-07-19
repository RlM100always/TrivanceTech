import React, { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Award,
  Heart,
  Globe,
  ChevronRight,
  Star,
  Briefcase,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { CONTACT_EMAIL } from '../utils/socialLinks';
import SEO from '../components/seo/SEO';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';
import SectionHeading from '../components/ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../components/ui/motion/Reveal';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary?: string;
  description: string;
  postedDate: string;
  isHot?: boolean;
  isNew?: boolean;
  isUrgent?: boolean;
}

/**
 * Open roles. Intentionally empty while nothing is being hired for — the
 * listing section renders its "no roles open" state and the CTA below points
 * candidates at the speculative-application route instead.
 */
const OPEN_JOBS: Job[] = [];

const perks = [
  {
    icon: Users,
    title: 'Diverse Team',
    description: 'Work with talented professionals from diverse backgrounds and cultures.',
  },
  {
    icon: Globe,
    title: 'Fully Remote',
    description: 'Work from anywhere — we have been remote-first since day one, not as a perk bolted on later.',
  },
  {
    icon: Award,
    title: 'Growth Opportunities',
    description: 'Continuous learning and career advancement with mentorship programs.',
  },
  {
    icon: Heart,
    title: 'Great Benefits',
    description: 'Competitive pay, flexible time off, and a genuine respect for your hours.',
  },
];

const internshipPoints = [
  'Paid internships with competitive stipends',
  'Mentorship from senior developers',
  'Opportunity for full-time conversion',
  'Work on international client projects',
];

const BADGE_STYLES: Record<string, string> = {
  hot: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30',
  new: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30',
  urgent:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30',
};

const Careers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    location: 'all',
    type: 'all',
    experience: 'all',
  });

  // Derived, not mirrored into state — one source of truth for the visible list.
  const filteredJobs = useMemo(() => {
    let filtered = OPEN_JOBS;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.department.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term)
      );
    }

    if (filters.department !== 'all') {
      filtered = filtered.filter((job) => job.department === filters.department);
    }
    if (filters.location !== 'all') {
      filtered = filtered.filter((job) => job.location.includes(filters.location));
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter((job) => job.type === filters.type);
    }
    if (filters.experience !== 'all') {
      filtered = filtered.filter((job) => job.experience.includes(filters.experience));
    }

    return filtered;
  }, [searchTerm, filters]);

  const selectClass =
    'rounded-xl border border-neutral-300 bg-white/80 px-3 py-3 text-sm text-neutral-900 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-white/10 dark:bg-white/5 dark:text-white';

  return (
    <PageShell>
      <SEO
        title="Careers — Build With a Remote-First Engineering Team"
        description="Join AiTechWorlds: a remote-first team building web, mobile, and AI products for clients worldwide. Open roles, internships, and speculative applications."
        path="/careers"
        keywords={['tech careers', 'remote developer jobs', 'software internships', 'AiTechWorlds careers']}
      />

      <PageHero
        eyebrow="Join Our Team"
        eyebrowIcon={<Briefcase size={13} />}
        title="Build the future with AiTechWorlds"
        highlight="AiTechWorlds"
        description="Join our remote-first team and work on real projects with international clients. Competitive pay, genuine flexibility, and room to grow."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
        actions={
          <>
            <ActionButton href="#jobs" size="lg">
              View Open Positions
              <ChevronRight size={18} />
            </ActionButton>
            <ActionButton href={`mailto:${CONTACT_EMAIL}`} variant="ghost" size="lg">
              Send Your Resume
            </ActionButton>
          </>
        }
      />

      {/* Why work with us */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Culture"
          title="Why work with us?"
          highlight="work with us"
          description="We believe in creating an environment where talented individuals can thrive and make a meaningful impact."
          className="mb-12 sm:mb-16"
        />

        <StaggerContainer
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 sm:gap-8"
          stagger={0.07}
        >
          {perks.map((perk) => (
            <StaggerItem key={perk.title}>
              <GlassCard className="group h-full text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110">
                  <perk.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">{perk.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                  {perk.description}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* Students & graduates */}
      <Section tone="plain">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600 backdrop-blur dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400">
              <GraduationCap size={13} />
              For Students & New Graduates
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Internships &{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
                campus hiring
              </span>
            </h2>

            <p className="mt-5 leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
              We welcome talented students and fresh graduates. Our internship programme provides hands-on experience
              with real projects and dedicated mentorship.
            </p>

            <ul className="mt-8 space-y-3">
              {internshipPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ActionButton href="#jobs" size="lg">
                View Internship Opportunities
                <ChevronRight size={18} />
              </ActionButton>
            </div>
          </div>

          <div className="relative">
            <GlassCard flush interactive={false} className="overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                alt="Students collaborating on a software project"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </GlassCard>
            <GlassCard
              interactive={false}
              className="absolute -bottom-6 -right-2 flex items-center gap-2 p-4 sm:-right-6"
            >
              <Star className="h-5 w-5 fill-current text-yellow-400" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">4.9/5 Intern Rating</span>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* Open positions */}
      <Section tone="muted" id="jobs">
        <SectionHeading
          eyebrow="Open Roles"
          title="Open positions"
          highlight="positions"
          description="Find your next opportunity with us."
          className="mb-10 sm:mb-12"
        />

        <GlassCard interactive={false} className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="search"
                  aria-label="Search jobs"
                  placeholder="Search jobs..."
                  className="w-full rounded-xl border border-neutral-300 bg-white/80 py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-500 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-neutral-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              aria-label="Filter by department"
              className={selectClass}
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>

            <select
              aria-label="Filter by employment type"
              className={selectClass}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select
              aria-label="Filter by location"
              className={selectClass}
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="all">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </GlassCard>

        <div className="mt-8 space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <GlassCard as="article" key={job.id} className="group">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{job.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.isHot && (
                          <span className={`rounded-full border px-2 py-1 text-xs font-medium ${BADGE_STYLES.hot}`}>
                            🔥 Hot
                          </span>
                        )}
                        {job.isNew && (
                          <span className={`rounded-full border px-2 py-1 text-xs font-medium ${BADGE_STYLES.new}`}>
                            ✨ New
                          </span>
                        )}
                        {job.isUrgent && (
                          <span className={`rounded-full border px-2 py-1 text-xs font-medium ${BADGE_STYLES.urgent}`}>
                            ⚡ Urgent
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase size={15} />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={15} />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={15} />
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign size={15} />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400">{job.description}</p>

                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:ml-6">
                    <ActionButton to={`/careers/job/${job.id}`} variant="ghost">
                      View Details
                    </ActionButton>
                    <ActionButton to={`/careers/apply/${job.id}`}>Apply Now</ActionButton>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard interactive={false} className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-white/5">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
                No roles open right now
              </h3>
              <p className="mx-auto mt-2 max-w-md text-neutral-600 dark:text-neutral-400">
                We hire in bursts as projects land. Send your resume and we'll reach out when something matching opens
                up.
              </p>
              <div className="mt-6 flex justify-center">
                <ActionButton href={`mailto:${CONTACT_EMAIL}`}>Send Your Resume</ActionButton>
              </div>
            </GlassCard>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="accent" compact>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Ready to join our team?
            </h2>
            <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
              Don't see a position that fits? Send us your resume and we'll keep you in mind for future opportunities.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ActionButton href={`mailto:${CONTACT_EMAIL}`} size="lg">
              Send Resume
              <ArrowRight size={18} />
            </ActionButton>
            <ActionButton to="/contact" variant="ghost" size="lg">
              Contact Us
            </ActionButton>
          </div>
        </div>
      </Section>
    </PageShell>
  );
};

export default Careers;
