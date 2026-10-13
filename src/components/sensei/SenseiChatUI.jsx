import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";

// ── Icons ────────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

const MicIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
      fill={active ? "currentColor" : "none"}
    />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
    />
  </svg>
);

const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
);
const ZoomOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35M8 11h6" />
  </svg>
);

// ── Sensei avatar pill ────────────────────────────────────────────────────────
const SenseiAvatar = ({ speaking }) => (
  <div className="relative flex-shrink-0">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg
        bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white
        ${speaking ? "ring-2 ring-fuchsia-400 ring-offset-1 ring-offset-transparent" : ""}`}
    >
      先
    </div>
    {speaking && (
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f0c29] animate-pulse" />
    )}
  </div>
);

// ── Chat bubble ───────────────────────────────────────────────────────────────
const Bubble = ({ role, text, isLatest }) => {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}
        ${isLatest ? "animate-slideUp" : ""}`}
    >
      {/* Icon */}
      {isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
          <svg viewBox="-2 -2 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-2" y="-2" width="24.00" height="24.00" rx="12" fill="#2709be" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#1342]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#f4f0f0"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]"> </path> </g> </g> </g> </g></svg>
        </div>
      ) : (
        <SenseiAvatar speaking={false} />
      )}

      {/* Bubble body */}
      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-md
          ${isUser
            ? "bg-violet-600 text-white rounded-2xl rounded-br-sm"
            : "bg-white/10 text-white/95 rounded-2xl rounded-bl-sm border border-white/10 backdrop-blur-sm"
          }`}
      >
        {text}
      </div>
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-2.5">
    <SenseiAvatar speaking={true} />
    <div className="bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-sm shadow-md">
      <div className="flex gap-1.5 items-center">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"
            style={{ animation: `bounce 1s ${delay}s infinite` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ── Status bar at top of chat ─────────────────────────────────────────────────
const StatusBar = ({ message, loading }) => {
  if (loading) return (
    <div className="flex items-center gap-2 text-fuchsia-300 text-xs mb-2 font-general">
      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
      Sensei is thinking…
    </div>
  );
  if (message) return (
    <div className="flex items-center gap-2 text-green-300 text-xs mb-2 font-general">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      Sensei is speaking…
    </div>
  );
  return null;
};

// ── Main overlay ──────────────────────────────────────────────────────────────
export const SenseiChatUI = () => {
  const { chat, loading, cameraZoomed, setCameraZoomed, history, message } = useChat();

  const [input, setInput]               = useState("");
  const [listening, setListening]       = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const chatEndRef    = useRef(null);
  const inputRef      = useRef(null);
  const recognitionRef = useRef(null);

  // ── Unlock audio context on first user interaction ────────────────────────
  // This is the key fix for autoplay — browsers require a user gesture before
  // any audio can play. We create and immediately resume/suspend an AudioContext.
  const unlockAudio = () => {
    if (audioUnlocked) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume().then(() => ctx.suspend());
      setAudioUnlocked(true);
    } catch {}
  };

  // ── Speech recognition setup ──────────────────────────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setSpeechSupported(true);

    const rec = new SR();
    rec.continuous    = false;
    rec.interimResults = true;
    rec.lang          = "en-US";

    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join("");
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);

    recognitionRef.current = rec;
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = () => {
    unlockAudio();
    const text = input.trim();
    if (!text || loading || message) return;
    chat(text);
    setInput("");
    inputRef.current?.focus();
  };

  // ── Mic ───────────────────────────────────────────────────────────────────
  const toggleMic = () => {
    unlockAudio();
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setInput("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const isBusy = loading || !!message;

  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none"
      onClick={unlockAudio} // unlock audio on any click anywhere
    >
      {/* ── Top-right controls ─────────────────────────────────────────── */}
      <div className="pointer-events-auto absolute right-4 top-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => setCameraZoomed(!cameraZoomed)}
          title={cameraZoomed ? "Zoom out" : "Zoom in"}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/15 backdrop-blur-md
                     text-white/70 flex items-center justify-center hover:bg-violet-600/60
                     hover:text-white hover:border-violet-500 transition-all duration-200 shadow-lg"
        >
          {cameraZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
        </button>
      </div>

      {/* ── Bottom chat panel ──────────────────────────────────────────── */}
      <div className="pointer-events-auto absolute bottom-0 inset-x-0 flex flex-col
                      px-4 pb-5 pt-3 gap-3
                      bg-gradient-to-t from-black/80 via-black/40 to-transparent
                      backdrop-blur-[2px]">

        {/* Header row */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <SenseiAvatar speaking={!!message} />
            <div>
              <p className="text-white font-semibold text-sm leading-none tracking-wide">Anime Sensei</p>
              <p className="text-white/40 text-[10px] mt-0.5 font-general tracking-widest uppercase">
                {message ? "Speaking…" : loading ? "Thinking…" : "Customer Support"}
              </p>
            </div>
          </div>

          {/* Audio unlock hint — shown until user has interacted */}
          {!audioUnlocked && (
            <span className="text-white/30 text-[10px] font-general italic">
              Click anywhere to enable voice
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8" />

        {/* Message list */}
        <div
          className="flex flex-col gap-2.5 overflow-y-auto max-h-52 sm:max-h-64 pr-1"
          style={{ scrollbarWidth: "none" }}
        >
          {history.length === 0 && !loading && (
            <p className="text-white/25 text-xs text-center font-general py-4 italic">
              Ask Sensei anything about anime to begin…
            </p>
          )}

          {history.map((item, i) => (
            <Bubble
              key={i}
              role={item.role}
              text={item.text}
              isLatest={i === history.length - 1}
            />
          ))}

          {loading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 mt-1">

          {/* Mic */}
          {speechSupported && (
            <button
              onClick={toggleMic}
              disabled={isBusy}
              title={listening ? "Stop" : "Speak"}
              className={`flex-shrink-0 px-4 py-4 rounded-full flex items-center justify-center
                          border transition-all duration-200 shadow-lg
                          ${listening
                  ? "bg-red-500/90 border-red-400 text-white scale-110"
                  : "bg-white/8 border-white/15 text-white/60 hover:bg-violet-600/70 hover:text-white hover:border-violet-500"
                }
                          ${isBusy && !listening ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <MicIcon active={listening} />
            </button>
          )}

          {/* Input field */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              onFocus={unlockAudio}
              disabled={isBusy}
              placeholder={
                listening   ? "Listening… speak now"
                : isBusy    ? "Sensei is responding…"
                : "Ask Sensei anything about anime…"
              }
              className="w-full px-5 py-3 rounded-full text-sm
                         bg-white/8 border border-white/15 backdrop-blur-sm
                         text-black placeholder-black/30 outline-none
                         focus:bg-black/12 focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-inner"
            />
            {/* Listening pulse ring */}
            {listening && (
              <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-40 pointer-events-none" />
            )}
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={isBusy || !input.trim()}
            title="Send"
            className={`flex-shrink-0  px-4 py-4 rounded-full flex items-center justify-center
                        border transition-all duration-200 shadow-lg
                        ${!isBusy && input.trim()
                ? "bg-violet-600 border-violet-500 text-white hover:bg-fuchsia-600 hover:border-fuchsia-500 hover:scale-105 active:scale-95"
                : "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
              }`}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
