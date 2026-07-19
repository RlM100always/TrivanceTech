import { useMemo, useState } from 'react';
import { Search, Filter, FolderOpen, ArrowRight } from 'lucide-react';
import ProjectCard from '../components/ui/ProjectCard';
import { projectsData } from '../data/projects';
import SEO from '../components/seo/SEO';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';
import { StaggerContainer, StaggerItem } from '../components/ui/motion/Reveal';

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'Web', name: 'Web Development' },
  { id: 'Mobile', name: 'Mobile Development' },
  { id: 'Academic', name: 'Academic Projects' },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Derived, not mirrored into state — one source of truth for the visible list.
  const filteredProjects = useMemo(() => {
    let filtered = projectsData;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((project) => project.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(term) ||
          project.type.toLowerCase().includes(term) ||
          project.clientName.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
  };

  return (
    <PageShell>
      <SEO
        title="Our Portfolio — Real Web, Mobile & AI Projects"
        description="Browse real client projects delivered by AiTechWorlds — web platforms, Android apps, and academic software, with live demos and Play Store links."
        path="/projects"
        keywords={['software portfolio', 'web development portfolio', 'mobile app portfolio', 'AiTechWorlds projects']}
      />

      <PageHero
        eyebrow="The Work Speaks First"
        eyebrowIcon={<FolderOpen size={13} />}
        title="Every project, delivered and live"
        highlight="delivered and live"
        description="No mockups, no concept art — every project below shipped to real users. Filter by category to see work closest to what you're planning."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
      />

      <Section tone="muted" compact>
        {/* Search + filters */}
        <GlassCard interactive={false} className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                aria-label="Search projects"
                placeholder="Search projects..."
                className="w-full rounded-xl border border-neutral-300 bg-white/80 py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-500 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-neutral-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                <Filter size={14} />
                Filter
              </span>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={activeCategory === category.id}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'border border-neutral-200 bg-white/70 text-neutral-600 backdrop-blur hover:border-primary-300 hover:text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-primary-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400" aria-live="polite">
          Showing {filteredProjects.length} of {projectsData.length} projects
        </p>
      </Section>

      <Section tone="plain" compact>
        {filteredProjects.length > 0 ? (
          <StaggerContainer
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8"
            stagger={0.07}
          >
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <GlassCard interactive={false} className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-white/5">
              <Search size={32} />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
              No projects found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-neutral-600 dark:text-neutral-400">
              Try adjusting your search criteria or browse all categories.
            </p>
            <div className="mt-6 flex justify-center">
              <ActionButton onClick={clearFilters} variant="primary">
                Clear Filters
              </ActionButton>
            </div>
          </GlassCard>
        )}
      </Section>

      <Section tone="accent" compact>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Have something like this in mind?
            </h2>
            <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
              Tell us what you're planning and we'll come back with scope, timeline and a real number.
            </p>
          </div>
          <ActionButton to="/order" size="lg" className="shrink-0">
            Start Your Project
            <ArrowRight size={18} />
          </ActionButton>
        </div>
      </Section>
    </PageShell>
  );
};

export default Projects;
