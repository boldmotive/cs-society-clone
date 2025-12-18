import Link from "next/link";

export const metadata = {
  title: "Hackathons | CS Society",
  description: "Join our themed hackathons to build innovative projects, compete for prizes, and connect with fellow developers. AI, Web3, FinTech, and more.",
};

// TypeScript Types
interface Prize {
  place: string;
  reward: string;
  description?: string;
}

interface Judge {
  name: string;
  title: string;
  company?: string;
}

interface PastWinner {
  team: string;
  project: string;
  hackathonName: string;
  prize: string;
  year: number;
}

interface Hackathon {
  id: number;
  title: string;
  theme: 'AI & Machine Learning' | 'Web3 & Blockchain' | 'FinTech' | 'HealthTech' | 'Sustainability' | 'Open Innovation' | 'Social Impact';
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  format: 'In-Person' | 'Virtual' | 'Hybrid';
  location: string;
  teamSize: { min: number; max: number };
  prizes: Prize[];
  totalPrizePool?: string;
  judges?: Judge[];
  eligibility: string;
  tracks?: string[];
  registrationDeadline: string;
  maxParticipants?: number;
  currentParticipants?: number;
  status: 'Coming Soon' | 'Registration Open' | 'Registration Closed' | 'In Progress' | 'Judging' | 'Completed';
}

// Theme descriptions
const hackathonThemes = [
  {
    theme: "AI & Machine Learning",
    icon: "🤖",
    description: "Build intelligent solutions using cutting-edge AI technologies, from chatbots to predictive models.",
    color: "cyan",
  },
  {
    theme: "Web3 & Blockchain",
    icon: "⛓️",
    description: "Create decentralized applications, smart contracts, and innovative blockchain solutions.",
    color: "purple",
  },
  {
    theme: "FinTech",
    icon: "💳",
    description: "Revolutionize finance with payment solutions, trading tools, and financial inclusion projects.",
    color: "green",
  },
  {
    theme: "HealthTech",
    icon: "🏥",
    description: "Develop healthcare innovations that improve patient care, diagnostics, and wellness.",
    color: "red",
  },
  {
    theme: "Sustainability",
    icon: "🌱",
    description: "Build solutions for environmental challenges, climate action, and sustainable development.",
    color: "emerald",
  },
  {
    theme: "Social Impact",
    icon: "🤝",
    description: "Create technology that addresses social issues and makes a positive community impact.",
    color: "orange",
  },
];

