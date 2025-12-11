import Link from "next/link";

export const metadata = {
  title: "About Us | CS Society",
  description: "Learn about the Computer Science Society - our story, our team, and our community.",
};

export default function AboutPage() {
  const teamMembers = [
    { name: "Emily Portalatin-Mendez", role: "President", emoji: "👩‍💻" },
    { name: "Jennypher Pepin", role: "Marketing Lead", emoji: "👩‍💼" },
    { name: "Alexa Weinberg", role: "Support Lead", emoji: "📅" },
    { name: "Open Role", role: "Tech Lead", emoji: "⚙️" },
    { name: "Open Role", role: "Outreach Lead", emoji: "🌐" },
    { name: "Open Role", role: "Secretary", emoji: "📝" },
  ];

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "50+", label: "Events Per Year" },
    { number: "100+", label: "Projects Showcased" },
    { number: "20+", label: "Industry Partners" },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ About Us
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everyone Belongs Here
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The Computer Science Society is a student-led organization dedicated to fostering
            a welcoming community for anyone interested in technology, from beginners to experts.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 animate-fade-in-up animation-delay-200">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 text-center card-hover">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Story</h2>
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <p className="text-gray-300 mb-4">
              Founded in 2024, the Computer Science Society started with a simple mission: create a space
              where students and aspiring professionals could learn, collaborate, and grow together. 
              What began as a small group of passionate coders has evolved into a 
              thriving community of of creative members.
            </p>
            <p className="text-gray-300 mb-4">
              We believe that everyone has the potential to create amazing things with technology. Whether
              you&apos;re writing your first line of code or architecting complex systems, there&apos;s a place
              for you here.
            </p>
            <p className="text-gray-300">
              Our society hosts workshops, hackathons, networking events, and social gatherings throughout
              the year. We&apos;re more than just a club—we&apos;re a community of friends, mentors, and future
              industry leaders.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 text-center card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#1a2a42] rounded-full flex items-center justify-center text-3xl">
                  {member.emoji}
                </div>
                <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-gray-400 mb-6">
            Become part of our growing community and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events" className="btn-animated">
              <span className="btn-text">View Upcoming Events</span>
            </Link>
            <Link href="/contact" className="btn-animated-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
