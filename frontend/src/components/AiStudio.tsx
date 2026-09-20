import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, ImagePlus, Loader2, PenLine } from "lucide-react";
import { apiPost, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CHANNELS = ["instagram caption", "SMS blast", "menu description", "website hero headline", "event flyer"];

export const AiStudio = () => {
  const [subject, setSubject] = useState("Weekend special: The Kayo Box combo");
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [variants, setVariants] = useState<string[]>([]);

  const [imgPrompt, setImgPrompt] = useState("Crispy cheesesteak lumpia stacked on a metal tray with sweet chili drizzle");
  const [image, setImage] = useState<string | null>(null);

  const writeCopy = useMutation({
    mutationFn: () => apiPost<{ variants: string[] }>("/ai/copy", { subject, channel, variants: 3 }),
    onSuccess: (d) => setVariants(d.variants),
    onError: () => toast.error("Copywriter failed. Try again."),
  });

  const makeImage = useMutation({
    mutationFn: () => apiPost<{ mime_type: string; data: string }>("/ai/specials-image", { prompt: imgPrompt }),
    onSuccess: (d) => setImage(`data:${d.mime_type};base64,${d.data}`),
    onError: (err) => {
      const detail =
        err instanceof ApiError && typeof (err.body as { detail?: string })?.detail === "string"
          ? (err.body as { detail: string }).detail
          : "Image generation failed. Try again.";
      toast.error(detail, { duration: 8000 });
    },
  });

  return (
    <section className="mt-8 border-2 border-flame/50 bg-panel p-5 sm:p-6" data-testid="admin-ai-studio">
      <h2 className="font-heading text-lg font-bold uppercase text-flame">AI Studio</h2>
      <p className="mt-1 font-mono2 text-[10px] uppercase tracking-widest text-slate-500">Powered by Gemini</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <span className="flex items-center gap-2 font-mono2 text-xs uppercase tracking-widest text-slate-300">
            <PenLine className="h-3.5 w-3.5 text-gold" /> Copywriter
          </span>
          <div className="mt-3 space-y-3">
            <div>
              <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Brief</Label>
              <Textarea
                rows={2}
                data-testid="ai-copy-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 border-white/20 bg-coal text-white"
              />
            </div>
            <div>
              <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Channel</Label>
              <select
                data-testid="ai-copy-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="mt-2 w-full border border-white/20 bg-coal px-2 py-2 text-sm text-white"
              >
                {CHANNELS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => writeCopy.mutate()}
              disabled={writeCopy.isPending}
              data-testid="ai-copy-btn"
              className="sticker h-auto bg-gold px-5 py-2 font-heading text-xs text-black hover:bg-flame hover:text-white"
            >
              {writeCopy.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Write 3 Options"}
            </Button>
          </div>
          <div className="mt-4 space-y-2" data-testid="ai-copy-results">
            {variants.map((v, i) => (
              <div key={i} className="group flex items-start gap-2 border border-white/10 bg-coal p-3 text-sm text-slate-200" data-testid={`ai-copy-variant-${i}`}>
                <span className="flex-1">{v}</span>
                <button
                  data-testid={`ai-copy-copy-${i}`}
                  onClick={() => {
                    void navigator.clipboard.writeText(v);
                    toast.success("Copied");
                  }}
                  className="text-slate-500 transition-colors hover:text-gold"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="flex items-center gap-2 font-mono2 text-xs uppercase tracking-widest text-slate-300">
            <ImagePlus className="h-3.5 w-3.5 text-gold" /> Specials Image Generator
          </span>
          <div className="mt-3 space-y-3">
            <div>
              <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Describe the dish</Label>
              <Textarea
                rows={3}
                data-testid="ai-image-prompt"
                value={imgPrompt}
                onChange={(e) => setImgPrompt(e.target.value)}
                className="mt-2 border-white/20 bg-coal text-white"
              />
            </div>
            <Button
              onClick={() => makeImage.mutate()}
              disabled={makeImage.isPending}
              data-testid="ai-image-btn"
              className="sticker h-auto bg-flame px-5 py-2 font-heading text-xs text-white hover:bg-scarlet"
            >
              {makeImage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Special"}
            </Button>
            {makeImage.isPending && (
              <p className="font-mono2 text-[10px] uppercase tracking-widest text-slate-500" data-testid="ai-image-loading">
                Plating it up… ~15s
              </p>
            )}
            {image && (
              <div data-testid="ai-image-result">
                <img src={image} alt="Generated special" className="w-full border-2 border-gold/40" />
                <a
                  href={image}
                  download="kayo-special.png"
                  data-testid="ai-image-download"
                  className="mt-2 inline-block font-mono2 text-[10px] uppercase tracking-widest text-gold hover:text-flame"
                >
                  Download image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
