// Simple sound effects using Web Audio API — no external files needed.
// Each function plays a short sound synthesized in the browser.

let ctx = null;
function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const c = getCtx(); if (!c) return;
  const now = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain); gain.connect(c.destination);
  osc.start(now); osc.stop(now + duration + 0.02);
}

export const sfx = {
  ding: () => {        // correct answer — happy two-note chime
    tone(880, 0.12, 'sine', 0.2);
    tone(1320, 0.2, 'sine', 0.2, 0.08);
  },
  aww: () => {         // wrong — soft descending "aww"
    tone(440, 0.15, 'sine', 0.15);
    tone(330, 0.25, 'sine', 0.15, 0.12);
  },
  pop: () => {         // tap / small click
    tone(600, 0.05, 'triangle', 0.1);
  },
  whoosh: () => {      // navigation
    tone(200, 0.15, 'sawtooth', 0.05);
    tone(600, 0.1, 'sawtooth', 0.05, 0.05);
  },
  fanfare: () => {     // day completion — 4-note arpeggio
    tone(523, 0.15, 'triangle', 0.2);            // C
    tone(659, 0.15, 'triangle', 0.2, 0.15);      // E
    tone(784, 0.15, 'triangle', 0.2, 0.30);      // G
    tone(1047, 0.4, 'triangle', 0.25, 0.45);     // high C
  },
  celebration: () => { // perfect score — upward arpeggio
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.15, 'triangle', 0.18, i * 0.08));
  },
  countdown: () => {
    tone(800, 0.1, 'sine', 0.1);
  }
};

// Primes the audio context on first user interaction (required by browsers).
export function primeAudio() { getCtx(); }
