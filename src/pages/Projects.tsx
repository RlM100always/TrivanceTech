import { useState, useEffect } from 'react';

import ProjectCard from '../components/ui/ProjectCard';

import { Search, Filter, FolderOpen } from 'lucide-react';

import { projectsData } from '../data/projects';
import SEO from '../components/seo/SEO';
import SectionHeading from '../components/ui/motion/SectionHeading';

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'Web', name: 'Web Development' },
  { id: 'Mobile', name: 'Mobile Development' },
  { id: 'Academic', name: 'Academic Projects' }
];

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    filterProjects();
  }, [activeCategory, searchTerm]);

  const filterProjects = () => {
    let filtered = projectsData;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.title.toLowerCase().includes(term) ||
          project.type.toLowerCase().includes(term) ||
          project.clientName.toLowerCase().includes(term)
      );
    }
    
    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 sm:py-20">
      <SEO
        title="Our Portfolio — Real Web, Mobile & AI Projects"
        description="Browse real client projects delivered by AiTechWorlds — web platforms, Android apps, and academic software, with live demos and Play Store links."
        path="/projects"
        keywords={['software portfolio', 'web development portfolio', 'mobile app portfolio', 'AiTechWorlds projects']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Work Speaks First"
          eyebrowIcon={<FolderOpen size={16} className="mr-1" />}
          title="Every Project, Delivered and Live"
          highlight="Delivered and Live"
          description="No mockups, no concept art — every project below shipped to real users. Filter by category to see work closest to what you're planning."
        />

        {/* Search and Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center mr-2">
                <Filter size={16} className="mr-1" />
                <span>Filter by:</span>
              </div>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-neutral-400 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;