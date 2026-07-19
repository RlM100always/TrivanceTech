import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ExternalLink } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { getCategoryColor } from '../../utils/categoryColor';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

const FeaturedProjects: React.FC = () => {
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-neutral-50/80 py-20 backdrop-blur-xl dark:bg-neutral-950/50 sm:py-28">
      {/* Depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary-600/5 blur-3xl dark:bg-primary-600/10" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
              Featured Work
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-[2.75rem]">
              Real products.{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
                Real impact.
              </span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="group inline-flex items-center font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all projects
            <ArrowRight size={18} className="ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {featuredProjects.map((project) => {
            const isMobile = project.category === 'Mobile';
            return (
              <StaggerItem key={project.id}>
                <Tilt max={8} className="h-full">
                  <SpotlightCard glowColor="rgba(37, 99, 235, 0.16)" className="h-full rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-neutral-800">
                    <div className="group overflow-hidden rounded-2xl border border-neutral-100 transition-colors duration-300 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-700">
                      <Link to={`/projects/${project.id}`}>
                        <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${isMobile ? 'flex h-48 items-center justify-center sm:h-56' : 'h-48 sm:h-56'}`}>
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            loading="lazy"
                            className={isMobile
                              ? 'h-full w-auto max-w-[75%] rounded-md object-contain shadow-md transition-transform duration-500 group-hover:scale-110'
                              : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute right-4 top-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg ${getCategoryColor(project.category)}`}>
                              {project.category}
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <ExternalLink size={20} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="p-6">
                        <Link to={`/projects/${project.id}`}>
                          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                            {project.title}
                          </h3>
                        </Link>

                        <p className="mb-4 line-clamp-3 leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {project.description}
                        </p>

                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {project.clientName}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${i < (project.rating || 0) ? 'fill-current text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                              ({project.rating || 0}/5)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {project.deliveryTime}
                          </span>
                          <Link
                            to={`/projects/${project.id}`}
                            className="group/link inline-flex items-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            View Details
                            <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </Tilt>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturedProjects;
