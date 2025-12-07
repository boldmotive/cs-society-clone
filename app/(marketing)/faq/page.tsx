'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Membership",
      icon: "👤",
      questions: [
        {
          q: "How do I join the CS Society?",
          a: "Joining is easy! Simply click the 'Sign Up' button on our website and create an account. Once registered and subscribed, you'll have full access to our events, projects showcase, and community features.",
        },
        {
          q: "Is there a membership fee?",
          a: "Yes, we offer two plans: $10/month for flexible monthly access, or $102/year (just $8.50/mo) if you pay annually—a 15% savings. Both plans give you full access to all workshops, events, networking sessions, our Discord community, and exclusive member perks. You can cancel anytime with no hidden fees.",
        },
        {
          q: "What are the benefits of being a member?",
          a: "Members get access to exclusive events, priority RSVP for popular workshops, the ability to showcase projects, networking opportunities with industry professionals, free swag at events, and access to our Discord community.",
        },
        {
          q: "Do I need to be a CS major to join?",
          a: "Absolutely not! We welcome students from all majors and backgrounds. Whether you're a complete beginner curious about coding or an experienced developer, there's a place for you here.",
        },
      ],
    },
    {
      title: "Events",
      icon: "📅",
      questions: [
        {
          q: "How do I RSVP for events?",
          a: "Once you're logged into your account, visit the Events page and click 'RSVP Now' on any event you'd like to attend. You'll receive a confirmation email with event details.",
        },
        {
          q: "What happens if I RSVP but can't attend?",
          a: "Life happens! If you can't make it, please cancel your RSVP through your account so others can take your spot. Frequent no-shows may affect your priority access to future events.",
        },
        {
          q: "Are events in-person or virtual?",
          a: "We offer both! Each event listing specifies whether it's in-person, virtual, or hybrid. Many workshops are held in Room 304 with a Zoom option available.",
        },
        {
          q: "Can I suggest an event or workshop topic?",
          a: "Yes! We love hearing from members. Use the Contact page to submit your ideas, or reach out to us on Discord. We're always looking for new workshop topics and speakers.",
        },
      ],
    },
    {
      title: "Projects",
      icon: "💻",
      questions: [
        {
          q: "How do I submit my project to the showcase?",
          a: "Log into your account, go to the Projects page, and click 'Submit Project'. Fill out the form with your project details, add images, and include your GitHub link. Projects are reviewed within 48 hours.",
        },
        {
          q: "What types of projects can I submit?",
          a: "Any tech project is welcome! This includes websites, mobile apps, games, Discord bots, data analysis projects, hardware projects, and more. Projects at any skill level are encouraged.",
        },
        {
          q: "Can I submit a group project?",
          a: "Absolutely! Group projects are welcome. Just make sure to credit all team members in the submission. Each member should have their own account to be properly tagged.",
        },
        {
          q: "Will my project be reviewed or judged?",
          a: "Projects aren't judged—we celebrate all contributions! However, exceptional projects may be featured on our homepage or social media to inspire other members.",
        },
      ],
    },
    {
      title: "General",
      icon: "ℹ️",
      questions: [
        {
          q: "When and where does the CS Society meet?",
          a: "We hold general meetings every other Thursday at 5 PM in the Student Center, Room 304. Special events and workshops have varying times—check our Events page for the full schedule.",
        },
        {
          q: "How can I get involved beyond attending events?",
          a: "There are many ways! Join our Discord server, volunteer to help at events, become a workshop facilitator, run for leadership positions, or help with our social media. Contact us to learn more.",
        },
        {
          q: "How do I contact the CS Society leadership?",
          a: "You can reach us through the Contact page on our website, via email, or through our Discord server. We typically respond within 24-48 hours.",
        },
        {
          q: "Do you offer any resources for job hunting or internships?",
          a: "Yes! We host career-focused events, resume reviews, and mock interviews. Our industry partners also post opportunities in our Discord. Check out the Sponsors page to see companies we work with.",
        },
      ],
    },
  ];

  const toggleQuestion = (globalIndex: number) => {
    setOpenIndex(openIndex === globalIndex ? null : globalIndex);
  };

  let globalIndex = 0;

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked<br />
            <span className="text-cyan-400">Questions</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Find everything you need to know about
            the CS Society below.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${(catIndex + 1) * 100}ms` }}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-[#1a2a42] rounded-lg flex items-center justify-center text-xl">
                  {category.icon}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{category.title}</h2>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const currentIndex = globalIndex++;
                  const isOpen = openIndex === currentIndex;

                  return (
                    <div
                      key={qIndex}
                      className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleQuestion(currentIndex)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#1a2a42]/50 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{item.q}</span>
                        <span className={`text-cyan-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <p className="px-5 pb-4 text-gray-400">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-gray-400 mb-6">
              Can&apos;t find what you&apos;re looking for? Our team is here to help.
              Reach out and we&apos;ll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-animated">
                <span className="btn-text">Contact Us</span>
              </Link>
              <Link href="/login" className="btn-animated-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
