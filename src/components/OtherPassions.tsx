'use client';

export default function OtherPassions() {
  const passions = [
    {
      title: "Certified Personal Trainer",
      organization: "Inspire Fitness Academy",
      period: "Freelance | Present",
      description: "Helping individuals improve strength, mobility, and overall performance through customized training programs. Focused on calisthenics, gym training, and long-term functional health."
    },
    {
      title: "BA in Computer Graphics & Animation",
      organization: "Notre Dame University - Louaize",
      period: "2023-2025",
      description: "Completed second year of studies, focusing on 3D modeling, animation, and visual effects."
    }
  ];

  return (
    <div className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {passions.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8 hover:border-purple-400/40 transition-all duration-300">
              <h3 className="text-2xl font-serif text-white mb-3">{item.title}</h3>
              <div className="text-purple-300 mb-4">
                <p className="font-medium">{item.organization}</p>
                <p className="text-sm">{item.period}</p>
              </div>
              <p className="text-white/80 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
