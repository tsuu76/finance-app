import { useEffect, useState } from "react";
import CardFan from "./CardFan";
import Mascot from "./Mascot";
import Icon from "./Icon";
import { INTRO_CATEGORIES } from "../utils/categories";

const STORAGE_KEY = "cashflo_intro_seen";

export function hasSeenIntro() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true; // if storage is unavailable, don't block the app on an intro
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore — private browsing etc. */
  }
}

const CARDS = INTRO_CATEGORIES.map((c, i) => ({ id: i, ...c }));

export default function IntroExperience({ onDone }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fanState, setFanState] = useState("stack");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = mq.matches;
    setReducedMotion(prefersReduced);

    if (prefersReduced) {
      setFanState("fan");
      setRevealed(true);
      return;
    }

    const fanTimer = setTimeout(() => setFanState("fan"), 300);
    // total choreography: 300ms hold + ~900ms base transition + ~220ms of
    // per-card stagger (4 cards * 55ms) + a short settle beat
    const revealTimer = setTimeout(() => setRevealed(true), 300 + 900 + 240);
    return () => {
      clearTimeout(fanTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  function finish() {
    markIntroSeen();
    onDone();
  }

  return (
    <div className="intro-overlay">
      <button className="intro-skip" onClick={finish}>
        Skip <Icon name="arrow-right" size={14} />
      </button>

      <div className="intro-content">
        <span className="intro-kicker">CashFlo</span>

        <div className="intro-fan">
          <CardFan
            cards={CARDS}
            state={fanState}
            stagger={55}
            renderCard={(card) => (
              <>
                <div className="cf-icon">
                  <Icon name={card.icon} size={18} />
                </div>
                <div className="cf-label">{card.label}</div>
                <div className="cf-spacer" />
                <div className="intro-card-hint">Spending category</div>
              </>
            )}
          />
        </div>

        <div className={`intro-reveal ${revealed ? "is-visible" : ""}`}>
          <Mascot size={64} variant={reducedMotion ? "still" : "idle"} className="intro-mascot" />
          <h1 className="intro-title">
            See every dollar, <span className="intro-title-accent">before it goes.</span>
          </h1>
          <p className="intro-sub">
            CashFlo turns your income and everyday spending into a clear, honest
            picture — with goal tracking and advice grounded in your real numbers.
          </p>
          <button className="btn-primary" onClick={finish}>
            Enter CashFlo <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
