export interface Site { id: string; title: string; url: string | null }
export interface WorkspaceUser { multiSiteEnabled: boolean }
export const resolveWorkspaceRedirect = (enabled: boolean, sites: Site[]): string | null =>
  !enabled && sites[0] ? `/sites/${sites[0].id}/dashboard` : null
