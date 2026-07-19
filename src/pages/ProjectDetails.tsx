import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { ArrowLeft, Globe, Star, User, Clock, Award, CheckCircle, Code, Smartphone, AlertCircle, X, ChevronLeft, ChevronRight, ZoomIn, ImageOff, Loader2, Sparkles, Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

interface RetryImageProps {
  src: string;
  alt: string;
  className?: string;
}

const RetryImage: React.FC<RetryImageProps> = ({ src, alt, className }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  if (status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-2">
        <ImageOff size={28} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setStatus('loading'); setAttempt(a => a + 1); }}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-neutral-300 dark:text-neutral-600" />
        </div>
      )}
      <img
        key={attempt}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`${className ?? ''} ${status === 'loading' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projectsData.find(p => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobileApp = project?.category === 'Mobile';
  const hasLiveDemo = Boolean(project?.links?.demo);
  const hasPlayStore = Boolean(project?.links?.playStore);
  const hasVideo = Boolean(project?.links?.video);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => {
    if (!project) return;
    setLightboxIndex(i => (i === null ? null : (i - 1 + project.images.length) % project.images.length));
  }, [project]);
  const showNext = useCallback(() => {
    if (!project) return;
    setLightboxIndex(i => (i === null ? null : (i + 1) % project.images.length));
  }, [project]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  if (!project) {
    return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-neutral-400" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Project Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-300 mb-8">The project you're looking for doesn't exist or has been moved.</p>
            <Link to="/projects" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300">
              <ArrowLeft className="mr-2" size={20} />
              Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 sm:py-12">
      <SEO
        title={`${project.title} — Case Study`}
        description={project.description}
        path={`/projects/${project.id}`}
        image={project.imageUrl}
        keywords={[project.category, ...project.technologies]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          image: project.imageUrl,
          keywords: project.technologies.join(', '),
        }}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <Link to="/projects" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 sm:mb-8 transition-colors duration-200 text-sm font-medium">
          <ArrowLeft className="mr-1.5" size={18} />
          Back to Projects
        </Link>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-100 dark:border-neutral-700">
          {/* Hero Section */}
          <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden bg-neutral-900">
            {isMobileApp ? (
              <>
                <img
                  src={project.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
                />
                <div className="relative w-full h-full flex items-center justify-center py-4">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-auto max-w-[55%] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                  />
                </div>
              </>
            ) : (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end pointer-events-none">
              <div className="w-full text-center text-white px-3 sm:px-4 pb-6">
                <div>
                  <div className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-3 sm:mb-4">
                    {isMobileApp ? <Smartphone size={14} className="mr-1.5" /> : <Award size={14} className="mr-1.5" />}
                    {project.category}
                    {project.links?.demo && (
                      <span className="ml-1.5 pl-1.5 border-l border-white/30 inline-flex items-center">
                        <span className="w-1 h-1 rounded-full bg-green-400 mr-1 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{project.title}</h1>
                  <p className="text-sm sm:text-base opacity-90">{project.type}</p>
                </div>
              </div>
            </div>

            {(hasLiveDemo || hasPlayStore || hasVideo) && (
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-1.5 pointer-events-auto">
                {hasLiveDemo && (
                  <a
                    href={project.links!.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-neutral-900 text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Globe size={13} />
                    <span className="hidden sm:inline">Live Site</span>
                  </a>
                )}
                {hasPlayStore && (
                  <a
                    href={project.links!.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">Play Store</span>
                  </a>
                )}
                {hasVideo && (
                  <a
                    href={project.links!.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Play size={13} />
                    <span className="hidden sm:inline">Watch Demo</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="p-3 sm:p-5 lg:p-7 -mt-12 relative z-10">
            {/* Project Overview Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 -mt-10 mb-8 sm:mb-12 relative z-10">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 shadow text-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                <h3 className="font-medium text-neutral-900 dark:text-white text-xs sm:text-sm mb-0.5">Client</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs">{project.clientName}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 shadow text-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                <h3 className="font-medium text-neutral-900 dark:text-white text-xs sm:text-sm mb-0.5">Timeline</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs">{project.deliveryTime}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 shadow text-center">
                {isMobileApp ? (
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                ) : (
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                )}
                <h3 className="font-medium text-neutral-900 dark:text-white text-xs sm:text-sm mb-0.5">Platform</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs">{project.category}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 shadow text-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mx-auto mb-1.5" />
                <h3 className="font-medium text-neutral-900 dark:text-white text-xs sm:text-sm mb-0.5">Rating</h3>
                <div className="flex justify-center">
                  {[...Array(project.rating || 5)].map((_, index) => (
                    <Star key={index} size={12} className="text-yellow-400 fill-current sm:w-3.5 sm:h-3.5" />
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-8 sm:mb-12 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4 sm:p-6">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-1.5 mb-4">
                  <Sparkles size={18} className="text-primary-300" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Why This Project Stands Out</h2>
                </div>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((point, index) => (
                    <div key={index} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <CheckCircle size={16} className="text-primary-300 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-white/95 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">Project Overview</h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">{project.description}</p>
            </div>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-2.5 sm:mr-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">The Challenge</h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{project.challenge}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-2.5 sm:mr-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Our Solution</h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start p-2.5 sm:p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <CheckCircle size={16} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Images */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">Project Gallery</h2>
              <div className={isMobileApp
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
              }>
                {project.images.map((image, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-100 dark:bg-neutral-900 ${isMobileApp ? 'aspect-[9/19.5]' : 'aspect-video'}`}
                  >
                    <RetryImage
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                      <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Review */}
            {project.review && (
              <div className="mb-8 sm:mb-12 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">Client Testimonial</h2>
                <div className="flex mb-3">
                  {[...Array(project.rating || 0)].map((_, index) => (
                    <Star 
                      key={index}
                      size={18}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 italic mb-3 leading-relaxed">
                  "{project.review}"
                </blockquote>
                <cite className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white">— {project.clientName}</cite>
              </div>
            )}

            {/* Project Links */}
            {(hasLiveDemo || hasPlayStore) && (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 sm:p-6 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-1.5">See It in Action</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">Explore the live product yourself — no waiting required.</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                  {hasLiveDemo && (
                    <a
                      href={project.links!.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Globe size={16} className="mr-1.5" />
                      Visit Live Website
                    </a>
                  )}
                  {hasPlayStore && (
                    <a
                      href={project.links!.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Smartphone size={16} className="mr-1.5" />
                      Get it on Google Play
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-10 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6 text-center">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projectsData.filter(p => p.id !== project.id && p.category === project.category).slice(0, 3).map(relatedProject => (
              <Link key={relatedProject.id} to={`/projects/${relatedProject.id}`} className="group">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 dark:border-neutral-700">
                  <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${relatedProject.category === 'Mobile' ? 'h-32 sm:h-40 flex items-center justify-center' : 'h-32 sm:h-40'}`}>
                    <img
                      src={relatedProject.imageUrl}
                      alt={relatedProject.title}
                      className={relatedProject.category === 'Mobile'
                        ? 'h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300'
                        : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      }
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white rounded-full text-xs font-medium">
                        {relatedProject.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-3 line-clamp-2">
                      {relatedProject.description.slice(0, 90)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{relatedProject.clientName}</span>
                      <div className="flex">
                        {[...Array(relatedProject.rating || 5)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
          >
            <X size={20} />
          </button>

          {project.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous image"
                className="absolute left-1 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next image"
                className="absolute right-1 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <img
            src={project.images[lightboxIndex]}
            alt={`${project.title} screenshot ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
          />

          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 rounded-full text-white text-xs sm:text-sm">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;