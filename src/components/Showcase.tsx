'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

export default function Showcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    
    // Set up polling to check for updates every 2 seconds for faster updates
    const interval = setInterval(fetchProjects, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    if (projects.length === 0) return;
    
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const cardWidth = 33.333; // 33.333% for 3 cards visible
        const maxScroll = projects.length * cardWidth;
        if (prev >= maxScroll) {
          return 0;
        }
        return prev + cardWidth;
      });
    }, 3000); // Move to next card every 3 seconds

    return () => clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) {
    return <div className="py-20 text-center">Loading projects...</div>;
  }

  return (
    <div className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-black to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-12">
          Showcase of Creations
        </h2>
        
        {/* Auto-scrolling showcase */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${scrollPosition}%)` }}
          >
            {[...projects, ...projects, ...projects].map((project, index) => (
              <div key={`${project.id}-${index}`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-400/40 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-800/30 flex items-center justify-center">
                        <div className="text-purple-400 text-4xl">📁</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-white mb-2">{project.title}</h3>
                    <p className="text-purple-300 text-sm mb-3">{project.category}</p>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{project.description}</p>
                    
                                        
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <Info className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-purple-900/90 backdrop-blur-md border border-purple-500/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-purple-600/80 hover:bg-purple-700 text-white p-2 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Project Image */}
              <div className="h-64 md:h-96 overflow-hidden">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-800/30 flex items-center justify-center">
                    <div className="text-purple-400 text-6xl">📁</div>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-6 md:p-8">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                  {selectedProject.title}
                </h2>
                <p className="text-purple-300 text-lg mb-6">
                  {selectedProject.category}
                </p>
                <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
