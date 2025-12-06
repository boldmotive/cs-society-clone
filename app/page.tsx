import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full" style={{ backgroundColor: '#0a1628' }}>
      {/* Hero & Features Gradient Background Container */}
      <div className="gradient-bg" style={{ backgroundColor: '#0a1628' }}>
        {/* Animated gradient orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />

        {/* Mesh gradient overlay */}
        <div className="gradient-mesh" />

        {/* Hero Section */}
        <section className="w-full py-12 sm:py-16 md:py-20 gradient-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="animate-fade-in-up inline-block px-3 sm:px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm mb-4 sm:mb-6">
                ✦ Everyone belongs here
              </span>
              <h1 className="animate-fade-in-up animation-delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Welcome to your<br />
                <span className="text-cyan-400">Digital Clubhouse</span>
              </h1>
              <p className="animate-fade-in-up animation-delay-200 text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Whether you&apos;re writing your first &quot;Hello World&quot; or building complex systems, there&apos;s a place for you here. No experience needed, just passion.
              </p>
              <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="/events"
                  className="btn-glow bg-cyan-500 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  See What&apos;s Happening
                  <span className="arrow">→</span>
                </Link>
                <Link
                  href="/projects"
                  className="btn-secondary bg-transparent text-white px-5 sm:px-6 py-3 rounded-lg font-semibold border border-gray-600 text-sm sm:text-base"
                >
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 sm:py-16 gradient-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="animate-fade-in-up animation-delay-400 card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center mb-4">
                  <span className="text-cyan-400 text-xl">♡</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Inclusive Community</h3>
                <p className="text-gray-400 text-sm">
                  A safe space for discussions, ideas, and sharing your learning journey. We lift each other up.
                </p>
              </div>
              <div className="animate-fade-in-up animation-delay-500 card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center mb-4">
                  <span className="text-cyan-400 text-xl">🎓</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Accessible Learning</h3>
                <p className="text-gray-400 text-sm">
                  Beginner-friendly tutorials and mentors ready to answer questions, no matter how small.
                </p>
              </div>
              <div className="animate-fade-in-up animation-delay-600 card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center mb-4">
                  <span className="text-cyan-400 text-xl">👥</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Collaborative Spirit</h3>
                <p className="text-gray-400 text-sm">
                  Join study jams, hackathons, and projects. We focus on fun and learning, not just competition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Get Involved & Partners Section */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Get Involved */}
            <div className="animate-fade-in-up animation-delay-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Get Involved</h2>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                We&apos;re more than just coders. We need writers, designers, event helpers, and idea generators.
              </p>
              <ul className="space-y-3 mb-4 sm:mb-6">
                <li className="list-item-hover flex items-center text-gray-300 cursor-pointer py-1">
                  <span className="text-cyan-400 mr-3">✦</span>
                  Volunteer for events
                </li>
                <li className="list-item-hover flex items-center text-gray-300 cursor-pointer py-1">
                  <span className="text-cyan-400 mr-3">✦</span>
                  Write for our blog
                </li>
                <li className="list-item-hover flex items-center text-gray-300 cursor-pointer py-1">
                  <span className="text-cyan-400 mr-3">✦</span>
                  Mentor a fellow student
                </li>
              </ul>
              <Link href="/events" className="link-arrow text-cyan-400 font-semibold inline-flex items-center gap-1 text-sm sm:text-base">
                Learn how to join the team <span className="arrow">→</span>
              </Link>
            </div>

            {/* Our Partners */}
            <div className="animate-fade-in-up animation-delay-800 card-hover bg-[#0f1d32] border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Our Partners</h3>
              <p className="text-gray-400 text-sm mb-4 sm:mb-6">
                A huge thank you to the faculty, alumni, and organizations that support our mission to make tech accessible to everyone.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="partner-hover bg-[#1a2a42] border border-gray-600/30 rounded-lg h-10 sm:h-12"></div>
                <div className="partner-hover bg-[#1a2a42] border border-gray-600/30 rounded-lg h-10 sm:h-12"></div>
                <div className="partner-hover bg-[#1a2a42] border border-gray-600/30 rounded-lg h-10 sm:h-12"></div>
                <div className="partner-hover bg-[#1a2a42] border border-gray-600/30 rounded-lg h-10 sm:h-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
