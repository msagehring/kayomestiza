import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, MessageCircle, Phone, Send, X } from "lucide-react";
import { apiPost } from "@/lib/api";
import { MENU } from "@/data/menu";
import { useContact } from "@/hooks/useSettings";

const MENU_PAYLOAD = MENU.flatMap((c) =>
  c.items.map((i) => ({
    name: i.name,
    description: i.description,
    price: i.price,
    category: c.label,
    tags: i.tags,
    heat: i.heat,
  })),
);

const STARTERS = [
  "What should a first-timer order?",
  "Best combo for two people?",
  "Any dessert worth the calories?",
];

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const mkMsg = (role: Msg["role"], text: string): Msg => ({
  id: globalThis.crypto?.randomUUID?.() ?? `m-${Date.now()}-${Math.random()}`,
  role,
  text,
});

export const MenuConcierge = () => {
  const contact = useContact();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    mkMsg(
      "assistant",
      "Yo — I'm the Kayo concierge. Tell me what you're craving, how spicy you ride, or who you're feeding, and I'll build your order.",
    ),
  ]);
  const sessionId = useRef(
    (globalThis.crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random()}`).slice(0, 40),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    setMsgs((m) => [...m, mkMsg("user", question)]);
    setBusy(true);
    try {
      const res = await apiPost<{ answer: string }>("/ai/concierge", {
        session_id: sessionId.current,
        message: question,
        menu: MENU_PAYLOAD,
      });
      setMsgs((m) => [...m, mkMsg("assistant", res.answer)]);
    } catch {
      setMsgs((m) => [
        ...m,
        mkMsg("assistant", `My brain's offline for a sec. Text the truck at ${contact.phone_display} and we got you.`),
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        data-testid="concierge-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open menu concierge"
        className="sticker fixed bottom-24 right-4 z-[60] flex items-center gap-2 bg-gold px-4 py-3 font-heading text-[11px] uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 sm:bottom-6"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        {open ? "Close" : "Ask the Truck"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="concierge-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-40 right-4 z-[60] flex h-[27rem] w-[min(23rem,calc(100vw-2rem))] flex-col border-2 border-gold/50 bg-coal/95 backdrop-blur-xl sm:bottom-20"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-panel px-4 py-3">
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-gold">Kayo Concierge</p>
                <p className="font-heading text-sm uppercase text-white">Menu Guide · Live</p>
              </div>
              <a
                href={contact.tel}
                data-testid="concierge-call-link"
                className="sticker bg-flame px-3 py-1.5 font-heading text-[10px] uppercase text-white"
              >
                <Phone className="mr-1 inline h-3 w-3" /> Call
              </a>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="concierge-messages">
              {msgs.map((m, i) => (
                <div
                  key={m.id}
                  data-testid={`concierge-msg-${m.role}-${i}`}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] border-l-2 border-flame bg-flame/15 px-3 py-2 text-sm text-white"
                      : "max-w-[90%] border-l-2 border-gold bg-white/5 px-3 py-2 text-sm text-slate-200"
                  }
                >
                  {m.text}
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 font-mono2 text-xs uppercase text-gold" data-testid="concierge-loading">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Firing up the griddle…
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTERS.map((s, i) => (
                    <button
                      key={s}
                      data-testid={`concierge-starter-${i}`}
                      onClick={() => send(s)}
                      className="border border-white/20 px-2 py-1 text-left font-mono2 text-[10px] uppercase tracking-wide text-slate-300 transition-colors hover:border-gold hover:text-gold"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-panel px-3 py-3"
            >
              <input
                data-testid="concierge-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's good tonight?"
                className="flex-1 bg-coal px-3 py-2 text-sm text-white outline-none ring-gold/60 placeholder:text-slate-500 focus:ring-1"
              />
              <button
                type="submit"
                data-testid="concierge-send-btn"
                disabled={busy}
                className="sticker bg-gold px-3 py-2 text-black disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
