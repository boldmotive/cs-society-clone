import Link from "next/link";

export const metadata = {
  title: "Terms of Service | CS Society",
  description: "Read the Terms of Service for the Computer Science Society website and membership.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the Computer Science Society ("CS Society") website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.`,
    },
    {
      title: "2. User Accounts",
      content: `To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
      title: "3. Code of Conduct",
      content: `As a member of the CS Society, you agree to:
• Treat all members with respect and dignity regardless of background, skill level, or identity
• Refrain from harassment, discrimination, or bullying in any form
• Not share or distribute copyrighted material without permission
• Maintain academic integrity and not engage in plagiarism
• Use appropriate language in all communications
• Not engage in any illegal activities through our platform
• Report any violations of this code to society leadership`,
    },
    {
      title: "4. Event Participation",
      content: `When attending CS Society events, you agree to:
• Follow all posted rules and guidelines for specific events
• Respect venue policies and property
• Not engage in disruptive behavior
• Take responsibility for any equipment or materials you borrow
• Understand that event photography may be used for promotional purposes unless you opt out
• Accept that event registration may be limited and spots are not guaranteed
• Arrive on time and notify organizers if you cannot attend after RSVPing`,
    },
    {
      title: "5. Intellectual Property",
      content: `Content submitted to the CS Society (including but not limited to projects, code, and presentations) remains the intellectual property of the original creator unless otherwise agreed. By submitting content to our platform, you grant CS Society a non-exclusive, royalty-free license to display, promote, and share your work for educational and promotional purposes. You may request removal of your content at any time by contacting us.`,
    },
    {
      title: "6. Limitation of Liability",
      content: `The CS Society and its officers, members, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our services are provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on our platform. Your use of the service is at your sole risk.`,
    },
    {
      title: "7. Third-Party Links",
      content: `Our website may contain links to third-party websites or services that are not owned or controlled by CS Society. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. You acknowledge and agree that CS Society shall not be liable for any damage or loss caused by your use of any such content or services.`,
    },
    {
      title: "8. Termination",
      content: `We reserve the right to suspend or terminate your membership and access to our services at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other members, the society, or third parties. Upon termination, your right to use our services will immediately cease. You may also terminate your account at any time by contacting us.`,
    },
    {
      title: "9. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved through good-faith negotiation, and if necessary, through appropriate legal channels.`,
    },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Legal
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-400">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-10 animate-fade-in-up animation-delay-200">
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6">
            <p className="text-gray-300">
              Welcome to the Computer Science Society. These Terms of Service govern your use of our
              website, services, and membership. Please read them carefully before using our platform
              or participating in our activities.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 animate-fade-in-up animation-delay-300">
          {sections.map((section, index) => (
            <div key={index} className="bg-[#0f1d32]/60 border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
              <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 animate-fade-in-up animation-delay-400">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-400 mb-6">
              If you have any questions about these Terms of Service, please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Contact Us</span>
              </Link>
              <Link href="/privacy" className="btn-animated-secondary">
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
