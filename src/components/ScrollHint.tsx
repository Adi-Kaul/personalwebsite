import { motion, useReducedMotion } from "framer-motion";

export default function ScrollHint() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={reducedMotion ? { opacity: 0.68 } : { opacity: [0, 0.68], x: [8, 0] }}
      className="scroll-hint"
      initial={{ opacity: 0, x: reducedMotion ? 0 : 8 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
    >
      scroll -&gt;
    </motion.div>
  );
}
