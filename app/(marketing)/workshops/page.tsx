import Link from "next/link";

export const metadata = {
  title: "Workshops | CS Society",
  description: "Join our hands-on workshops including Speaker Series and 4 Hours To Prototype sessions. Learn from industry experts and build real projects.",
};

// TypeScript Types
interface Speaker {
  name: string;
  title: string;
  company?: string;
}

interface Workshop {
  id: number;
  title: string;
  type: 'Speaker Series' | '4 Hours To Prototype';
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  speaker?: Speaker;
  topics: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  capacity?: number;
  status: 'Upcoming' | 'Registration Open' | 'Full' | 'Completed';
}

// Workshop type descriptions
const workshopTypes = [
  {
    title: "Speaker Series",
    icon: "🎤",
    description: "Learn from industry leaders and experienced professionals who share insights on cutting-edge technologies, career growth, and real-world experiences.",
    highlights: ["Industry expert talks", "Q&A sessions", "Networking opportunities", "Career insights"],
    color: "cyan",
  },
  {
    title: "4 Hours To Prototype",
    icon: "🚀",
    description: "Intensive hands-on sessions where you go from idea to working prototype in just 4 hours. Build real projects with guidance from experienced mentors.",
    highlights: ["Hands-on building", "Mentor support", "Real deliverables", "Team collaboration"],
    color: "purple",
  },
];

// Sample workshop data
const upcomingWorkshops: Workshop[] = [
  {
    id: 1,
    title: "Building AI-Powered Apps with OpenAI",
    type: "4 Hours To Prototype",
    description: "Learn to integrate AI into your applications. We'll build a functional AI chatbot from scratch using Next.js and the OpenAI API.",
    date: "2025-01-18",
    time: "10:00 AM",
    duration: "4 hours",
    location: "Tech Hub NYC & Zoom",
    speaker: { name: "Maya Chen", title: "Senior AI Engineer", company: "TechCorp" },
    topics: ["OpenAI API", "Next.js", "Prompt Engineering"],
    level: "Intermediate",
    capacity: 30,
    status: "Registration Open",
  },
  {
    id: 2,
    title: "From Startup to Scale: Lessons Learned",
    type: "Speaker Series",
    description: "Join us for an inspiring talk about building and scaling a tech startup. Hear firsthand experiences, challenges, and strategies for success.",
    date: "2025-01-25",
    time: "6:00 PM",
    duration: "1.5 hours",
    location: "Main Auditorium & Zoom",
    speaker: { name: "David Park", title: "Founder & CEO", company: "ScaleUp Inc" },
    topics: ["Entrepreneurship", "Fundraising", "Team Building"],
    level: "All Levels",
    status: "Registration Open",
  },
  {
    id: 3,
    title: "Full-Stack Web App in 4 Hours",
    type: "4 Hours To Prototype",
    description: "Build a complete web application with authentication, database, and deployment. Perfect for those ready to level up their full-stack skills.",
    date: "2025-02-01",
    time: "10:00 AM",
    duration: "4 hours",
    location: "Innovation Lab & Zoom",
    speaker: { name: "Alex Rivera", title: "Full-Stack Developer", company: "DevStudio" },
    topics: ["React", "Node.js", "PostgreSQL", "Deployment"],
    level: "Intermediate",
    capacity: 25,
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Breaking Into Big Tech",
    type: "Speaker Series",
    description: "A panel of engineers from top tech companies share their journey, interview tips, and what it takes to land your dream job.",
    date: "2025-02-08",
    time: "5:00 PM",
    duration: "2 hours",
    location: "Conference Room A & Zoom",
    topics: ["Career Growth", "Interviews", "Resume Tips"],
    level: "All Levels",
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Mobile App Development Sprint",
    type: "4 Hours To Prototype",
    description: "Create a cross-platform mobile app using React Native. Go from zero to a deployed app on your phone in just 4 hours.",
    date: "2025-02-15",
    time: "10:00 AM",
    duration: "4 hours",
    location: "Tech Hub NYC & Zoom",
    speaker: { name: "Jordan Lee", title: "Mobile Lead", company: "AppWorks" },
    topics: ["React Native", "Mobile UI", "App Store Basics"],
    level: "Beginner",
    capacity: 30,
    status: "Upcoming",
  },
  {
    id: 6,
    title: "The Future of Web3 & Blockchain",
    type: "Speaker Series",
    description: "Explore the evolving landscape of decentralized technologies and understand where blockchain is headed in the next decade.",
    date: "2025-02-22",
    time: "6:00 PM",
    duration: "1.5 hours",
    location: "Main Auditorium & Zoom",
    speaker: { name: "Priya Sharma", title: "Blockchain Researcher", company: "CryptoLabs" },
    topics: ["Web3", "Smart Contracts", "DeFi"],
    level: "All Levels",
    status: "Upcoming",
  },
];

// Helper functions
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return { month, day };
}

