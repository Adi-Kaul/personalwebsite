import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface IntroCurtainProps {
  onDone: () => void;
}

export default function IntroCurtain({ onDone }: IntroCurtainProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!reducedMotion) {
      return undefined;
    }

    const timeout = window.setTimeout(onDone, 120);
    return () => window.clearTimeout(timeout);
  }, [onDone, reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="intro-curtain" aria-hidden="true">
      <motion.div
        animate={{ y: "-101%" }}
        className="intro-curtain__panel intro-curtain__panel--top"
        initial={{ y: "0%" }}
        transition={{ delay: 1.82, duration: 0.95, ease: [0.83, 0, 0.17, 1] }}
      />
      <motion.div
        animate={{ y: "101%" }}
        className="intro-curtain__panel intro-curtain__panel--bottom"
        initial={{ y: "0%" }}
        onAnimationComplete={onDone}
        transition={{ delay: 1.82, duration: 0.95, ease: [0.83, 0, 0.17, 1] }}
      />
      <motion.div
        animate={{ opacity: [0, 1, 1, 0] }}
        className="intro-curtain__mark"
        initial={{ opacity: 0 }}
        transition={{ duration: 1.75, ease: "easeOut", times: [0, 0.17, 0.82, 1] }}
      >
        <motion.span
          animate={{ scaleX: 1 }}
          className="intro-curtain__line-half intro-curtain__line-half--left"
          initial={{ scaleX: 0 }}
          transition={{ delay: 0.5, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="intro-curtain__name">Adi Kaul</span>
        <motion.span
          animate={{ scaleX: 1 }}
          className="intro-curtain__line-half intro-curtain__line-half--right"
          initial={{ scaleX: 0 }}
          transition={{ delay: 0.5, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </div>
  );
}
