import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TEXT = "My Experience";

type Effect = "left" | "right" | "top" | "bottom";

// Most letters can occasionally swap themselves out: a fresh copy slides in from
// one edge and pushes the old one out the opposite edge, so you watch one
// replace the other. No fade, no fill. Directions rotate top → left → bottom →
// right so adjacent letters never share the same motion. Ids run left→right,
// skipping the space: M0 y1  E2 x3 p4 e5 r6 i7 e8 n9 c10 e11
const ROTATION: Effect[] = ["left", "right"];
const EFFECTS: Record<number, Effect> = Object.fromEntries(
  Array.from({ length: 12 }, (_, id) => [id, ROTATION[id % ROTATION.length]])
);

export default function ExperienceTitle() {
  const reduced = useReducedMotion();

  const words = useMemo(() => {
    let id = 0;
    return TEXT.split(" ").map((word) => ({
      chars: word.split("").map((ch) => ({ ch, id: id++ }))
    }));
  }, []);
  const animatedIds = useMemo(() => Object.keys(EFFECTS).map(Number), []);

  // Occasionally replay ONE letter's reformation — slow and infrequent, so it
  // reads as the title quietly breathing, never a constant flicker.
  const [replay, setReplay] = useState<{ id: number; nonce: number }>({ id: -1, nonce: 0 });
  useEffect(() => {
    if (reduced || animatedIds.length === 0) return;
    let nonce = 0;
    let lastId = -1;
    let timer: number;
    const tick = () => {
      nonce += 1;
      // Random letter, but never the same one twice in a row.
      let id = animatedIds[Math.floor(Math.random() * animatedIds.length)];
      while (animatedIds.length > 1 && id === lastId) {
        id = animatedIds[Math.floor(Math.random() * animatedIds.length)];
      }
      lastId = id;
      setReplay({ id, nonce });
      // Randomised gap (~12–22s) so the letters feel like rare glitches.
      timer = window.setTimeout(tick, 12000 + Math.random() * 10000);
    };
    // Wait for the load fade to settle before the first reformation.
    timer = window.setTimeout(tick, 8000);
    return () => window.clearTimeout(timer);
  }, [reduced, animatedIds]);

  // On load the whole title simply fades in; letter reformations come later.
  return (
    <motion.h1
      className="xp-title"
      aria-label={TEXT}
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}
    >
      {words.map((word, wi) => (
        <span className="xp-title__word" key={wi}>
          {word.chars.map(({ ch, id }) => (
            <Cell
              key={id}
              char={ch}
              effect={EFFECTS[id] ?? null}
              reduced={!!reduced}
              replayNonce={replay.id === id ? replay.nonce : 0}
            />
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

function Cell({
  char,
  effect,
  reduced,
  replayNonce
}: {
  char: string;
  effect: Effect | null;
  reduced: boolean;
  replayNonce: number;
}) {
  // plays: 0 = static letter, >0 = effect element (key changes to re-run).
  const [plays, setPlays] = useState(0);

  useEffect(() => {
    if (replayNonce > 0 && effect) setPlays((p) => p + 1);
  }, [replayNonce, effect]);

  const content =
    effect && plays > 0 ? (
      renderEffect(effect, char, reduced, plays)
    ) : (
      <span className="xp-title__glyph">{char}</span>
    );

  return (
    <span className="xp-title__cell" aria-hidden="true">
      <span className="xp-title__sizer">{char}</span>
      <span className="xp-title__window">{content}</span>
    </span>
  );
}

// Each effect = the edge the NEW copy enters from. The incoming glyph slides in
// from that edge to centre while the outgoing glyph is shoved out the opposite
// edge — both translate together, so the box stays full and you see one push the
// other out. `enter` is where the incoming starts; `exit` is where the old goes.
const PUSH: Record<Effect, { axis: "x" | "y"; enter: string; exit: string }> = {
  left: { axis: "x", enter: "-100%", exit: "100%" }, // in from left, old → right
  right: { axis: "x", enter: "100%", exit: "-100%" }, // in from right, old → left
  top: { axis: "y", enter: "-100%", exit: "100%" }, // in from top, old → bottom
  bottom: { axis: "y", enter: "100%", exit: "-100%" } // in from bottom, old → top
};

const PUSH_TRANSITION = { duration: 1.1, ease: [0.95, 0, 0.5, 1] as const };

function renderEffect(effect: Effect, char: string, reduced: boolean, key: number) {
  return <PushSwap key={key} char={char} reduced={reduced} effect={effect} />;
}

function PushSwap({ char, reduced, effect }: { char: string; reduced: boolean; effect: Effect }) {
  if (reduced) return <span className="xp-title__glyph">{char}</span>;
  const { axis, enter, exit } = PUSH[effect];
  const incomingFrom = axis === "x" ? { x: enter } : { y: enter };
  const outgoingTo = axis === "x" ? { x: exit } : { y: exit };
  return (
    <>
      <motion.span
        className="xp-title__glyph xp-title__glyph--abs"
        initial={{ x: 0, y: 0 }}
        animate={outgoingTo}
        transition={PUSH_TRANSITION}
      >
        {char}
      </motion.span>
      <motion.span
        className="xp-title__glyph xp-title__glyph--abs"
        initial={incomingFrom}
        animate={{ x: 0, y: 0 }}
        transition={PUSH_TRANSITION}
      >
        {char}
      </motion.span>
    </>
  );
}
