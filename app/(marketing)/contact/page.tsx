"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    { icon: "📧", label: "Email", value: "hello@cssociety.org", href: "mailto:hello@cssociety.org" },
    { icon: "📍", label: "Location", value: "Student Union Building, Room 204", href: null },
    { icon: "📱", label: "Instagram", value: "@computer.science.society", href: "https://instagram.com/computer.science.society" },
  ];

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 mb-4">We&apos;ll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-grid form-grid-2">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 text-sm mb-2">Name</label>
                      <input
                        type="text" id="name" required
                        className="form-input"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-300 text-sm mb-2">Email</label>
                      <input
                        type="email" id="email" required
                        className="form-input"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-300 text-sm mb-2">Subject</label>
                    <select
                      id="subject" required
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="membership">Membership</option>
                      <option value="events">Events</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-300 text-sm mb-2">Message</label>
                    <textarea
                      id="message" required rows={5}
                      className="form-input"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-animated w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="btn-text">{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up animation-delay-300">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Other Ways to Reach Us</h2>

              {contactMethods.map((method, index) => (
                <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl">
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{method.label}</p>
                      {method.href ? (
                        <a href={method.href} className="text-white hover:text-cyan-400 transition-colors" target="_blank" rel="noopener noreferrer">
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-white">{method.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* FAQ Teaser */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-white mb-2">Have a Common Question?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Check out our FAQ page for quick answers to frequently asked questions.
                </p>
                <a href="/faq" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium">
                  View FAQ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
