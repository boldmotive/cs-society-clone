import Link from "next/link";
import PricingSection from "@/components/PricingSection";

export const metadata = {
  title: "Memberships | CS Society",
  description: "Join the CS Society community as a member, community partner, or industry partner.",
};

export default function MembershipsPage() {
  const communityPartnerBenefits = [
    { icon: "🤝", title: "Co-hosted Events", description: "Partner with us to host joint workshops, meetups, and hackathons" },
    { icon: "📢", title: "Cross-Promotion", description: "Get featured in our newsletter and social media channels" },
    { icon: "🎟️", title: "Event Access", description: "Free tickets to all CS Society events for your community members" },
    { icon: "🔗", title: "Resource Sharing", description: "Share learning materials, job boards, and opportunities with our network" },
    { icon: "💬", title: "Discord Integration", description: "Dedicated channel in our Discord for your community" },
    { icon: "🌐", title: "Website Feature", description: "Logo and profile featured on our partners page" },
  ];

  const industryPartnerBenefits = [
    { icon: "🎯", title: "Recruiting Pipeline", description: "Direct access to talented students seeking internships and full-time roles" },
    { icon: "📋", title: "Resume Database", description: "Access our curated database of member resumes and portfolios" },
    { icon: "🎤", title: "Speaking Opportunities", description: "Host tech talks, workshops, and panels featuring your engineers" },
    { icon: "🏆", title: "Hackathon Sponsorship", description: "Sponsor challenges and prizes at our hackathons" },
    { icon: "💼", title: "Career Fair Priority", description: "Prime booth placement and extended time at career fairs" },
    { icon: "📰", title: "Brand Visibility", description: "Logo placement on all event materials and communications" },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Join Our Community
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Membership Options
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Whether you&apos;re a student looking to grow, a community organization wanting to collaborate, 
            or a company seeking talent—there&apos;s a place for you at CS Society.
          </p>
        </div>

        {/* Community Member Pricing */}
        <div className="mb-20 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">Community Membership</h2>
          <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">
            For students and individuals who want full access to events, workshops, and networking.
          </p>
          <PricingSection />
        </div>

        {/* Community Partner Section */}
        <div className="mb-20 animate-fade-in-up animation-delay-300">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-3">
              Community Partner
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Partner with Your Community</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Are you a student organization, coding bootcamp, or tech community? 
              Let&apos;s amplify each other&apos;s reach and create more value for our members.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPartnerBenefits.map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-purple-500/30 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-purple-300 font-semibold text-lg mb-2">Free Partnership</p>
            <p className="text-gray-400 text-sm mb-4">No cost—just a shared mission to support tech education</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 font-semibold hover:bg-purple-500/30 transition-colors">
              Apply to Partner
            </Link>
          </div>
        </div>

        {/* Industry Partner Section */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium mb-3">
              Industry Partner
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Connect with Future Talent</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              For companies looking to recruit, mentor, and engage with the next generation of tech professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryPartnerBenefits.map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-yellow-500/30 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-yellow-300 font-semibold text-lg mb-2">Custom Pricing</p>
            <p className="text-gray-400 text-sm mb-4">Tailored packages based on your company&apos;s goals and engagement level</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 font-semibold hover:bg-yellow-500/30 transition-colors">
                Become an Industry Partner
              </Link>
              <Link href="/sponsors" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-gray-600 rounded-lg text-gray-300 font-semibold hover:border-gray-500 transition-colors">
                View Sponsorship Tiers
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Have Questions?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Not sure which membership is right for you? Check out our FAQ or reach out—we&apos;re happy to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq" className="btn-animated">
                <span className="btn-text">View FAQ</span>
              </Link>
              <Link href="/contact" className="btn-animated-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

