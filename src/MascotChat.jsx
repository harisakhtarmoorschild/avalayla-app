import React, { useEffect, useRef, useState } from 'react';
import { Mic, Send, X, Volume2, VolumeX } from 'lucide-react';
import {
  createListener,
  isSttSupported,
  isTtsSupported,
  speakAsMascot,
  stopMascotAudio,
  MASCOT_PERSONAS
} from './voice.js';

/**
 * MascotChat — a side panel where the child can talk (or type) to their mascot
 * for help during the writing exercise. Docked alongside the writing area so
 * the child can write and chat at the same time.
 *
 * Voice modes:
 *  - LIVE (default): always-listening. As soon as the chat opens we start
 *    recognizing. When the child finishes speaking the API auto-detects the
 *    end-of-utterance and sends. While the mascot speaks we pause listening
 *    (so we don't transcribe the mascot's own voice), then resume.
 *  - WALKIE-TALKIE: press-and-hold the mic button to talk; release to send.
 *    Available via the small toggle next to the mic.
 *
 * Props:
 *  - user, writingPrompt, currentDraft, onClose
 */
export default function MascotChat({ user, writingPrompt, currentDraft, onClose }) {
  const persona = MASCOT_PERSONAS[user] || MASCOT_PERSONAS.Ava;
  const [messages, setMessages] = useState([]);
  const [typed, setTyped] = useState('');
  const [mode] = useState('walkie'); // tap-to-talk only (live/always-listening mode removed)
  const [listening, setListening] = useState(false); // active recognition session
  const [holding, setHolding] = useState(false);     // walkie button currently pressed
  const [interim, setInterim] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);

  const recognizerRef = useRef(null);
  const finalBufRef = useRef('');
  const interimBufRef = useRef('');
  const scrollerRef = useRef(null);
  // We use a ref for mode because the listener callbacks close over the value
  // they had when registered; the ref lets them see the current mode.
  const modeRef = useRef('walkie');
  const speakingRef = useRef(false);
  const mountedRef = useRef(true);
  const sttOk = isSttSupported();
  const ttsOk = isTtsSupported();

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { speakingRef.current = speaking; }, [speaking]);

  // Greet on open
  useEffect(() => {
    mountedRef.current = true;
    const greeting = `Hi ${user}! It's ${persona.mascotName}. Tap the big mic button to talk to me, then tap it again when you're done. I'm here to help with your writing!`;
    setMessages([{ role: 'assistant', content: greeting }]);
    if (!muted) {
      setSpeaking(true);
      speakAsMascot(greeting, user, () => { setSpeaking(false); });
    }
    return () => {
      mountedRef.current = false;
      stopMascotAudio();
      stopRecognizer(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, thinking, interim]);

  // ---------- recognizer ----------
  function stopRecognizer(abort) {
    if (recognizerRef.current) {
      try {
        if (abort && recognizerRef.current.abort) recognizerRef.current.abort();
        else if (recognizerRef.current.stop) recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }
    setListening(false);
    setHolding(false);
  }

  // Build and start a recognizer in the requested mode.
  function startRecognizer({ walkie }) {
    if (!sttOk) {
      setError("This browser can't listen yet — type your question instead.");
      return;
    }
    setError(null);
    stopMascotAudio();
    setSpeaking(false);
    finalBufRef.current = '';
    interimBufRef.current = '';
    setInterim('');

    // continuous: walkie mode runs a long stream until user releases.
    // Live mode uses one-shot recognition (API auto-detects end-of-utterance)
    // and we restart it after each result for a "rolling" listening loop.
    const rec = createListener({
      lang: 'en-GB',
      continuous: !!walkie,
      interimResults: true,
      onInterim: (text) => {
        interimBufRef.current = text;
        if (mountedRef.current) setInterim(text);
      },
      onFinalFragment: (text) => {
        if (text) finalBufRef.current = (finalBufRef.current + ' ' + text).trim();
        interimBufRef.current = '';
        if (mountedRef.current) setInterim('');
      },
      onError: (err) => {
        if (!mountedRef.current) return;
        if (err === 'no-speech' || err === 'aborted') {
          // Normal in live mode when there's a long pause. Just loop.
          finalBufRef.current = '';
          interimBufRef.current = '';
          setInterim('');
          return;
        }
        setError(typeof err === 'string' ? `Mic error: ${err}` : "I couldn't catch that. Try again or type instead.");
      },
      onEnd: () => {
        if (!mountedRef.current) return;
        const finalText = (finalBufRef.current + ' ' + interimBufRef.current).trim();
        finalBufRef.current = '';
        interimBufRef.current = '';
        setInterim('');
        setListening(false);
        setHolding(false);
        if (finalText) sendMessage(finalText);
        // In live mode, automatically loop the listener once the mascot finishes
        // speaking (or right away if nothing was said).
        if (modeRef.current === 'live' && mountedRef.current && !speakingRef.current && !finalText) {
          // No utterance detected — restart immediately for next try.
          setTimeout(() => { if (modeRef.current === 'live' && mountedRef.current) maybeStartLive(); }, 200);
        }
      }
    });
    recognizerRef.current = rec;
    try {
      rec.start();
      if (walkie) setHolding(true);
      setListening(true);
    } catch (e) {
      console.warn('rec.start failed:', e);
      setListening(false); setHolding(false);
      // Common cause on iOS Safari: needs a user gesture. Don't spam errors in
      // the auto-loop — just surface once.
      if (mode === 'walkie') setError("Mic couldn't start. Try again.");
    }
  }

  // Live mode: start if appropriate. Idempotent.
  function maybeStartLive() {
    if (!sttOk || !mountedRef.current) return;
    if (modeRef.current !== 'live') return;
    if (speakingRef.current) return;
    if (recognizerRef.current) return;
    startRecognizer({ walkie: false });
  }

  // ---------- sending ----------
  async function sendMessage(text) {
    const userMsg = (text || '').trim();
    if (!userMsg) return;
    setError(null);
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setThinking(true);
    // While we wait for + speak the reply, pause listening so we don't
    // transcribe the mascot's own voice.
    stopRecognizer(false);
    try {
      const r = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'mascot-chat',
          payload: {
            childName: user,
            mascotName: persona.mascotName,
            systemPrompt: persona.systemPrompt,
            writingPrompt,
            currentDraft,
            messages: newHistory.slice(-10).map(m => ({ role: m.role, content: m.content }))
          }
        })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      const reply = (data && data.reply) ? String(data.reply).trim() : `Hmm, I lost my words for a sec! Try asking me again, ${user}.`;
      if (!mountedRef.current) return;
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      if (!muted) {
        setSpeaking(true);
        speakAsMascot(reply, user, () => {
          setSpeaking(false);
          if (mountedRef.current && modeRef.current === 'live') maybeStartLive();
        });
      } else if (modeRef.current === 'live') {
        maybeStartLive();
      }
    } catch (e) {
      console.error('mascot-chat failed:', e);
      if (mountedRef.current) {
        setError("I couldn't hear back from the magic. Try again in a moment!");
        if (modeRef.current === 'live') maybeStartLive();
      }
    } finally {
      if (mountedRef.current) setThinking(false);
    }
  }

  // ---------- mode switching ----------
  // ---------- tap-to-talk (manual mode) ----------
  // One tap starts listening; a second tap stops and sends. Tap-to-toggle is far
  // clearer for a child than press-and-hold ("do I keep holding it?"), and we set
  // the visual state synchronously so the button reacts the instant it's tapped —
  // before the (slightly slow) speech engine has finished spinning up.
  function toggleTalk(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (mode !== 'walkie') return;
    if (holding) {
      // Already listening → stop and send what was heard.
      if (recognizerRef.current && recognizerRef.current.stop) {
        try { recognizerRef.current.stop(); } catch (err) {}
      }
      return;
    }
    // Instant feedback, then start the recognizer.
    setHolding(true);
    setListening(true);
    startRecognizer({ walkie: true });
  }

  function toggleMute() {
    if (!muted) stopMascotAudio();
    setSpeaking(false);
    setMuted(m => !m);
    // If unmuting and we were waiting on the mascot reply, the next reply will
    // speak again. If muting, immediately resume live listening.
    if (!muted && modeRef.current === 'live') maybeStartLive();
  }

  function handleClose() {
    mountedRef.current = false;
    stopMascotAudio();
    stopRecognizer(true);
    onClose && onClose();
  }

  return (
    <div className="bg-white rounded-[2rem] kid-shadow flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b-2 border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="text-3xl">{persona.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg font-bold text-gray-800 truncate">{persona.mascotName}</div>
          <div className="text-xs text-gray-500 truncate">
            {holding && !speaking && !thinking && <><span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1 align-middle" />Listening — tap to stop</>}
            {thinking && <><span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1 align-middle" />Thinking…</>}
            {speaking && !thinking && <>Speaking…</>}
            {!holding && !speaking && !thinking && <>Tap the mic to talk</>}
          </div>
        </div>
        {ttsOk && (
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-100" aria-label="Mute mascot voice">
            {muted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-violet-600" />}
          </button>
        )}
        <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close chat">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 min-h-[200px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={
              'max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed ' +
              (m.role === 'user'
                ? 'bg-violet-500 text-white rounded-br-sm'
                : 'bg-white border-2 border-violet-100 text-gray-800 rounded-bl-sm')
            }>
              {m.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-violet-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {(listening || holding) && interim && (
          <div className="flex justify-end">
            <div className="max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed bg-violet-100 text-violet-900 border-2 border-violet-300 border-dashed rounded-br-sm">
              {interim}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{error}</div>
        )}
      </div>

      {/* Talk control — big, obvious, state-coloured */}
      <div className="px-3 pt-3">
        {thinking ? (
          <div className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-700 font-display font-bold">
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            {persona.mascotName} is thinking…
          </div>
        ) : speaking ? (
          <div className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-violet-100 border-2 border-violet-200 text-violet-700 font-display font-bold">
            <Volume2 className="w-5 h-5" /> {persona.mascotName} is speaking…
          </div>
        ) : sttOk ? (
          <button
            type="button"
            onClick={toggleTalk}
            className={'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-display font-bold text-white text-lg kid-shadow pressable select-none transition ' +
              (holding ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-violet-500 to-purple-600')}
            aria-label={holding ? 'Listening — tap to stop' : 'Tap to talk'}
          >
            <Mic className="w-6 h-6" />
            {holding ? 'Listening… tap to stop' : 'Tap to talk'}
          </button>
        ) : (
          <div className="text-center text-xs text-gray-400 py-2">Type below to chat with {persona.mascotName}</div>
        )}
        {sttOk && !thinking && !speaking && (
          <div className="text-[11px] text-gray-400 text-center mt-2 leading-tight">
            Tap once to start talking · tap again when you're done
          </div>
        )}
      </div>

      {/* Type input */}
      <div className="p-3 pt-2 bg-white">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && typed.trim()) { sendMessage(typed); setTyped(''); } }}
            placeholder="Or type your question…"
            className="flex-1 px-3 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-violet-400 outline-none text-sm"
          />
          <button
            onClick={() => { if (typed.trim()) { sendMessage(typed); setTyped(''); } }}
            disabled={!typed.trim() || thinking}
            className="pressable flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-white kid-shadow disabled:opacity-40 flex-shrink-0"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
