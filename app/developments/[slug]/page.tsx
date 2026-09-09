export const dynamic = 'force-dynamic';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectDetailClient } from '@/components/developments/ProjectDetailClient';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await repository.getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Tanmiyat Real Estate Development',
    };
  }

  return {
    title: `${project.title} | Tanmiyat Real Estate Development Dubai`,
    description: project.tagline || project.overview,
    openGraph: {
      title: `${project.title} | Tanmiyat Dubai`,
      description: project.overview,
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await repository.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProjectDetailClient project={project} />
      </main>
      <Footer />
    </div>
  );
}
