import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/hooks/useSettings";

const FIELD = "mt-2 border-white/20 bg-coal text-white";
const LABEL = "font-mono2 text-xs uppercase tracking-wider text-slate-300";

// datetime-local <-> ISO helpers. The input works in the admin's local timezone; we store UTC ISO.
const isoToLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const localInputToIso = (val: string) => (val ? new Date(val).toISOString() : null);

interface Props {
  settings: SiteSettings;
  onChange: (next: SiteSettings) => void;
  onSave: () => void;
  saving: boolean;
}

export const SettingsEditor = ({ settings, onChange, onSave, saving }: Props) => {
  const setDrop = (patch: Partial<SiteSettings["drop"]>) => onChange({ ...settings, drop: { ...settings.drop, ...patch } });
  const setContact = (patch: Partial<SiteSettings["contact"]>) => onChange({ ...settings, contact: { ...settings.contact, ...patch } });

  return (
    <section className="mt-8 border-2 border-gold/40 bg-panel p-5 sm:p-6" data-testid="admin-settings-editor">
      <h2 className="font-heading text-lg font-bold uppercase text-gold">Launch Drop &amp; Contact</h2>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="font-mono2 text-xs uppercase tracking-widest text-slate-300">Drop Countdown</span>
          <label className="flex items-center gap-2 font-mono2 text-xs uppercase text-slate-300">
            <input
              type="checkbox"
              checked={settings.drop.enabled}
              data-testid="settings-drop-enabled"
              onChange={(e) => setDrop({ enabled: e.target.checked })}
            />
            Show on site
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className={LABEL}>Drop date &amp; time</Label>
            <Input
              type="datetime-local"
              data-testid="settings-drop-at"
              value={isoToLocalInput(settings.drop.drop_at)}
              onChange={(e) => setDrop({ drop_at: localInputToIso(e.target.value) })}
              className={FIELD}
            />
            <p className="mt-1 font-mono2 text-[10px] uppercase text-slate-500">Leave blank for "first pop-up coming soon" mode (no timer)</p>
          </div>
          <div>
            <Label className={LABEL}>Item name</Label>
            <Input data-testid="settings-drop-item" value={settings.drop.item_name} onChange={(e) => setDrop({ item_name: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Overline</Label>
            <Input data-testid="settings-drop-overline" value={settings.drop.overline} onChange={(e) => setDrop({ overline: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Location note</Label>
            <Input data-testid="settings-drop-location" value={settings.drop.location_note} onChange={(e) => setDrop({ location_note: e.target.value })} className={FIELD} />
          </div>
          <div className="sm:col-span-2">
            <Label className={LABEL}>Subtitle</Label>
            <Textarea data-testid="settings-drop-subtitle" rows={2} value={settings.drop.subtitle} onChange={(e) => setDrop({ subtitle: e.target.value })} className={FIELD} />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <span className="font-mono2 text-xs uppercase tracking-widest text-slate-300">Contact Details</span>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className={LABEL}>Phone (display)</Label>
            <Input data-testid="settings-phone-display" value={settings.contact.phone_display} onChange={(e) => setContact({ phone_display: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Phone (dial, +1…)</Label>
            <Input data-testid="settings-phone-number" value={settings.contact.phone_number} onChange={(e) => setContact({ phone_number: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Email</Label>
            <Input type="email" data-testid="settings-email" value={settings.contact.email} onChange={(e) => setContact({ email: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Instagram URL</Label>
            <Input data-testid="settings-instagram" placeholder="https://instagram.com/yourhandle" value={settings.contact.instagram} onChange={(e) => setContact({ instagram: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>Facebook URL</Label>
            <Input data-testid="settings-facebook" placeholder="https://facebook.com/yourpage" value={settings.contact.facebook} onChange={(e) => setContact({ facebook: e.target.value })} className={FIELD} />
          </div>
          <div>
            <Label className={LABEL}>TikTok URL</Label>
            <Input data-testid="settings-tiktok" placeholder="https://tiktok.com/@yourhandle" value={settings.contact.tiktok} onChange={(e) => setContact({ tiktok: e.target.value })} className={FIELD} />
          </div>
          <p className="font-mono2 text-[10px] uppercase leading-relaxed tracking-wider text-slate-500 sm:col-span-2" data-testid="settings-contact-note">
            Phone and email appear on every Order / Call / Text button — replace the placeholders before launch. Social
            icons stay hidden until you paste a URL.
          </p>
        </div>
      </div>

      <Button
        onClick={onSave}
        disabled={saving}
        data-testid="settings-save-btn"
        className="sticker mt-6 h-auto bg-gold px-6 py-2 font-heading text-xs text-black hover:bg-flame hover:text-white"
      >
        {saving ? "Saving…" : "Save Drop & Contact"}
      </Button>
    </section>
  );
};
