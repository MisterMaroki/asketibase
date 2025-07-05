'use server';

import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Enums } from '@/libs/supabase/types';

export interface AdminProjectAccess {
  projects: Enums<'project_code'>[];
  isSuper: boolean;
  canViewMain: boolean;
  canViewAfrica: boolean;
}

export async function getAdminProjectAccess(): Promise<AdminProjectAccess | null> {
  const user = await getUser();
  if (!user) return null;

  const { data: admin } = await supabaseAdminClient.from('admins').select('is_super_admin').eq('id', user.id).single();

  if (!admin) return null;

  // Super admins have access to all projects
  if (admin.is_super_admin) {
    return {
      projects: ['main', 'africa'],
      isSuper: true,
      canViewMain: true,
      canViewAfrica: true,
    };
  }

  // Get project access from pivot table
  const { data: projectAccess } = await supabaseAdminClient
    .from('admin_project_access')
    .select('project_code')
    .eq('admin_id', user.id);

  const projects = projectAccess?.map((access) => access.project_code) || [];

  return {
    projects,
    isSuper: false,
    canViewMain: projects.includes('main'),
    canViewAfrica: projects.includes('africa'),
  };
}

export async function getAdminProjectFilter(): Promise<Enums<'project_code'>[]> {
  const access = await getAdminProjectAccess();
  return access?.projects || [];
}

export async function getProjectFilterFromParams(
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined },
): Promise<Enums<'project_code'>[]> {
  const projectAccess = await getAdminProjectAccess();
  if (!projectAccess) return [];

  // Handle both awaited and non-awaited searchParams for compatibility
  const params = await Promise.resolve(searchParams);
  const projectParam = params.project as string | undefined;

  // If no project param or 'all', return all accessible projects
  if (!projectParam || projectParam === 'all') {
    return projectAccess.projects;
  }

  // If specific project requested, check if admin has access
  if (projectAccess.projects.includes(projectParam as Enums<'project_code'>)) {
    return [projectParam as Enums<'project_code'>];
  }

  // If requested project not accessible, return all accessible projects
  return projectAccess.projects;
}
