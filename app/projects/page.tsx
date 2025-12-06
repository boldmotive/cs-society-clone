'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-base sm:text-lg md:text-xl text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Student Projects</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Big or small, every project counts. Check out what our community is building.{' '}
            <span className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">
              Want to showcase yours? Submit a project.
            </span>
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
      </div>
    </div>
  );
}
