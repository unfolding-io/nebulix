/**
 * Theme lives under SITES/AstroThemes in the git repo.
 * Sveltia (Git / local folder picker) resolves paths from the repo root,
 * which must contain `.git`.
 */
export const CMS_ROOT = "SITES/AstroThemes";

export const cmsPath = (relativePath) =>
  `${CMS_ROOT}/${relativePath.replace(/^\//, "")}`;
