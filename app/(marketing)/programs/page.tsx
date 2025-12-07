import Link from "next/link";

export const metadata = {
  title: "Programs | CS Society",
  description: "Explore our diverse programs including hackathons, workshops, and community events across New York City.",
};

export default function ProgramsPage() {
  const programs = [
    {
      title: "Hackathons",
      icon: "💻",
      description: "Join our themed hackathons that explore cutting-edge technologies and solve real-world problems.",
      themes: ["AI & Machine Learning", "Web3 & Blockchain", "FinTech", "HealthTech", "Sustainability"],
    },
    {
      title: "Workshops & Bootcamps",
      icon: "🎓",
      description: "Hands-on learning experiences led by industry experts and experienced mentors.",
      themes: ["Full-Stack Development", "Data Science", "Cloud Computing", "Mobile Development", "DevOps"],
    },
    {
      title: "Mentorship Programs",
      icon: "🤝",
      description: "Connect with experienced professionals who guide you through your tech journey.",
      themes: ["Career Guidance", "Technical Skills", "Project Development", "Interview Prep", "Networking"],
    },
    {
      title: "Speaker Series",
      icon: "🎤",
      description: "Hear from industry leaders, founders, and innovators shaping the future of technology.",
      themes: ["Tech Talks", "Founder Stories", "Industry Insights", "Career Panels", "Innovation Showcases"],
    },
  ];

  const participationTypes = [
    {
      role: "Participant",
      description: "Join our events, build projects, learn new skills, and connect with the community.",
      benefits: ["Hands-on experience", "Networking opportunities", "Prizes & recognition", "Skill development"],
    },
    {
      role: "Volunteer",
      description: "Help make our events successful while gaining leadership and organizational experience.",
      benefits: ["Leadership skills", "Event planning experience", "Community impact", "Exclusive perks"],
    },
    {
      role: "Mentor",
      description: "Share your expertise and guide the next generation of technologists.",
      benefits: ["Give back to community", "Develop coaching skills", "Expand network", "Recognition"],
    },
    {
      role: "Speaker",
      description: "Share your knowledge, experiences, and insights with our engaged community.",
      benefits: ["Thought leadership", "Brand visibility", "Community engagement", "Professional growth"],
    },
    {
      role: "Organizational Partner",
      description: "Collaborate with us to create impactful programs and reach talented students.",
      benefits: ["Brand exposure", "Talent pipeline", "Community engagement", "Custom programs"],
    },
    {
      role: "Event Sponsor",
      description: "Support innovation and connect with the brightest minds in tech.",
      benefits: ["Brand visibility", "Recruiting access", "Community goodwill", "Networking opportunities"],
    },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Our Programs
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Programs for <span className="text-cyan-400">Everyone</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Whether you&apos;re a participant, volunteer, mentor, speaker, organizational partner, or event sponsor —
            we offer hackathons and programs that cater to the themes, industries, and emerging trends across New York City.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{program.title}</h3>
                <p className="text-gray-400 mb-4">{program.description}</p>
                <div className="flex flex-wrap gap-2">
                  {program.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Get Involved */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">How to Get Involved</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            There&apos;s a place for everyone in our community. Choose the role that fits you best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participationTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-white mb-3">{type.role}</h3>
                <p className="text-gray-400 mb-4 text-sm">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="text-cyan-400 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Hackathons */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">Upcoming Hackathons</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Join our themed hackathons exploring the latest trends and technologies shaping NYC&apos;s tech ecosystem.
          </p>
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <p className="text-gray-300 mb-6">
              Our next hackathon schedule will be announced soon. Stay tuned for exciting themes covering
              AI, Web3, FinTech, HealthTech, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="btn-animated">
                <span className="btn-text">View All Events</span>
              </Link>
              <Link href="/contact" className="btn-animated-secondary">
                Get Notified
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-400">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join our community today and be part of New York City&apos;s most vibrant tech community.
              Whether you want to learn, teach, or sponsor — there&apos;s a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/memberships" className="btn-animated">
                <span className="btn-text">Become a Member</span>
              </Link>
              <Link href="/sponsors" className="btn-animated-secondary">
                Sponsor Our Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
