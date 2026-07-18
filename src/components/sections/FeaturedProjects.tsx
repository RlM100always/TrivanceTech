import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ExternalLink, FolderOpen } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { getCategoryColor } from '../../utils/categoryColor';
import SectionHeading from '../ui/motion/SectionHeading';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

const FeaturedProjects: React.FC = () => {
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20 sm:py-28">
      {/* Depth for the mid-page dark band */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proof, Not Promises"
          eyebrowIcon={<FolderOpen size={16} className="mr-1" />}
          title="Real Products We've Shipped"
          highlight="Shipped"
          description="Every project here is live, in production, in front of real users — see the quality you'd be buying before you spend a dollar."
        />

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
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

        <Reveal className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary-700 hover:shadow-xl sm:px-8 sm:py-4"
          >
            View All Projects
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedProjects;
