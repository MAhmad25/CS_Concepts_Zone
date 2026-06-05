import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
const __TRANSITION_STYLES = `
:root {
  --shake-distance: 6px;
  --shake-overshoot: 4px;
  --shake-dur-a: 80ms;
  --shake-dur-b: 60ms;
  --shake-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --revert-hold: 3000ms;
  --revert-dur: 280ms;
}

/* Border-color tween. The wrapper owns the visible input border so
   the whole error state animates consistently. */
.t-input-wrap {
  display: grid;
  gap: 0.35rem;
}

.t-input {
  border: 1px solid rgba(0, 0, 0, 0.45);
  border-radius: 0.75rem;
  transition: border-color 150ms ease-out, transform 150ms ease-out;
  will-change: transform;
  background: transparent;
}
.t-input.is-error {
  border-color: #ff0404;
  transition: border-color var(--revert-dur, 280ms) ease-out;
}

/* Error message reveal. Visibility is delayed by --revert-dur
   on hide so the message stays painted for the full opacity
   fade-out. Entering .is-error drops the delay to 0 so the
   message becomes visible immediately. */
.t-error-msg {
  color: #ff0000;
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear var(--revert-dur, 280ms);
}
.t-input-wrap.is-error .t-error-msg {
  opacity: 1;
  visibility: visible;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear 0s;
}

/* Multi-segment keyframe with per-stop easing so each leg
   of the shake follows its own cubic-bezier independently.
   %-stops are cumulative durations as a fraction of the
   total (80, 60, 80, 60 = 280ms): 28.57%, 57.14%, 78.57%,
   100%. Recompute if any segment duration changes. */
.t-input.is-shaking {
  animation: t-input-shake calc(
      var(--shake-dur-a) * 2 + var(--shake-dur-b) * 2
    ) linear;
}
@keyframes t-input-shake {
  0%      { transform: translateX(0);                                 animation-timing-function: var(--shake-ease); }
  28.57%  { transform: translateX(var(--shake-distance));             animation-timing-function: var(--shake-ease); }
  57.14%  { transform: translateX(calc(var(--shake-distance) * -1)); animation-timing-function: var(--shake-ease); }
  78.57%  { transform: translateX(var(--shake-overshoot));            animation-timing-function: var(--shake-ease); }
  100%    { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .t-input { animation: none !important; transform: none !important; }
}
`;
if (typeof document !== "undefined" && !document.getElementById("transitions-p12")) {
      const __style = document.createElement("style");
      __style.id = "transitions-p12";
      __style.textContent = __TRANSITION_STYLES;
      document.head.appendChild(__style);
}

export const InputShake = forwardRef(function InputShake({ children, message, onCancel, shake = false, shakeKey, isError = false }, ref) {
      const inputRef = useRef(null);
      const timerRef = useRef(null);
      const [error, setError] = useState(false);

      const trigger = useCallback(() => {
            if (!inputRef.current) return;
            setError(true);
            inputRef.current.classList.remove("is-shaking");
            void inputRef.current.offsetWidth;
            inputRef.current.classList.add("is-shaking");

            if (timerRef.current) window.clearTimeout(timerRef.current);
            const shakeMs = readMs("--shake-dur-a", 80) * 2 + readMs("--shake-dur-b", 60) * 2;
            const hold = readMs("--revert-hold", 3000);

            if (!isError) {
                  timerRef.current = window.setTimeout(() => {
                        setError(false);
                        timerRef.current = null;
                  }, shakeMs + hold);
            }
      }, [isError]);

      const cancel = useCallback(() => {
            if (timerRef.current) {
                  window.clearTimeout(timerRef.current);
                  timerRef.current = null;
            }
            if (!isError) {
                  setError(false);
            }
            onCancel?.();
      }, [isError, onCancel]);

      useImperativeHandle(ref, () => ({ trigger }), [trigger]);

      useEffect(() => {
            if (shake) {
                  trigger();
            }
      }, [shake, trigger]);

      useEffect(() => {
            if (shakeKey != null) {
                  trigger();
            }
      }, [shakeKey, trigger]);

      const showError = isError || error;

      return (
            <div className={"t-input-wrap" + (showError ? " is-error" : "")}>
                  <div ref={inputRef} className={"t-input px-3 rounded-xl" + (showError ? " is-error" : "")} onInput={cancel}>
                        {children}
                  </div>
                  <p className="t-error-msg">{message}</p>
            </div>
      );
});

function readMs(name, fallback) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : fallback;
}
