import Link from "next/link";

export const metadata = {
  title: "Our Mission | CS Society",
  description: "Discover the mission, values, and goals that drive the Computer Science Society.",
};

export default function MissionPage() {
  const values = [
    {
      title: "Inclusivity",
      description: "We welcome everyone, regardless of experience level or background. No question is too basic, no project too ambitious.",
      icon: "🤝",
    },
    {
      title: "Collaboration",
      description: "The best ideas come from working together. We foster partnerships, mentorships, and team projects.",
      icon: "👥",
    },
    {
      title: "Growth",
      description: "We&apos;re committed to continuous learning. Every workshop, event, and project is an opportunity to grow.",
      icon: "🌱",
    },
    {
      title: "Innovation",
      description: "We encourage creative thinking and experimentation. Failure is just a step toward success.",
      icon: "💡",
    },
    {
      title: "Community",
      description: "Beyond code, we&apos;re friends. We celebrate each other&apos;s wins and support each other through challenges.",
      icon: "♡",
    },
    {
      title: "Impact",
      description: "We build with purpose. Our projects and initiatives aim to make a positive difference.",
      icon: "🎯",
    },
  ];

  const goals = [
    "Provide accessible learning resources for all skill levels",
    "Connect students with industry professionals and opportunities",
    "Host engaging events that combine learning with community building",
    "Showcase and support student projects and innovations",
    "Create pathways for career development in tech",
    "Foster a supportive environment for underrepresented groups in CS",
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Build for You.<br />Build for the Future.
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            We exist to empower the next generation of technologists, creators, and problem-solvers
            through education, community, and hands-on experience.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16 animate-fade-in-up animation-delay-200">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10 text-center">
            <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
              &quot;To create a welcoming space where students can discover their passion for technology,
              develop real-world skills, and build lasting connections that extend beyond graduation.&quot;
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 card-hover">
                <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Goals */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Our Goals</h2>
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <ul className="space-y-4">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Whether you want to learn, teach, or simply be part of something meaningful—there&apos;s a role for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-animated">
              <span className="btn-text">Learn About Us</span>
            </Link>
            <Link href="/contact" className="btn-animated-secondary">
              Get Involved
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
