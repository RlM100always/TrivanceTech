import { useState } from 'react';
import { Clock, Tag, User, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDetails } from '../../data/projects';
import { getCategoryColor } from '../../utils/categoryColor';
import Reveal from './motion/Reveal';
import Tilt from './motion/Tilt';
import SpotlightCard from './motion/SpotlightCard';

interface ProjectCardProps {
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showReview, setShowReview] = useState(false);
  const isMobileApp = project.category === 'Mobile';

  return (
    <Reveal className="h-full">
      <Tilt max={8} className="h-full">
        <SpotlightCard glowColor="rgba(37, 99, 235, 0.16)" className="h-full rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-neutral-800">
          <div className="group overflow-hidden rounded-2xl border border-neutral-100 transition-colors duration-300 hover:border-primary-200 dark:border-neutral-700 dark:hover:border-primary-700">
            <Link to={`/projects/${project.id}`}>
              <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${isMobileApp ? 'flex h-56 items-center justify-center sm:h-64' : 'h-48 sm:h-56'}`}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  className={isMobileApp
                    ? 'h-full w-auto max-w-[75%] rounded-md object-contain shadow-md transition-transform duration-300 group-hover:scale-105'
                    : 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-3 top-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getCategoryColor(project.category)}`}>
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

            <div className="p-5 sm:p-6">
              <Link to={`/projects/${project.id}`}>
                <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-neutral-900 transition-colors duration-200 hover:text-primary-600 dark:text-white dark:hover:text-primary-400 sm:text-xl">
                  {project.title}
                </h3>
              </Link>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                  <Tag size={16} className="mr-2 flex-shrink-0 text-primary-500" />
                  <span className="truncate">{project.type}</span>
                </div>

                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                  <User size={16} className="mr-2 flex-shrink-0 text-primary-500" />
                  <span className="truncate">{project.clientName}</span>
                </div>

                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                  <Clock size={16} className="mr-2 flex-shrink-0 text-primary-500" />
                  <span>{project.deliveryTime}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < (project.rating || 0) ? 'fill-current text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-300">
                    ({project.rating || 0}/5)
                  </span>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View Details
                </Link>
              </div>

              {project.review && (
                <div className="border-t border-neutral-100 pt-4 dark:border-neutral-700">
                  <button
                    onClick={() => setShowReview(!showReview)}
                    className="mb-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 focus:outline-none dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {showReview ? 'Hide Client Review' : 'Show Client Review'}
                  </button>

                  {showReview && (
                    <div className="mt-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700">
                      <p className="text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-300">
                        "{project.review}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </SpotlightCard>
      </Tilt>
    </Reveal>
  );
};

export default ProjectCard;
