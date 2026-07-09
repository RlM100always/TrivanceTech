import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { ArrowLeft, Globe, Star, User, Clock, Award, CheckCircle, Code, Smartphone, AlertCircle, X, ChevronLeft, ChevronRight, ZoomIn, ImageOff, Loader2, Sparkles, Download } from 'lucide-react';
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
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 gap-2">
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
          <Loader2 size={20} className="animate-spin text-gray-300 dark:text-gray-600" />
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">The project you're looking for doesn't exist or has been moved.</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 sm:mb-12 transition-colors duration-200">
          <ArrowLeft className="mr-2" size={20} />
          Back to Projects
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-96 overflow-hidden bg-gray-900">
            {isMobileApp ? (
              <>
                <img
                  src={project.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
                />
                <div className="relative w-full h-full flex items-center justify-center py-4">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-auto max-w-[60%] object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
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
              <div className="w-full text-center text-white px-4 pb-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    {isMobileApp ? <Smartphone size={16} className="mr-2" /> : <Award size={16} className="mr-2" />}
                    {project.category}
                    {project.links?.demo && (
                      <span className="ml-2 pl-2 border-l border-white/30 inline-flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">{project.title}</h1>
                  <p className="text-lg sm:text-xl opacity-90">{project.type}</p>
                </div>
              </div>
            </div>

            {(hasLiveDemo || hasPlayStore) && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 pointer-events-auto">
                {hasLiveDemo && (
                  <a
                    href={project.links!.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Globe size={15} />
                    Visit Live Site
                  </a>
                )}
                {hasPlayStore && (
                  <a
                    href={project.links!.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500 text-white text-sm font-semibold rounded-full shadow-xl hover:bg-green-600 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Download size={15} />
                    Get on Play Store
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Project Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 -mt-16 relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Client</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{project.clientName}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Timeline</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{project.deliveryTime}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                {isMobileApp ? (
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2 sm:mb-3" />
                ) : (
                  <Code className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2 sm:mb-3" />
                )}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Platform</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{project.category}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Rating</h3>
                <div className="flex justify-center">
                  {[...Array(project.rating || 5)].map((_, index) => (
                    <Star key={index} size={14} className="text-yellow-400 fill-current sm:w-4 sm:h-4" />
                  ))}
                </div>
              </div>
            </div>
            {/* Highlights — marketing-forward "why it stands out" band */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-2 mb-5">
                  <Sparkles size={20} className="text-accent-300" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Why This Project Stands Out</h2>
                </div>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.highlights.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <CheckCircle size={18} className="text-accent-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-white/95 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Project Overview</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
            </div>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 mb-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">The Challenge</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{project.challenge}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Our Solution</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Images */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Project Gallery</h2>
              <div className={isMobileApp
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
              }>
                {project.images.map((image, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-100 dark:bg-gray-900 ${isMobileApp ? 'aspect-[9/19.5]' : 'aspect-video'}`}
                  >
                    <RetryImage
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                      <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Review */}
            {project.review && (
              <div className="mb-12 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Client Testimonial</h2>
                <div className="flex mb-4">
                  {[...Array(project.rating || 0)].map((_, index) => (
                    <Star 
                      key={index}
                      size={20}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
                  "{project.review}"
                </blockquote>
                <cite className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">— {project.clientName}</cite>
              </div>
            )}

            {/* Project Links */}
            {(hasLiveDemo || hasPlayStore) && (
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-6 sm:p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">See It in Action</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Explore the live product yourself — no waiting required.</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center">
                  {hasLiveDemo && (
                    <a
                      href={project.links!.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Globe size={18} className="mr-2" />
                      Visit Live Website
                    </a>
                  )}
                  {hasPlayStore && (
                    <a
                      href={project.links!.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Smartphone size={18} className="mr-2" />
                      Get it on Google Play
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projectsData.filter(p => p.id !== project.id && p.category === project.category).slice(0, 3).map(relatedProject => (
              <Link key={relatedProject.id} to={`/projects/${relatedProject.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${relatedProject.category === 'Mobile' ? 'h-40 sm:h-48 flex items-center justify-center' : 'h-40 sm:h-48'}`}>
                    <img
                      src={relatedProject.imageUrl}
                      alt={relatedProject.title}
                      className={relatedProject.category === 'Mobile'
                        ? 'h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300'
                        : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      }
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-full text-sm font-medium">
                        {relatedProject.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {relatedProject.description.slice(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{relatedProject.clientName}</span>
                      <div className="flex">
                        {[...Array(relatedProject.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
          >
            <X size={22} />
          </button>

          {project.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={project.images[lightboxIndex]}
            alt={`${project.title} screenshot ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
          />

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 rounded-full text-white text-sm">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;