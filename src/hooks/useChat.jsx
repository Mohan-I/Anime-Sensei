import { createContext, useContext, useEffect, useRef, useState } from "react";

const BACKEND_URL =
  import.meta.env.VITE_SENSEI_API_URL || "http://localhost:3001";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [queue, setQueue]       = useState([]); // messages waiting to play
  const [message, setMessage]   = useState(null); // message currently playing
  const [loading, setLoading]   = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [history, setHistory]   = useState([]);

  // Use a ref so the Avatar's audio.onended callback always sees the latest value
  const queueRef   = useRef([]);
  const messageRef = useRef(null);
  // Guard against double-call in React 18 StrictMode
  const greetCalledRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { messageRef.current = message; }, [message]);

  // ── Pop next message when queue changes and nothing is playing ────────────
  useEffect(() => {
    if (queue.length > 0 && !message) {
      setMessage(queue[0]);
    }
  }, [queue, message]);

  // ── Called by Avatar when current audio finishes ──────────────────────────
  const onMessagePlayed = () => {
    setQueue((q) => {
      const next = q.slice(1);
      queueRef.current = next;
      return next;
    });
    setMessage(null);
    messageRef.current = null;
  };

  // ── Send user message ─────────────────────────────────────────────────────
  const chat = async (userText) => {
    if (!userText?.trim() || loading) return;

    setHistory((h) => [...h, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const incoming = data.messages ?? [];

      incoming.forEach((m) =>
        setHistory((h) => [...h, { role: "sensei", text: m.text }])
      );
      setQueue((q) => [...q, ...incoming]);
    } catch (err) {
      console.error("Chat error:", err);
      setHistory((h) => [
        ...h,
        {
          role: "sensei",
          text: "Gomen nasai, seito-san… Something went wrong. Please make sure the backend server is running on port 3001.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Greeting on first load (runs once, StrictMode-safe) ──────────────────
  const greet = async () => {
    if (greetCalledRef.current) return;
    greetCalledRef.current = true;

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: null }),
      });
      const data = await res.json();
      const incoming = data.messages ?? [];
      incoming.forEach((m) =>
        setHistory((h) => [...h, { role: "sensei", text: m.text }])
      );
      setQueue((q) => [...q, ...incoming]);
    } catch {
      /* backend not running yet — skip greeting silently */
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        greet,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        history,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
};