// Sample hackathon data
const upcomingHackathons: Hackathon[] = [
  {
    id: 1,
    title: "AI Innovation Challenge 2025",
    theme: "AI & Machine Learning",
    description: "Build the next generation of AI-powered applications. From LLMs to computer vision, push the boundaries of what's possible with artificial intelligence.",
    startDate: "2025-02-14",
    endDate: "2025-02-16",
    duration: "48 hours",
    format: "Hybrid",
    location: "Tech Hub NYC & Virtual",
    teamSize: { min: 2, max: 4 },
    prizes: [
      { place: "1st Place", reward: "$2,500", description: "Plus mentorship opportunity" },
      { place: "2nd Place", reward: "$1,500" },
      { place: "3rd Place", reward: "$1,000" },
    ],
    totalPrizePool: "$5,000+",
    judges: [
      { name: "Dr. Sarah Chen", title: "AI Research Lead", company: "TechCorp" },
      { name: "Marcus Johnson", title: "ML Engineer", company: "OpenAI" },
    ],
    eligibility: "Open to all students and early-career developers",
    tracks: ["Best LLM Application", "Best Computer Vision", "Most Innovative"],
    registrationDeadline: "2025-02-10",
    maxParticipants: 150,
    currentParticipants: 87,
    status: "Registration Open",
  },
  {
    id: 2,
    title: "GreenTech Hack",
    theme: "Sustainability",
    description: "Tackle environmental challenges with technology. Build solutions for climate action, renewable energy, waste reduction, or sustainable living.",
    startDate: "2025-03-08",
    endDate: "2025-03-09",
    duration: "24 hours",
    format: "In-Person",
    location: "Innovation Lab, Manhattan",
    teamSize: { min: 2, max: 5 },
    prizes: [
      { place: "1st Place", reward: "$1,500" },
      { place: "2nd Place", reward: "$1,000" },
      { place: "3rd Place", reward: "$500" },
    ],
    totalPrizePool: "$3,000",
    eligibility: "CS Society members and NYC students",
    tracks: ["Best Climate Solution", "Best Sustainability App", "People's Choice"],
    registrationDeadline: "2025-03-01",
    maxParticipants: 100,
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "FinTech Disrupt",
    theme: "FinTech",
    description: "Reimagine the future of finance. Build innovative payment solutions, trading platforms, DeFi applications, or financial inclusion tools.",
    startDate: "2025-04-04",
    endDate: "2025-04-06",
    duration: "Weekend",
    format: "Hybrid",
    location: "Financial District Campus & Virtual",
    teamSize: { min: 3, max: 5 },
    prizes: [
      { place: "1st Place", reward: "$3,500", description: "Plus investor pitch opportunity" },
      { place: "2nd Place", reward: "$2,500" },
      { place: "3rd Place", reward: "$1,500" },
    ],
    totalPrizePool: "$7,500+",
    eligibility: "Open to all participants",
    tracks: ["Best DeFi Solution", "Best Payment Innovation", "Best Financial Inclusion"],
    registrationDeadline: "2025-03-28",
    status: "Coming Soon",
  },
];

// Past winners showcase
const pastWinners: PastWinner[] = [
  {
    team: "Neural Nexus",
    project: "MedAssist AI",
    hackathonName: "Health Hack NYC 2024",
    prize: "1st Place",
    year: 2024,
  },
  {
    team: "Chain Builders",
    project: "DecentraVote",
    hackathonName: "Web3 Weekend 2024",
    prize: "1st Place",
    year: 2024,
  },
  {
    team: "EcoTech Squad",
    project: "CarbonTrack",
    hackathonName: "GreenTech Hack 2024",
    prize: "1st Place",
    year: 2024,
  },
  {
    team: "FinFlow",
    project: "PayBridge",
    hackathonName: "FinTech Disrupt 2024",
    prize: "Grand Prize",
    year: 2024,
  },
];

// FAQ data
const faqs = [
  {
    q: "Who can participate in CS Society hackathons?",
    a: "Most of our hackathons are open to all students and early-career developers. Some events may be exclusive to CS Society members. Check each hackathon's eligibility requirements for details.",
  },
  {
    q: "Can I participate solo or do I need a team?",
    a: "While we encourage team participation for the collaborative experience, most hackathons allow solo participants. You can also find teammates at our pre-hackathon mixer events!",
  },
  {
    q: "What if I don't have a project idea?",
    a: "No worries! Each hackathon has specific themes and tracks to inspire you. We also host ideation sessions at the start of each event and mentors are available to help brainstorm.",
  },
  {
    q: "What should I bring to an in-person hackathon?",
    a: "Bring your laptop, chargers, and any hardware you might need. We provide food, drinks, WiFi, and a comfortable workspace. Don't forget your enthusiasm!",
  },
  {
    q: "Are there prizes for all hackathons?",
    a: "Yes! All our hackathons feature cash prizes, swag, and additional perks like mentorship opportunities, internship interviews, or cloud credits from our sponsors.",
  },
];

// Helper functions
function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleString('en-US', { month: 'short' });
  const endMonth = end.toLocaleString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

