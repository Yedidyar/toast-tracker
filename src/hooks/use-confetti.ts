import JSConfetti from "js-confetti";
import { useEffect, useRef } from "react";

export const useConfetti = () => {
  const jsConfettiRef = useRef<JSConfetti>();

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
  }, []);

  return jsConfettiRef.current;
};
