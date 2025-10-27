// Función simple para combinar clases de Tailwind
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Formateadores de fecha/hora
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Si es hoy, mostrar solo la hora
  if (messageDate.toDateString() === now.toDateString()) {
    return formatTime(date);
  }
  
  // Si es de esta semana, mostrar el día
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (messageDate > weekAgo) {
    return messageDate.toLocaleDateString('es-ES', { weekday: 'short' });
  }
  
  // Mostrar fecha completa
  return messageDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
}