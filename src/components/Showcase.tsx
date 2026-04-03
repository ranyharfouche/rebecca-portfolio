'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  platforms: string[];
  image: string;
}

export default function Showcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

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
        const maxScroll = projects.length - 3;
        if (prev >= maxScroll) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000); // Slower, more elegant scroll

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
            style={{ transform: `translateX(-${scrollPosition * 33.333}%)` }}
          >
            {[...projects, ...projects, ...projects].map((project, index) => (
              <div key={`${project.id}-${index}`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-400/40 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-white mb-2">{project.title}</h3>
                    <p className="text-purple-300 text-sm mb-3">{project.category}</p>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{project.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-purple-300 text-xs font-semibold mb-2">Platforms/Tech:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.platforms.map((platform, idx) => (
                          <span key={idx} className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
                      <Info className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Project thumbnails */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="relative group overflow-hidden rounded-lg">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white text-sm font-medium p-3">{project.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
