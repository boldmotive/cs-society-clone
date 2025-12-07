import Link from "next/link";

export const metadata = {
  title: "Partners | CS Society",
  description: "Meet our industry and community partners who help make CS Society possible.",
};

export default function PartnersPage() {
  const partners = [
    { name: "TechCorp Inc.", type: "Industry Partner", description: "Supporting student internships and mentorship programs", tier: "platinum" },
    { name: "CloudBase", type: "Technology Partner", description: "Providing cloud infrastructure for student projects", tier: "gold" },
    { name: "DevTools Co.", type: "Resource Partner", description: "Free licenses for development tools and software", tier: "gold" },
    { name: "StartupHub", type: "Community Partner", description: "Connecting students with startup opportunities", tier: "silver" },
    { name: "Code Academy", type: "Education Partner", description: "Discounted courses and learning resources", tier: "silver" },
    { name: "Tech Meetups NYC", type: "Community Partner", description: "Joint events and networking opportunities", tier: "silver" },
  ];

  const benefits = [
    { icon: "👥", title: "Access to Talent", description: "Connect with motivated CS students looking for opportunities" },
    { icon: "🎯", title: "Brand Visibility", description: "Showcase your company to the next generation of tech professionals" },
    { icon: "🎪", title: "Event Participation", description: "Sponsor and participate in hackathons, workshops, and career fairs" },
    { icon: "💡", title: "Innovation", description: "Collaborate on projects and get fresh perspectives from students" },
  ];

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "platinum":
        return { border: "border-cyan-400/50", badge: "bg-cyan-500/20 text-cyan-300" };
      case "gold":
        return { border: "border-yellow-500/50", badge: "bg-yellow-500/20 text-yellow-300" };
      default:
        return { border: "border-gray-500/50", badge: "bg-gray-500/20 text-gray-300" };
    }
  };

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Our Partners
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Building Together
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We&apos;re proud to partner with industry leaders and community organizations
            who share our vision of empowering the next generation of technologists.
          </p>
        </div>

        {/* Current Partners */}
        <div className="mb-16 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Current Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => {
              const styles = getTierStyles(partner.tier);
              return (
                <div key={index} className={`bg-[#0f1d32]/80 border ${styles.border} rounded-xl p-6 card-hover`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {partner.name.charAt(0)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles.badge}`}>
                      {partner.tier}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{partner.name}</h3>
                  <p className="text-cyan-400 text-sm mb-2">{partner.type}</p>
                  <p className="text-gray-400 text-sm">{partner.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Partner CTA */}
        <div className="text-center animate-fade-in-up animation-delay-400">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Become a Partner</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Interested in partnering with the Computer Science Society? We offer various
              partnership tiers to fit your organization&apos;s goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Contact Us</span>
              </Link>
              <Link href="/sponsors" className="btn-animated-secondary">
                View Sponsorship Options
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
