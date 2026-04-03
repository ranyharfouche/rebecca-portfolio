'use client';

export default function OtherPassions() {
  const passions = [
    {
      title: "Certified Personal Trainer",
      organization: "Inspire Fitness Academy",
      period: "Freelance | Present",
      description: "Helping clients achieve their fitness goals through personalized training programs and nutritional guidance. Combining my passion for health and wellness with technical expertise to create effective, science-based fitness solutions."
    },
    {
      title: "BA in Computer Graphics & Animation",
      organization: "Notre Dame University - Louaize",
      period: "2023-2025",
      description: "Comprehensive study of 3D modeling, animation, visual effects, and digital art techniques. Mastering industry-standard software and developing a strong foundation in both artistic principles and technical execution."
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
