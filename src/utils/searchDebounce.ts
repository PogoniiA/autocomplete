export const searchDebounce = <T>(callback: (e: T) => void, timer: number) => {
  let timeout: NodeJS.Timeout | null;
  return (e: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      callback(e);
    }, timer);
  };
};
