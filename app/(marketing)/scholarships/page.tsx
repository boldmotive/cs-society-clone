import Link from "next/link";

export const metadata = {
  title: "Scholarships | CS Society",
  description: "Explore scholarship opportunities for CS students through our society and partners.",
};

export default function ScholarshipsPage() {
  const scholarships = [
    {
      name: "CS Society Merit Award",
      amount: "$2,500",
      deadline: "March 15, 2025",
      eligibility: "Open to all CS majors with 3.0+ GPA",
      status: "Open",
    },
    {
      name: "Women in Tech Scholarship",
      amount: "$3,000",
      deadline: "April 1, 2025",
      eligibility: "Female-identifying students in CS or related fields",
      status: "Open",
    },
    {
      name: "First-Gen Developer Award",
      amount: "$2,000",
      deadline: "February 28, 2025",
      eligibility: "First-generation college students pursuing CS",
      status: "Open",
    },
    {
      name: "Innovation Project Grant",
      amount: "$1,000",
      deadline: "Rolling",
      eligibility: "Students with innovative project proposals",
      status: "Open",
    },
  ];

  const faqs = [
    {
      q: "Who can apply for CS Society scholarships?",
      a: "Generally, all enrolled students majoring in Computer Science or related fields are eligible. Specific requirements vary by scholarship.",
    },
    {
      q: "Can I apply for multiple scholarships?",
      a: "Yes! We encourage students to apply for all scholarships they qualify for. Each application is reviewed independently.",
    },
    {
      q: "When will I hear back about my application?",
      a: "Decisions are typically announced 4-6 weeks after the deadline. You&apos;ll receive an email notification.",
    },
    {
      q: "How are scholarships funded?",
      a: "Our scholarships are funded through generous donations from our sponsors, partners, and alumni.",
    },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Financial Support
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Scholarships
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We believe financial constraints shouldn&apos;t limit your potential. Explore our
            scholarship opportunities designed to support aspiring technologists.
          </p>
        </div>

        {/* Available Scholarships */}
        <div className="mb-16 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Available Scholarships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((scholarship, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{scholarship.name}</h3>
                    <p className="text-cyan-400 text-2xl font-bold">{scholarship.amount}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    {scholarship.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400 text-sm">
                    <span className="text-gray-500">Deadline:</span> {scholarship.deadline}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <span className="text-gray-500">Eligibility:</span> {scholarship.eligibility}
                  </p>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div className="mb-16 animate-fade-in-up animation-delay-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Check Eligibility", desc: "Review requirements for your chosen scholarship" },
              { step: "2", title: "Prepare Materials", desc: "Gather transcripts, essays, and recommendations" },
              { step: "3", title: "Submit Application", desc: "Complete the online application form" },
              { step: "4", title: "Wait for Decision", desc: "Decisions announced 4-6 weeks after deadline" },
            ].map((item, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16 animate-fade-in-up animation-delay-400">
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

        {/* CTA */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Scholarships?</h2>
            <p className="text-gray-400 mb-6">
              Our team is here to help you navigate the application process.
            </p>
            <Link href="/contact" className="btn-animated">
              <span className="btn-text">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
