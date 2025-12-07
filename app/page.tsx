import Link from "next/link";
import PricingSection from "@/components/PricingSection";

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

      {/* Mission Section */}
      <section className="w-full py-12 sm:py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
              ✦ Our Mission
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Build for You. Build for the Future.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base">
              We exist to empower the next generation of technologists, creators, and problem-solvers
              through education, community, and hands-on experience.
            </p>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 sm:p-8 text-center max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
              &quot;To create a welcoming space where students can discover their passion for technology,
              develop real-world skills, and build lasting connections that extend beyond graduation.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              These principles guide everything we do as a community.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">🤝</span>
              <h3 className="text-lg font-bold text-white mb-2">Inclusivity</h3>
              <p className="text-gray-400 text-sm">
                We welcome everyone, regardless of experience level or background. No question is too basic, no project too ambitious.
              </p>
            </div>
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">👥</span>
              <h3 className="text-lg font-bold text-white mb-2">Collaboration</h3>
              <p className="text-gray-400 text-sm">
                The best ideas come from working together. We foster partnerships, mentorships, and team projects.
              </p>
            </div>
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">🌱</span>
              <h3 className="text-lg font-bold text-white mb-2">Growth</h3>
              <p className="text-gray-400 text-sm">
                We&apos;re committed to continuous learning. Every workshop, event, and project is an opportunity to grow.
              </p>
            </div>
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">💡</span>
              <h3 className="text-lg font-bold text-white mb-2">Innovation</h3>
              <p className="text-gray-400 text-sm">
                We encourage creative thinking and experimentation. Failure is just a step toward success.
              </p>
            </div>
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">♡</span>
              <h3 className="text-lg font-bold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-sm">
                Beyond code, we&apos;re friends. We celebrate each other&apos;s wins and support each other through challenges.
              </p>
            </div>
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <span className="text-2xl mb-3 block">🎯</span>
              <h3 className="text-lg font-bold text-white mb-2">Impact</h3>
              <p className="text-gray-400 text-sm">
                We build with purpose. Our projects and initiatives aim to make a positive difference in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="w-full py-12 sm:py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
                ✦ Why Join Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Your Journey Starts Here
              </h2>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                Whether you&apos;re exploring tech for the first time or ready to level up your skills,
                the CS Society is your launchpad.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 mt-1">✓</span>
                  <div>
                    <span className="text-white font-medium">Real-world experience</span>
                    <p className="text-gray-400 text-sm">Work on projects that matter and build a portfolio that stands out.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 mt-1">✓</span>
                  <div>
                    <span className="text-white font-medium">Industry connections</span>
                    <p className="text-gray-400 text-sm">Network with professionals, alumni, and recruiters from top companies.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 mt-1">✓</span>
                  <div>
                    <span className="text-white font-medium">Lifelong friendships</span>
                    <p className="text-gray-400 text-sm">Meet like-minded people who share your passion for technology.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 mt-1">✓</span>
                  <div>
                    <span className="text-white font-medium">All-inclusive access</span>
                    <p className="text-gray-400 text-sm">One flat fee unlocks every workshop, event, and resource we offer.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-4">What Our Members Say</h3>
              <div className="space-y-4">
                <blockquote className="border-l-2 border-cyan-500 pl-4">
                  <p className="text-gray-300 text-sm italic mb-2">
                    &quot;I came in knowing nothing about coding. Now I&apos;m interning at a tech company. The mentorship here changed my life.&quot;
                  </p>
                  <cite className="text-cyan-400 text-sm">— Jamie, Class of &apos;25</cite>
                </blockquote>
                <blockquote className="border-l-2 border-purple-500 pl-4">
                  <p className="text-gray-300 text-sm italic mb-2">
                    &quot;The hackathons pushed me to build things I never thought possible. Plus, I made some of my best friends here.&quot;
                  </p>
                  <cite className="text-purple-400 text-sm">— Alex, Class of &apos;24</cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn by Building Section */}
      <section className="w-full py-12 sm:py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
              ✦ Learn by Doing
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Build Real Projects. Grow Real Skills.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base">
              The best way to learn is by doing. Through hands-on projects, pair programming, and collaborative hackathons,
              you&apos;ll gain the practical experience that sets you apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {/* Project Building */}
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Project Building</h3>
              <p className="text-gray-400 text-sm">
                Turn ideas into reality. Build portfolio-worthy projects with guidance from mentors and peers who&apos;ve been there.
              </p>
            </div>

            {/* Pair Programming */}
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👩‍💻</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pair Programming</h3>
              <p className="text-gray-400 text-sm">
                Two minds are better than one. Learn faster, catch bugs sooner, and pick up best practices by coding alongside others.
              </p>
            </div>

            {/* Hackathons */}
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hackathon Collabs</h3>
              <p className="text-gray-400 text-sm">
                48 hours to build something amazing. Experience the thrill of rapid prototyping, teamwork under pressure, and creative problem-solving.
              </p>
            </div>

            {/* Networking */}
            <div className="card-hover bg-[#0f1d32]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Networking</h3>
              <p className="text-gray-400 text-sm">
                Connect with industry professionals, alumni mentors, and fellow students. Your next opportunity could be one conversation away.
              </p>
            </div>
          </div>

          {/* Skills & Growth Highlight */}
          <div className="bg-gradient-to-r from-[#0f1d32] to-[#1a2a42] border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  From Classroom to Career-Ready
                </h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">
                  Academic knowledge is just the beginning. Our hands-on programs bridge the gap between
                  what you learn in class and what employers actually want.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300 text-sm">
                    <span className="text-cyan-400 mr-2">→</span>
                    Git workflows &amp; collaborative coding practices
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <span className="text-cyan-400 mr-2">→</span>
                    Code reviews &amp; constructive feedback
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <span className="text-cyan-400 mr-2">→</span>
                    Agile methodologies &amp; project management
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <span className="text-cyan-400 mr-2">→</span>
                    Technical communication &amp; documentation
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a1628] rounded-lg p-4 text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-cyan-400">25+</span>
                  <p className="text-gray-400 text-sm mt-1">Workshops per year</p>
                </div>
                <div className="bg-[#0a1628] rounded-lg p-4 text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-purple-400">2</span>
                  <p className="text-gray-400 text-sm mt-1">Annual hackathons</p>
                </div>
                <div className="bg-[#0a1628] rounded-lg p-4 text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-orange-400">100+</span>
                  <p className="text-gray-400 text-sm mt-1">Projects launched</p>
                </div>
                <div className="bg-[#0a1628] rounded-lg p-4 text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-green-400">85%</span>
                  <p className="text-gray-400 text-sm mt-1">Job placement rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved & Partners Section */}
      <section className="w-full py-12 sm:py-16 border-t border-gray-800/50">
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

      {/* Membership Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>
    </div>
  );
}
