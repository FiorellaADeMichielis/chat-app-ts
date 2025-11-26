
// UTILITY: Class Name Merger
// NOTE: Ideally, install 'clsx' and 'tailwind-merge' for professional conflict resolution.
// If you don't want to install them yet, keep your old 'cn' function, 
// but this is the industry standard:
export function cn(...inputs: (string | undefined | null | false)[]) {
  // Simple version (yours) if you don't have libraries:
  return inputs.filter(Boolean).join(' ');
}

// DATE FORMATTING ADAPTERS
// CRITICAL FIX: We accept 'string | Date' because APIs return strings.
// We normalize everything to a Date object immediately.

export function formatTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  
  // Safety check: If date is invalid, return a fallback or empty string
  if (isNaN(date.getTime())) return '--:--';

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(dateInput: string | Date): string {
  const now = new Date();
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return '';

  // Logic: Reset hours to compare pure dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // 1. If it's today, show time
  if (messageDate.getTime() === today.getTime()) {
    return formatTime(date);
  }

  // 2. If it's this week (last 7 days), show day name (Lun, Mar, etc.)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (messageDate > weekAgo) {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  }

  // 3. Older than a week, show full date
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
}