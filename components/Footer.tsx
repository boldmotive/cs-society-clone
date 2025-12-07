import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#060d18] border-t border-gray-800 py-6 sm:py-8 md:py-10 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-6 sm:mb-8">
          {/* Logo and Brand Section */}
          <div className="text-center md:text-left flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start w-full md:w-auto">
            {/* Logo Column */}
            <div className="flex items-center justify-center md:justify-start flex-shrink-0">
              <div className="rounded-full flex items-center justify-center">
                <Image 
                  src="/images/computer-science-society-logo.png" 
                  alt="Computer Science Society Logo" 
                  width={96} 
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
            </div>
            
            {/* Content Column */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm sm:text-base font-semibold mb-1">
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  Computer Science Society
                </span>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-3">
                Build for you. Build for the future.
              </p>
              
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-xs sm:text-sm">
                  <em>Follow the 'gram...</em>
                </p>
                <a 
                  href="https://www.instagram.com/computer.science.society" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors mt-0.5"
                  aria-label="Follow us on Instagram"
                >
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links - Mobile: Single Column, Tablet+: 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full md:w-auto md:ml-auto text-center sm:text-left">
            <div className="space-y-2">
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/about">About Us</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/mission">Our Mission</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/events">Events</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/projects">Projects</Link>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/media-kit">Media Kit</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/partners">Partners</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/sponsors">Sponsorship</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/scholarships">Scholarships</Link>
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/faq">FAQ</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/contact">Contact Us</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/privacy">Privacy Policy</Link>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm hover:text-cyan-400 transition-colors">
                <Link href="/terms">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-gray-500 text-xs sm:text-sm">
              Computer Science Society © {new Date().getFullYear()} Bold Motive Group.<br/>
              <span className="sm:hidden"> </span>
              All rights reserved.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-0 mb-6 sm:mb-0">
              Made with <span className="text-cyan-400 text-xl">♡</span> in New York, USA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
