import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, X, Volume2, VolumeX } from 'lucide-react';
import {
  createListener,
  isSttSupported,
  isTtsSupported,
  speakAsMascot,
  stopMascotAudio,
  MASCOT_PERSONAS
} from './voice.js';

/**
 * MascotChat — an overlay where the child can talk (or type) to their mascot
 * for help during the writing exercise. Voice is via Web Speech API.
 *
 * Props:
 *  - user:           "Ava" | "Layla" | "Shyal"
 *  - writingPrompt:  the current day's writing prompt (string)
 *  - currentDraft:   the child's writing so far (string)
 *  - onClose:        callback when the overlay should close
 */
export default function MascotChat({ user, writingPrompt, currentDraft, onClose }) {
  const persona = MASCOT_PERSONAS[user] || MASCOT_PERSONAS.Ava;
  const [messages, setMessages] = useState([]); // [{role:'user'|'assistant', content}]
  const [typed, setTyped] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);
  const recognizerRef = useRef(null);
  const scrollerRef = useRef(null);

  // Greet on open
  useEffect(() => {
    const greeting = `Hi ${user}! It's ${persona.mascotName}. Tap the microphone and tell me what you want help with — or just ask me anything about your writing!`;
    setMessages([{ role: 'assistant', content: greeting }]);
    if (!muted) speakAsMascot(greeting, user, () => setSpeaking(false));
    setSpeaking(!muted);
    return () => stopMascotAudio();
    // eslint-disable-next-line
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, thinking]);

  async function sendMessage(text) {
    const userMsg = (text || '').trim();
    if (!userMsg) return;
    setError(null);
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setThinking(true);
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
            // Only send the chat history (not the seed greeting — keep system prompt focused)
            messages: newHistory.slice(-10).map(m => ({ role: m.role, content: m.content }))
          }
        })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      const reply = (data && data.reply) ? String(data.reply).trim() : `Hmm, I lost my words for a sec! Try asking me again, ${user}.`;
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      if (!muted) {
        setSpeaking(true);
        speakAsMascot(reply, user, () => setSpeaking(false));
      }
    } catch (e) {
      console.error('mascot-chat failed:', e);
      setError("I couldn't hear back from the magic. Try again in a moment!");
    } finally {
      setThinking(false);
    }
  }

  function startListening() {
    if (!isSttSupported()) {
      setError("This browser can't listen yet — type your question instead.");
      return;
    }
    setError(null);
    stopMascotAudio();
    setSpeaking(false);
    const rec = createListener({
      lang: 'en-GB',
      onResult: (text) => {
        if (text) sendMessage(text);
      },
      onError: (e) => {
        setError(typeof e === 'string' ? `Mic error: ${e}` : "I couldn't catch that. Try again or type instead.");
      },
      onEnd: () => setListening(false)
    });
    recognizerRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      setListening(false);
      setError("Mic couldn't start. Tap the mic again.");
    }
  }

  function stopListening() {
    if (recognizerRef.current && recognizerRef.current.stop) {
      try { recognizerRef.current.stop(); } catch (e) {}
    }
    setListening(false);
  }

  function toggleMute() {
    if (!muted) stopMascotAudio();
    setSpeaking(false);
    setMuted(m => !m);
  }

  function handleClose() {
    stopMascotAudio();
    stopListening();
    onClose && onClose();
  }

  const sttSupported = isSttSupported();
  const ttsSupported = isTtsSupported();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-3 sm:p-6">
      <div className="bg-white rounded-3xl kid-shadow w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden pop-in">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="text-4xl">{persona.avatar}</div>
          <div className="flex-1">
            <div className="font-display text-xl font-bold text-gray-800">{persona.mascotName}</div>
            <div className="text-xs text-gray-500">Helping {user} with writing</div>
          </div>
          {ttsSupported && (
            <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-100" aria-label="Mute mascot voice">
              {muted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>
          )}
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={
                'max-w-[80%] px-4 py-2.5 rounded-2xl text-base leading-relaxed ' +
                (m.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-sm'
                  : 'bg-white border-2 border-emerald-100 text-gray-800 rounded-bl-sm')
              }>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-emerald-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          {speaking && !thinking && (
            <div className="text-center text-xs text-emerald-600 font-semibold">{persona.mascotName} is speaking… 🔊</div>
          )}
          {error && (
            <div className="text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{error}</div>
          )}
        </div>

        {/* Input row */}
        <div className="p-3 border-t-2 border-gray-100 bg-white">
          <div className="flex gap-2">
            {sttSupported && (
              <button
                onClick={listening ? stopListening : startListening}
                className={'pressable flex items-center justify-center w-14 h-14 rounded-full font-bold text-white kid-shadow flex-shrink-0 ' +
                  (listening
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gradient-to-br from-emerald-400 to-green-600')}
                aria-label={listening ? 'Stop listening' : 'Start listening'}
              >
                {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            )}
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && typed.trim()) { sendMessage(typed); setTyped(''); } }}
              placeholder={sttSupported ? "Or type your question…" : "Type your question…"}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-400 outline-none text-base"
            />
            <button
              onClick={() => { if (typed.trim()) { sendMessage(typed); setTyped(''); } }}
              disabled={!typed.trim() || thinking}
              className="pressable flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white kid-shadow disabled:opacity-40 flex-shrink-0"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">
            {sttSupported
              ? `Tap 🎤 and ask ${persona.mascotName} for ideas, spelling help, or to read the prompt`
              : `Type to chat with ${persona.mascotName}`}
          </div>
        </div>
      </div>
    </div>
  );
}
