'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string;
  tags: string[];
  github_url: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Use mock data if database is not set up
        setProjects(getMockProjects());
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      // Use mock data if there's an error
      setProjects(getMockProjects());
    } finally {
      setLoading(false);
    }
  }

  function getMockProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'Personal Portfolio V1',
        author: 'Jessica L.',
        description: 'My first portfolio site showcasing my design skills. Learned a lot about CSS grid.',
        image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
        tags: ['HTML/CSS', 'Design', 'Web'],
        github_url: 'https://github.com/'
      },
      {
        id: 2,
        title: 'StudyBuddy Bot',
        author: 'Mike & Tom',
        description: 'A Discord bot that organizes study groups and sends reminders. First python project!',
        image_url: 'https://images.unsplash.com/photo-1614741118868-407581d6b44c?auto=format&fit=crop&q=80&w=800',
        tags: ['Python', 'Discord API', 'Automation'],
        github_url: 'https://github.com/'
      },
      {
        id: 3,
        title: 'Campus Navigate',
        author: 'Sarah J.',
        description: 'An interactive map to help freshmen find their classrooms. Built with React and Leaflet.',
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
        tags: ['React', 'Maps', 'Open Source'],
        github_url: 'https://github.com/'
      }
    ];
  }

  const submissionBenefits = [
    { icon: '📁', title: 'Build Your Portfolio', description: 'Showcase your work to potential employers and collaborators' },
    { icon: '⭐', title: 'Get Featured', description: 'Top projects are highlighted on our homepage and social media' },
    { icon: '💬', title: 'Receive Feedback', description: 'Get constructive feedback from peers and industry mentors' },
    { icon: '🤝', title: 'Connect with Recruiters', description: 'Our partner companies actively browse student projects' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-base sm:text-lg md:text-xl text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Student Projects
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Where Ideas Come to<br />
            <span className="text-cyan-400">Life</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Every great developer started with a first project. Browse what our community is building,
            get inspired, and showcase your own work to the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-animated">
              <span className="btn-text">Sign In to Submit Project</span>
            </Link>
            <Link href="/about" className="btn-animated-secondary">
              Learn More About Us
            </Link>
          </div>
        </div>

        {/* Projects Section Header */}
        <div className="mb-8 sm:mb-10 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Community Showcase</h2>
          <p className="text-gray-400">
            Big or small, every project counts. Check out what our members are building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#0f1d32] border border-gray-600/30 rounded-xl overflow-hidden card-hover">
              {/* Project Image */}
              <div className="relative h-40 sm:h-48 bg-[#1a2a42]">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Project Details */}
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">By {project.author}</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-semibold text-cyan-400 bg-cyan-500/15 px-2 sm:px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* View Code Button */}
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#1a2a42] text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold border border-gray-600/30 hover:bg-[#243650] hover:border-cyan-500/30 transition-all duration-300"
                >
                  View Code
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Submission Benefits Section */}
        <div className="mt-16 sm:mt-20 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-green-500/30 text-green-400 text-sm mb-4">
              ✦ Why Submit?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Benefits of Showcasing Your Work
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Submitting your project isn&apos;t just about showing off—it&apos;s about growing as a developer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {submissionBenefits.map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center card-hover">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 sm:mt-20 animate-fade-in-up animation-delay-500">
          <div className="bg-[#0f1d32]/60 border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">How to Submit Your Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">1</div>
                <h4 className="text-white font-semibold mb-2">Create an Account</h4>
                <p className="text-gray-400 text-sm">Sign up for free and complete your profile</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">2</div>
                <h4 className="text-white font-semibold mb-2">Submit Your Project</h4>
                <p className="text-gray-400 text-sm">Add your project details, images, and GitHub link</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">3</div>
                <h4 className="text-white font-semibold mb-2">Get Discovered</h4>
                <p className="text-gray-400 text-sm">Your project is live and visible to our community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 sm:mt-20 animate-fade-in-up animation-delay-600">
          <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Share Your Work?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Whether it&apos;s your first &quot;Hello World&quot; or a complex full-stack app, we want to see it.
              Join our community and start building your portfolio today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-animated">
                <span className="btn-text">Sign Up & Submit Project</span>
              </Link>
              <Link href="/contact" className="btn-animated-secondary">
                Need Help? Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
