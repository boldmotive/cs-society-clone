import Link from "next/link";

export const metadata = {
  title: "Sponsors | CS Society",
  description: "Support the next generation of tech talent through sponsorship opportunities.",
};

export default function SponsorsPage() {
  const tiers = [
    {
      name: "Platinum",
      price: "$10,000+",
      color: "cyan",
      benefits: [
        "Premier logo placement on all materials",
        "Exclusive networking session with students",
        "4 recruiting event tickets",
        "Featured sponsor at flagship hackathon",
        "Social media spotlight (monthly)",
        "Speaking opportunity at major event",
        "First access to student resumes",
      ],
    },
    {
      name: "Gold",
      price: "$5,000",
      color: "yellow",
      benefits: [
        "Logo placement on website and events",
        "2 recruiting event tickets",
        "Booth at career fair",
        "Social media spotlight (quarterly)",
        "Workshop hosting opportunity",
        "Access to student project showcases",
      ],
    },
    {
      name: "Silver",
      price: "$2,500",
      color: "gray",
      benefits: [
        "Logo on website sponsors page",
        "1 recruiting event ticket",
        "Newsletter mention",
        "Job posting privileges",
        "Event attendance priority",
      ],
    },
  ];

  const getTierStyles = (color: string) => {
    switch (color) {
      case "cyan":
        return { border: "border-cyan-400", badge: "bg-cyan-500/20 text-cyan-300", highlight: "text-cyan-400" };
      case "yellow":
        return { border: "border-yellow-500", badge: "bg-yellow-500/20 text-yellow-300", highlight: "text-yellow-400" };
      default:
        return { border: "border-gray-500", badge: "bg-gray-500/20 text-gray-300", highlight: "text-gray-400" };
    }
  };

  const impactStats = [
    { number: "500+", label: "Students Reached" },
    { number: "50+", label: "Events Per Year" },
    { number: "85%", label: "Employment Rate" },
    { number: "20+", label: "Partner Companies" },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Support Us
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Become a Sponsor
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Invest in the future of tech by supporting student innovation, education,
            and career development at the Computer Science Society.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in-up animation-delay-200">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sponsorship Tiers */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const styles = getTierStyles(tier.color);
              return (
                <div key={index} className={`bg-[#0f1d32]/80 border ${styles.border} rounded-xl p-6 card-hover ${index === 0 ? 'md:scale-105 md:shadow-lg md:shadow-cyan-500/10' : ''}`}>
                  <div className="text-center mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles.badge} mb-3`}>
                      {tier.name}
                    </span>
                    <div className={`text-3xl font-bold ${styles.highlight}`}>{tier.price}</div>
                    <p className="text-gray-500 text-sm">per year</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className={styles.highlight}>✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className={`btn-animated${index !== 0 ? '-secondary' : ''} w-full text-center block`}>
                    <span className={index === 0 ? 'btn-text' : ''}>Get Started</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Sponsor */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Why Sponsor CS Society?</h2>
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Build Your Talent Pipeline</h3>
                <p className="text-gray-400 mb-4">
                  Get early access to motivated, skilled students who are passionate about technology.
                  Our members go on to work at top tech companies and startups.
                </p>
                <p className="text-gray-400">
                  Sponsorship gives you direct access to recruit from a diverse pool of talented
                  computer science students at various stages of their education.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Enhance Your Brand</h3>
                <p className="text-gray-400 mb-4">
                  Position your company as an industry leader that invests in education and
                  supports the next generation of tech professionals.
                </p>
                <p className="text-gray-400">
                  Your brand will be visible at our events, on our website, and across our
                  social media channels reaching hundreds of engaged students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Make an Impact?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Let&apos;s discuss how a sponsorship can benefit both your organization and our students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Contact Our Team</span>
              </Link>
              <Link href="/media-kit" className="btn-animated-secondary">
                Download Sponsor Deck
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