function getThemeStyles(theme: Hackathon['theme']) {
  switch (theme) {
    case 'AI & Machine Learning':
      return { bg: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee', border: 'border-cyan-500/30' };
    case 'Web3 & Blockchain':
      return { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: 'border-purple-500/30' };
    case 'FinTech':
      return { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', border: 'border-green-500/30' };
    case 'HealthTech':
      return { bg: 'rgba(248, 113, 113, 0.2)', text: '#f87171', border: 'border-red-500/30' };
    case 'Sustainability':
      return { bg: 'rgba(52, 211, 153, 0.2)', text: '#34d399', border: 'border-emerald-500/30' };
    case 'Social Impact':
      return { bg: 'rgba(251, 146, 60, 0.2)', text: '#fb923c', border: 'border-orange-500/30' };
    default:
      return { bg: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa', border: 'border-blue-500/30' };
  }
}

function getStatusStyles(status: Hackathon['status']) {
  switch (status) {
    case 'Registration Open':
      return { bg: 'bg-green-500/20', text: 'text-green-400' };
    case 'Coming Soon':
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' };
    case 'Registration Closed':
      return { bg: 'bg-red-500/20', text: 'text-red-400' };
    case 'In Progress':
      return { bg: 'bg-cyan-500/20', text: 'text-cyan-400' };
    case 'Judging':
      return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
    case 'Completed':
      return { bg: 'bg-gray-500/20', text: 'text-gray-400' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-400' };
  }
}

function getFormatStyles(format: Hackathon['format']) {
  switch (format) {
    case 'In-Person':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400' };
    case 'Virtual':
      return { bg: 'bg-green-500/10', text: 'text-green-400' };
    case 'Hybrid':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400' };
    default:
      return { bg: 'bg-gray-500/10', text: 'text-gray-400' };
  }
}

export default function HackathonsPage() {
  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Build. Compete. Win.
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Build. Compete. <span className="text-cyan-400">Innovate.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Join our themed hackathons to build innovative projects, compete for prizes,
            and connect with fellow developers. From AI to sustainability—find your challenge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#upcoming" className="btn-animated">
              <span className="btn-text">View Upcoming Hackathons</span>
            </Link>
            <Link href="/login" className="btn-animated-secondary">
              Sign Up to Participate
            </Link>
          </div>
        </div>

        {/* What to Expect Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What to Expect</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our hackathons are designed to give you the best experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '🏆', title: 'Compete for Prizes', description: 'Win cash prizes, swag, and exclusive opportunities' },
              { icon: '🤝', title: 'Team Collaboration', description: 'Work with talented peers and make lasting connections' },
              { icon: '👨‍🏫', title: 'Mentor Support', description: 'Get guidance from industry experts throughout the event' },
              { icon: '🚀', title: 'Launch Your Project', description: 'Build a portfolio piece and potentially a startup' },
            ].map((item, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center card-hover">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hackathon Themes Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-300">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-purple-500/30 text-purple-400 text-sm mb-4">
              ✦ Themed Challenges
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Explore Our Themes</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each hackathon focuses on a specific theme to help you dive deep into emerging technologies and industries.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {hackathonThemes.map((theme, index) => (
              <div
                key={theme.theme}
                className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${
                  theme.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-500/40' :
                  theme.color === 'purple' ? 'border-purple-500/20 hover:border-purple-500/40' :
                  theme.color === 'green' ? 'border-green-500/20 hover:border-green-500/40' :
                  theme.color === 'red' ? 'border-red-500/20 hover:border-red-500/40' :
                  theme.color === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                  'border-orange-500/20 hover:border-orange-500/40'
                } rounded-xl p-5 transition-all duration-300`}
                style={{ animationDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="text-3xl mb-3">{theme.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{theme.theme}</h3>
                <p className="text-gray-400 text-sm">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Hackathons Grid */}
        <div id="upcoming" className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Upcoming Hackathons</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Register early to secure your spot. Members get priority access and early registration.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingHackathons.map((hackathon, index) => {
              const themeStyles = getThemeStyles(hackathon.theme);
              const statusStyles = getStatusStyles(hackathon.status);
              const formatStyles = getFormatStyles(hackathon.format);
              const dateRange = formatDateRange(hackathon.startDate, hackathon.endDate);

              return (
                <div
                  key={hackathon.id}
                  className="event-card animate-fade-in-up"
                  style={{ animationDelay: `${(index % 3 + 1) * 100}ms` }}
                >
                  {/* Theme & Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="event-type-badge text-xs"
                      style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}
                    >
                      {hackathon.theme}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                      {hackathon.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="event-card-title text-xl mb-2">{hackathon.title}</h3>

                  {/* Prize Pool Highlight */}
                  {hackathon.totalPrizePool && (
                    <div className="text-cyan-400 font-bold text-lg mb-3">
                      {hackathon.totalPrizePool} in Prizes
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="event-card-meta text-sm mb-3">
                    <div className="event-meta-item">
                      <span>📅</span>
                      <span>{dateRange} ({hackathon.duration})</span>
                    </div>
                    <div className="event-meta-item">
                      <span>📍</span>
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="event-meta-item">
                      <span>👥</span>
                      <span>Teams of {hackathon.teamSize.min}-{hackathon.teamSize.max}</span>
                    </div>
                    <div className="event-meta-item">
                      <span>⏰</span>
                      <span>Register by {new Date(hackathon.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Format Badge */}
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${formatStyles.bg} ${formatStyles.text}`}>
                      {hackathon.format}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="event-card-description text-sm">{hackathon.description}</p>

                  {/* Tracks */}
                  {hackathon.tracks && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1.5">Tracks:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {hackathon.tracks.map((track, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300"
                          >
                            {track}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Participants Counter */}
                  {hackathon.maxParticipants && hackathon.currentParticipants !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{hackathon.currentParticipants} registered</span>
                        <span>{hackathon.maxParticipants - hackathon.currentParticipants} spots left</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-cyan-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(hackathon.currentParticipants / hackathon.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className={`btn-animated w-full text-center ${
                      hackathon.status === 'Registration Closed' || hackathon.status === 'Completed'
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                  >
                    <span className="btn-text">
                      {hackathon.status === 'Registration Open' ? 'Register Now' :
                       hackathon.status === 'Coming Soon' ? 'Get Notified' :
                       hackathon.status === 'Registration Closed' ? 'Registration Closed' :
                       'View Details'}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Register & Form Team", desc: "Sign up and find teammates or join solo" },
              { step: "2", title: "Attend Kickoff", desc: "Join the opening ceremony and start hacking" },
              { step: "3", title: "Build Your Project", desc: "Code, collaborate, and get mentor help" },
              { step: "4", title: "Present & Win", desc: "Demo your project and compete for prizes" },
            ].map((item, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center relative">
                <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-600">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Past Winners Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-600">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-yellow-500/30 text-yellow-400 text-sm mb-4">
              ✦ Hall of Fame
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Past Winners</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Celebrating the innovative projects and talented teams from our previous hackathons.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pastWinners.map((winner, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl p-5 card-hover"
              >
                <div className="text-2xl mb-3">🏆</div>
                <h3 className="text-white font-bold mb-1">{winner.project}</h3>
                <p className="text-cyan-400 text-sm mb-2">by {winner.team}</p>
                <p className="text-gray-500 text-xs mb-2">{winner.hackathonName}</p>
                <span className="inline-block px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                  {winner.prize}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Recognition */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up animation-delay-800">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Hackathon Sponsors</h2>
              <p className="text-gray-400">
                These amazing organizations make our hackathons possible.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['TechCorp', 'CloudBase', 'DevTools Co.', 'StartupHub', 'InnovateLabs'].map((sponsor, index) => (
                <div
                  key={index}
                  className="bg-[#1a2a42] px-6 py-3 rounded-lg text-gray-400 font-medium"
                >
                  {sponsor}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/sponsors" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                Become a Sponsor →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-900">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Hack?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who have built amazing projects at our hackathons.
              Create your free account to get notified about upcoming events and secure your spot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-animated">
                <span className="btn-text">Create Free Account</span>
              </Link>
              <Link href="/sponsors" className="btn-animated-secondary">
                Sponsor a Hackathon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

