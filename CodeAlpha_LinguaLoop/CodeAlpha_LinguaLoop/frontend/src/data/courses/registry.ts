import type { CourseData, LanguageCode } from '../../types/language';
import { courseEnEs } from './en-es';
import { courseEnHi } from './en-hi';
import { courseEnTa } from './en-ta';
import { courseEnFr } from './en-fr';
import { courseEnJa } from './en-ja';

export const VERIFIED_COURSES: Record<string, CourseData> = {
  'en-es': courseEnEs,
  'en-hi': courseEnHi,
  'en-ta': courseEnTa,
  'en-fr': courseEnFr,
  'en-ja': courseEnJa,
};

export function getCourseId(source: LanguageCode, target: LanguageCode): string {
  return `${source}-${target}`;
}

export function getCourse(source: LanguageCode, target: LanguageCode): CourseData | null {
  const id = getCourseId(source, target);
  return VERIFIED_COURSES[id] || null;
}

export function isCourseVerified(source: LanguageCode, target: LanguageCode): boolean {
  const id = getCourseId(source, target);
  return Boolean(VERIFIED_COURSES[id]?.isVerified);
}

export function getAllCourses(): CourseData[] {
  return Object.values(VERIFIED_COURSES);
}
