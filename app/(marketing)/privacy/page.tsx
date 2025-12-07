import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | CS Society",
  description: "Learn how the Computer Science Society collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, including:
• Account information: name, email address, and password when you register
• Profile information: optional details like profile picture, bio, and social links
• Project submissions: code, descriptions, images, and links you share
• Event RSVPs: your attendance preferences and event history
• Communications: messages you send us through our contact form
• Usage data: how you interact with our website (pages visited, features used)`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process event registrations and send reminders
• Display your projects and contributions on our platform
• Send newsletters and updates (with your consent)
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent or unauthorized activities
• Personalize your experience on our platform`,
    },
    {
      title: "3. Cookies and Tracking",
      content: `We use cookies and similar technologies to enhance your experience. These include:
• Essential cookies: Required for the website to function properly
• Analytics cookies: Help us understand how visitors use our site
• Preference cookies: Remember your settings and preferences

You can control cookies through your browser settings. Disabling certain cookies may affect your experience on our site.`,
    },
    {
      title: "4. Third-Party Services",
      content: `We use trusted third-party services to operate our platform:
• Supabase: Our database and authentication provider, which stores your account data securely
• Vercel: Our hosting provider for website deployment
• Google Analytics: For understanding website traffic and usage patterns

These providers have their own privacy policies and handle data according to industry standards. We only share the minimum information necessary for these services to function.`,
    },
    {
      title: "5. Data Security",
      content: `We implement appropriate security measures to protect your information:
• Encryption of data in transit using HTTPS/TLS
• Secure password hashing and storage
• Regular security audits and updates
• Access controls limiting who can view your data
• Secure authentication through Supabase

While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
    },
    {
      title: "6. Your Rights",
      content: `You have the following rights regarding your personal data:
• Access: Request a copy of the data we hold about you
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your account and associated data
• Portability: Request your data in a portable format
• Opt-out: Unsubscribe from marketing communications at any time

To exercise these rights, please contact us through our contact form or email us directly.`,
    },
    {
      title: "7. Data Retention",
      content: `We retain your personal information for as long as your account is active or as needed to provide our services. If you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain it for legal purposes. Event attendance records may be retained for historical and statistical purposes in anonymized form.`,
    },
    {
      title: "8. Children's Privacy",
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.`,
    },
    {
      title: "9. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.`,
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-400">
            Last updated: December 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-10 animate-fade-in-up animation-delay-200">
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6">
            <p className="text-gray-300">
              The Computer Science Society (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
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
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Questions?</h2>
            <p className="text-gray-400 mb-6">
              If you have any questions about our Privacy Policy or how we handle your data,
              please reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Contact Us</span>
              </Link>
              <Link href="/terms" className="btn-animated-secondary">
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
