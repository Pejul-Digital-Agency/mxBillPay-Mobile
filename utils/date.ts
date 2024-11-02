// Helper function to convert a number to a string with leading zero if needed
export function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

// Function to convert datePost to "time ago" format
export function getTimeAgo(datePost: string | Date): string {
  const currentDate = new Date();
  const postDate = new Date(datePost);

  const seconds = Math.floor(
    (currentDate.getTime() - postDate.getTime()) / 1000
  );
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

export const getTimeFromDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
};
export const getFormattedDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