function getTypeStyles(type: Workshop['type']) {
  if (type === 'Speaker Series') {
    return { bg: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee', border: 'border-cyan-500/30' };
  }
  return { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: 'border-purple-500/30' };
}

function getStatusStyles(status: Workshop['status']) {
  switch (status) {
    case 'Registration Open':
      return { bg: 'bg-green-500/20', text: 'text-green-400' };
    case 'Full':
      return { bg: 'bg-red-500/20', text: 'text-red-400' };
    case 'Completed':
      return { bg: 'bg-gray-500/20', text: 'text-gray-400' };
    default:
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' };
  }
}

function getLevelStyles(level: Workshop['level']) {
  switch (level) {
    case 'Beginner':
      return { bg: 'bg-green-500/10', text: 'text-green-400' };
    case 'Intermediate':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
    case 'Advanced':
      return { bg: 'bg-red-500/10', text: 'text-red-400' };
    default:
      return { bg: 'bg-blue-500/10', text: 'text-blue-400' };
  }
}

export default function WorkshopsPage() {
  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Hands-On Learning
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Learn by <span className="text-cyan-400">Building</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            From inspiring talks by industry leaders to intensive prototype sessions—our workshops
            are designed to help you gain real skills and build meaningful projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-animated">
              <span className="btn-text">Sign Up for Workshops</span>
            </Link>
            <Link href="/events" className="btn-animated-secondary">
              View All Events
            </Link>
          </div>
        </div>

        {/* Workshop Types Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">Our Workshop Formats</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            We offer two distinct workshop formats to cater to different learning styles and goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshopTypes.map((type, index) => (
              <div
                key={type.title}
                className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${type.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-500/40' : 'border-purple-500/20 hover:border-purple-500/40'} rounded-xl p-6 sm:p-8 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-gray-400 mb-6">{type.description}</p>
                <div className="space-y-2">
                  {type.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-300">
                      <span className={type.color === 'cyan' ? 'text-cyan-400 mr-2' : 'text-purple-400 mr-2'}>✓</span>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Workshops Grid */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">Upcoming Workshops</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Reserve your spot in our upcoming workshops. Members get priority access and early registration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWorkshops.map((workshop, index) => {
              const { month, day } = formatDate(workshop.date);
              const typeStyles = getTypeStyles(workshop.type);
              const statusStyles = getStatusStyles(workshop.status);
              const levelStyles = getLevelStyles(workshop.level);

              return (
                <div
                  key={workshop.id}
                  className="event-card animate-fade-in-up"
                  style={{ animationDelay: `${(index % 3 + 1) * 100}ms` }}
                >
                  {/* Date Badge */}
                  <div className="event-card-date">
                    <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">{month}</div>
                    <div className="text-2xl sm:text-3xl font-bold text-white leading-none">{day}</div>
                  </div>

                  {/* Type & Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="event-type-badge text-xs"
                      style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                    >
                      {workshop.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                      {workshop.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="event-card-title text-lg">{workshop.title}</h3>

                  {/* Meta Info */}
                  <div className="event-card-meta text-sm">
                    <div className="event-meta-item">
                      <span>🕐</span>
                      <span>{workshop.time} ({workshop.duration})</span>
                    </div>
                    <div className="event-meta-item">
                      <span>📍</span>
                      <span>{workshop.location}</span>
                    </div>
                    {workshop.speaker && (
                      <div className="event-meta-item">
                        <span>👤</span>
                        <span>{workshop.speaker.name}{workshop.speaker.company && `, ${workshop.speaker.company}`}</span>
                      </div>
                    )}
                  </div>

                  {/* Level Badge */}
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${levelStyles.bg} ${levelStyles.text}`}>
                      {workshop.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="event-card-description text-sm">{workshop.description}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {workshop.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className={`btn-animated w-full text-center ${workshop.status === 'Full' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <span className="btn-text">
                      {workshop.status === 'Full' ? 'Workshop Full' : 'Register Now'}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Join Our Workshops Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-purple-500/30 text-purple-400 text-sm mb-4">
              ✦ Why Attend
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              What You&apos;ll Get From Our Workshops
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our workshops are designed to maximize your learning and help you build real skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '🛠️', title: 'Hands-On Projects', description: 'Build real projects you can add to your portfolio' },
              { icon: '👨‍🏫', title: 'Expert Guidance', description: 'Learn from industry professionals and mentors' },
              { icon: '🤝', title: 'Peer Collaboration', description: 'Work alongside motivated peers and expand your network' },
              { icon: '📜', title: 'Certificates', description: 'Earn certificates of completion for your resume' },
            ].map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center card-hover">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Priority Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Members Get Priority Access
                </h2>
                <p className="text-gray-400 mb-6">
                  CS Society members enjoy exclusive benefits including early registration,
                  reserved spots, and discounts on premium workshops.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    '48-hour early access to registration',
                    'Reserved spots in high-demand workshops',
                    'Exclusive member-only workshop sessions',
                    'Free access to workshop recordings',
                  ].map((perk, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <span className="text-cyan-400 mr-2">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/memberships" className="btn-animated">
                  <span className="btn-text">View Membership Plans</span>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <div className="text-9xl opacity-50">🎓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-600">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Have an Idea for a Workshop?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We&apos;re always looking for passionate speakers and workshop facilitators.
              If you have expertise to share, we&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Propose a Workshop</span>
              </Link>
              <Link href="/partners" className="btn-animated-secondary">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

