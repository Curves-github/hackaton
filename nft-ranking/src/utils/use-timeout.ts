import { useRef, useEffect } from "react";

export function useTimeout(callback: () => void, delay: number) {
  const timeoutRef = useRef<number>();
  useEffect(() => {
    timeoutRef.current = setTimeout(callback as TimerHandler, delay)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [ ]);
}