import type { TaskCategory } from '../types';
import { categoryLabel } from '../data/categories';
import './ExerciseIllustration.css';

interface Props {
  category: TaskCategory;
  label: string;
}

function CategoryIcon({ category }: { category: TaskCategory }) {
  switch (category) {
    case 'warmup':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />
          <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M32 14v6M32 44v6M14 32h6M44 32h6M20 20l4 4M40 40l4 4M44 20l-4 4M24 40l-4 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'strength':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />
          <path d="M18 32h28M22 26v12M42 26v12M16 28v8M48 28v8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'cardio':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />
          <path d="M14 34h8l4-10 6 20 5-12h13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'mobility':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />
          <path d="M24 40c0-10 4-16 8-18 4 2 8 8 8 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="20" r="4" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />
          <path d="M22 36c4-8 8-12 10-12s6 4 10 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 40h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ExerciseIllustration({ category, label }: Props) {
  return (
    <figure className={`exercise-illustration cat-${category}`} aria-label={label}>
      <div className="exercise-illustration-frame">
        <CategoryIcon category={category} />
        <p className="exercise-illustration-cat">{categoryLabel(category)}</p>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
