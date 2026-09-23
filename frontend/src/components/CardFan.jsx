import { useMemo } from "react";

/*
  Shared card-fan primitive — the one visual system behind both the
  first-visit intro and the Goals tab. Positioning (stack vs fan,
  rotation, stagger) lives here in JS as plain inline transforms;
  CSS (CardFan.css) only owns the card's look and its hover/press
  micro-interactions. Pure CSS transforms — no WebGL.

  props:
    cards        [{ id, ...anything renderCard needs }]
    state        "stack" | "fan"   — collapsed deck vs spread out
    interactive  bool              — enables hover lift + click select
    selectedId   id | null
    onSelect     (id) => void
    stagger      ms of transition-delay added per card index
    renderCard   (card, { isSelected }) => JSX — content inside the card face
*/
export default function CardFan({
  cards,
  state = "fan",
  interactive = false,
  selectedId = null,
  onSelect,
  stagger = 55,
  renderCard,
  className = "",
}) {
  const n = cards.length;
  const center = (n - 1) / 2;

  const slots = useMemo(
    () =>
      cards.map((card, i) => {
        const offset = i - center;
        const isSelected = interactive && selectedId === card.id;

        // Horizontal spacing (--fan-spacing) is a CSS custom property so it
        // can shrink under media queries without this math ever knowing —
        // the offset multiplier is the only thing computed here.
        let rotate, offsetMult, ty, scale, z;
        if (state === "stack") {
          rotate = 0;
          offsetMult = offset * 0.03;
          ty = offset * -2;
          scale = 0.96;
          z = 10 + i;
        } else {
          rotate = offset * 9;
          offsetMult = offset;
          ty = offset * offset * 4;
          scale = 1;
          z = 10 + (n - Math.abs(offset));
          if (isSelected) {
            ty -= 28;
            scale = 1.05;
            z = 60;
          }
        }

        return {
          card,
          isSelected,
          style: {
            transform: `translate(-50%, 0) translate(calc(${offsetMult} * var(--fan-spacing)), ${ty}px) rotate(${rotate}deg) scale(${scale})`,
            zIndex: z,
            transitionDelay: `${i * stagger}ms`,
          },
        };
      }),
    [cards, state, selectedId, interactive, center, n, stagger]
  );

  return (
    <div className={`card-fan ${className}`.trim()} role={interactive ? "listbox" : undefined}>
      {slots.map(({ card, isSelected, style }) => (
        <div
          key={card.id}
          className={`cf-slot ${interactive ? "cf-interactive" : ""}`}
          style={style}
        >
          <div
            className={`cf-card ${isSelected ? "cf-card-selected" : ""}`}
            role={interactive ? "option" : undefined}
            aria-selected={interactive ? isSelected : undefined}
            tabIndex={interactive ? 0 : -1}
            onClick={interactive && onSelect ? () => onSelect(card.id) : undefined}
            onKeyDown={
              interactive && onSelect
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(card.id);
                    }
                  }
                : undefined
            }
          >
            {renderCard(card, { isSelected })}
          </div>
        </div>
      ))}
    </div>
  );
}
