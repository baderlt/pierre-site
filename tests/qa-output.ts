import {test} from '@playwright/test';

/** Keep milestone runs and device projects from overwriting historical QA evidence. */
export function qaOutput(path: string): string {
  const root = process.env.QA_ARTIFACT_ROOT;
  return root ? `${root}/${test.info().project.name}/${path.replace(/^docs\/qa\/?/, '')}` : path;
}
