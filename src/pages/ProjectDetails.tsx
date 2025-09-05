import { useParams } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { ArrowLeft, Globe, Github, FileText, Star, Calendar, User, Clock, Award, CheckCircle, ExternalLink, Code, Smartphone, Database, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projectsData.find(p => p.id === id);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 sm:mb-12 transition-colors duration-200">
          <ArrowLeft className="mr-2" size={20} />
          Back to Projects
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-96 overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
              <div className="w-full text-center text-white px-4 pb-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    <Award size={16} className="mr-2" />
                    {project.category}
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">{project.title}</h1>
                  <p className="text-lg sm:text-xl opacity-90">{project.type}</p>
                </div>
              </div>
            </div>
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
                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Category</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {project.images.map((image, index) => (
                  <div 
                    key={index}
                    className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <img 
                      src={image} 
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
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
            {project.links && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Project Links</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
                  {project.links.demo && (
                    <a 
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Globe size={18} className="mr-2" />
                      Live Demo
                    </a>
                  )}
                  {project.links.github && (
                    <a 
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Github size={18} className="mr-2" />
                      Source Code
                    </a>
                  )}
                  {project.links.documentation && (
                    <a 
                      href={project.links.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <FileText size={18} className="mr-2" />
                      Documentation
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
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={relatedProject.imageUrl} 
                      alt={relatedProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
    </div>
  );
};

export default ProjectDetails;