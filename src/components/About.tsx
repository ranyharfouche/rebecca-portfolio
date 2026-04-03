'use client';

export default function About() {
  const skills = [
    '3ds Max',
    'Adobe After Effects', 
    'Marvelous Designer',
    'Zbrush',
    'Substance Painter'
  ];

  return (
    <div className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Synthesizing Art & Technology
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              As a Computer Graphics Artist, I blend artistic vision with technical expertise to create stunning visual experiences. My work spans from 3D modeling and animation to digital art and visual effects, bringing imagination to life through cutting-edge technology.
            </p>
            
            {/* Skills & Platforms */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif text-white mb-4">Skills & Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <button
                    key={index}
                    className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:border-purple-400/50"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop"
                alt="Workspace with dual monitors"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
