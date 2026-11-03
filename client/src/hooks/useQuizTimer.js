import { useState, useEffect, useRef } from 'react';

export const useQuizTimer = (initialSeconds, onExpire) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isLowTime, setIsLowTime] = useState(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpireRef.current) {
        onExpireRef.current();
      }
      return;
    }

    setIsLowTime(secondsLeft <= 120); // Low time when under 2 minutes

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (onExpireRef.current) {
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft]);

  return {
    secondsLeft,
    isLowTime,
  };
};
