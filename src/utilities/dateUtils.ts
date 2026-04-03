import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'h:mm a');
};

export const formatDateTime = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getTimezones = (): string[] => {
  return [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];
};

export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
