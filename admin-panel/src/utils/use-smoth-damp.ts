import { useRef, useState, useEffect } from "react";

type SmoothDampOptions = {
  timeStep?: number,
  hideOnStart?: boolean
};

// Хук, который позволяет интерполировать значения
export function useSmoothDamp (active: boolean, maxStep: number, options: SmoothDampOptions = {}) {

  const showTimerIntervalRef = useRef<number>();
  
  // showTimer - число, которое увеличивается до maxStep за определенное время
  const [ showTimer, setShowTimer ] = useState((!options.hideOnStart && active) ? maxStep : -1); 

  useEffect(() => {

    if (showTimerIntervalRef.current) clearInterval(showTimerIntervalRef.current);

    showTimerIntervalRef.current = setInterval((() => {
      setShowTimer(timer => {
        timer = active ? (timer + 1) : (timer - 1);
        if (timer < 0 || timer >= maxStep) {
          clearInterval(showTimerIntervalRef.current);
        }
        if (timer < -1) timer = -1;
        if (timer > maxStep) timer = maxStep;

        return timer;
      });
    }) as TimerHandler, options.timeStep || 50);

  }, [ active, maxStep ]);

  return showTimer;

}