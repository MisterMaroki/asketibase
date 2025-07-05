'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Enums } from '@/libs/supabase/types';

interface ProjectFilterProps {
  availableProjects: Enums<'project_code'>[];
  isSuper: boolean;
}

const PROJECT_LABELS: Record<Enums<'project_code'>, string> = {
  main: 'Main Project',
  africa: 'Africa Project',
};

export function ProjectFilter({ availableProjects, isSuper }: ProjectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentProject = searchParams.get('project') as Enums<'project_code'> | null;

  // Show all projects if super admin and has access to multiple projects
  const showAllOption = isSuper && availableProjects.length > 1;

  // Default to 'all' if super admin with multiple projects, otherwise first available project
  const defaultProject = showAllOption ? 'all' : availableProjects[0];
  const selectedProject = currentProject || defaultProject;

  const handleProjectChange = (project: string) => {
    const params = new URLSearchParams(searchParams);

    if (project === 'all') {
      params.delete('project');
    } else {
      params.set('project', project);
    }

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Don't show filter if only one project available
  if (availableProjects.length <= 1) {
    return null;
  }

  return (
    <div className='border-b px-4 py-2'>
      <div className='space-y-2'>
        <Label className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
          <Filter className='h-3 w-3' />
          Project Filter
        </Label>
        <Select value={selectedProject} onValueChange={handleProjectChange}>
          <SelectTrigger className='h-8 w-full'>
            <SelectValue placeholder='Select project' />
          </SelectTrigger>
          <SelectContent>
            {showAllOption && <SelectItem value='all'>All Projects</SelectItem>}
            {availableProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {PROJECT_LABELS[project]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
