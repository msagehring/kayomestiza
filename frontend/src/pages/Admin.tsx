import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiPut, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import type { SiteSettings } from "@/hooks/useSettings";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
interface EditableEntry {
  day: string;
  time: string;
  location: string;
  address: string;
  note: string;
  closed: boolean;
}
interface ScheduleResponse {
  entries: (EditableEntry & { id: string })[];
}
interface Inquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  event_date: string | null;
  guests: number | null;
  package: string | null;
  created_at: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// datetime-local <-> ISO helpers. The input works in the admin's local timezone; we store UTC ISO.
const isoToLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};
const localInputToIso = (val: string) => (val ? new Date(val).toISOString() : null);

export default function Admin() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => apiGet<AdminUser>("/auth/me"), retry: false });
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const schedule = useQuery({
    queryKey: ["admin-schedule"],
    queryFn: () => apiGet<ScheduleResponse>("/schedule"),
    enabled: !!me.data,
  });
  const inquiries = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => apiGet<Inquiry[]>("/inquiries"),
    enabled: !!me.data,
  });
  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => apiGet<SiteSettings>("/settings"),
    enabled: !!me.data,
  });

  const [entries, setEntries] = useState<EditableEntry[]>([]);
  useEffect(() => {
    if (schedule.data) setEntries(schedule.data.entries.map(({ id: _id, ...e }) => e));
  }, [schedule.data]);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data);
  }, [settingsQuery.data]);

  const saveSettings = useMutation({
    mutationFn: () => apiPut<SiteSettings>("/settings", settings),
    onSuccess: () => {
      toast.success("Settings saved — live on the site.");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => toast.error("Save failed. Try again."),
  });

  const save = useMutation({
    mutationFn: () => apiPut<ScheduleResponse>("/schedule", { entries }),
    onSuccess: () => {
      toast.success("Schedule updated — it's live on the site.");
      qc.invalidateQueries({ queryKey: ["admin-schedule"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: () => toast.error("Save failed. Try again."),
  });

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await apiPost<AdminUser>("/auth/login", creds);
      qc.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      setLoginError(err instanceof ApiError ? "Invalid email or password" : "Network error");
    }
  };

  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal text-gold">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal px-4" data-testid="admin-login-screen">
        <form onSubmit={login} className="w-full max-w-sm border-2 border-white/10 bg-panel p-8" data-testid="admin-login-form">
          <div className="flex items-center gap-2 text-gold">
            <FilipinoSunIcon className="h-7 w-7" />
            <span className="font-heading text-lg font-bold uppercase text-white">Truck Admin</span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="admin-email" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Email</Label>
              <Input id="admin-email" data-testid="admin-email-input" type="email" required value={creds.email} onChange={(e) => setCreds((c) => ({ ...c, email: e.target.value }))} className="mt-2 border-white/20 bg-coal text-white" />
            </div>
            <div>
              <Label htmlFor="admin-password" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Password</Label>
              <Input id="admin-password" data-testid="admin-password-input" type="password" required value={creds.password} onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))} className="mt-2 border-white/20 bg-coal text-white" />
            </div>
            {loginError && <p className="text-sm text-red-400" data-testid="admin-login-error">{loginError}</p>}
            <Button type="submit" data-testid="admin-login-btn" className="sticker h-auto w-full bg-flame py-3 font-heading text-sm text-white hover:bg-scarlet">
              Log In
            </Button>
            <Link to="/" className="block text-center font-mono2 text-xs uppercase tracking-wider text-slate-400 hover:text-gold" data-testid="admin-back-link">
              Back to site
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coal px-4 py-10 text-white sm:px-6" data-testid="admin-dashboard">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gold">
            <FilipinoSunIcon className="h-7 w-7" />
            <h1 className="font-heading text-xl font-bold uppercase text-white">Schedule Admin</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="font-mono2 text-xs uppercase tracking-wider text-slate-400 hover:text-gold" data-testid="admin-back-to-site">
              View site
            </Link>
            <button
              data-testid="admin-logout-btn"
              className="flex items-center gap-1 font-mono2 text-xs uppercase tracking-wider text-slate-400 hover:text-scarlet"
              onClick={async () => {
                await apiPost("/auth/logout");
                qc.clear();
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>

        {settings && (
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
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, enabled: e.target.checked } })}
                  />
                  Show on site
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Drop date &amp; time</Label>
                  <Input
                    type="datetime-local"
                    data-testid="settings-drop-at"
                    value={isoToLocalInput(settings.drop.drop_at)}
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, drop_at: localInputToIso(e.target.value) } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                  <p className="mt-1 font-mono2 text-[10px] uppercase text-slate-500">Leave blank for auto next-Saturday-noon</p>
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Item name</Label>
                  <Input
                    data-testid="settings-drop-item"
                    value={settings.drop.item_name}
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, item_name: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Overline</Label>
                  <Input
                    data-testid="settings-drop-overline"
                    value={settings.drop.overline}
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, overline: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Location note</Label>
                  <Input
                    data-testid="settings-drop-location"
                    value={settings.drop.location_note}
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, location_note: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Subtitle</Label>
                  <Textarea
                    data-testid="settings-drop-subtitle"
                    rows={2}
                    value={settings.drop.subtitle}
                    onChange={(e) => setSettings((s) => s && { ...s, drop: { ...s.drop, subtitle: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <span className="font-mono2 text-xs uppercase tracking-widest text-slate-300">Contact Details</span>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Phone (display)</Label>
                  <Input
                    data-testid="settings-phone-display"
                    value={settings.contact.phone_display}
                    onChange={(e) => setSettings((s) => s && { ...s, contact: { ...s.contact, phone_display: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Phone (dial, +1…)</Label>
                  <Input
                    data-testid="settings-phone-number"
                    value={settings.contact.phone_number}
                    onChange={(e) => setSettings((s) => s && { ...s, contact: { ...s.contact, phone_number: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Email</Label>
                  <Input
                    type="email"
                    data-testid="settings-email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings((s) => s && { ...s, contact: { ...s.contact, email: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
                <div>
                  <Label className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Instagram URL</Label>
                  <Input
                    data-testid="settings-instagram"
                    value={settings.contact.instagram}
                    onChange={(e) => setSettings((s) => s && { ...s, contact: { ...s.contact, instagram: e.target.value } })}
                    className="mt-2 border-white/20 bg-coal text-white"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => saveSettings.mutate()}
              disabled={saveSettings.isPending}
              data-testid="settings-save-btn"
              className="sticker mt-6 h-auto bg-gold px-6 py-2 font-heading text-xs text-black hover:bg-flame hover:text-white"
            >
              {saveSettings.isPending ? "Saving…" : "Save Drop & Contact"}
            </Button>
          </section>
        )}

        <div className="mt-8 space-y-4" data-testid="admin-schedule-editor">
          {entries.map((entry, i) => (
            <div key={i} className="grid gap-3 border-2 border-white/10 bg-panel p-4 sm:grid-cols-6" data-testid={`admin-entry-${i}`}>
              <select
                value={entry.day}
                onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))}
                data-testid={`admin-entry-day-${i}`}
                className="border border-white/20 bg-coal px-2 py-2 text-sm text-white"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <Input placeholder="5:00 PM - 10:00 PM" value={entry.time} data-testid={`admin-entry-time-${i}`} onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} className="border-white/20 bg-coal text-white sm:col-span-2" />
              <Input placeholder="Location" value={entry.location} data-testid={`admin-entry-location-${i}`} onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, location: e.target.value } : x)))} className="border-white/20 bg-coal text-white sm:col-span-2" />
              <label className="flex items-center gap-2 font-mono2 text-xs uppercase text-slate-300">
                <input type="checkbox" checked={entry.closed} data-testid={`admin-entry-closed-${i}`} onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, closed: e.target.checked } : x)))} />
                Closed
              </label>
              <Input placeholder="Address" value={entry.address} data-testid={`admin-entry-address-${i}`} onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, address: e.target.value } : x)))} className="border-white/20 bg-coal text-white sm:col-span-3" />
              <Input placeholder="Note (optional)" value={entry.note} data-testid={`admin-entry-note-${i}`} onChange={(e) => setEntries((arr) => arr.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} className="border-white/20 bg-coal text-white sm:col-span-2" />
              <button type="button" onClick={() => setEntries((arr) => arr.filter((_, j) => j !== i))} data-testid={`admin-entry-remove-${i}`} className="flex items-center gap-1 font-mono2 text-xs uppercase text-scarlet hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setEntries((arr) => [...arr, { day: "Monday", time: "", location: "", address: "", note: "", closed: false }])}
            data-testid="admin-add-entry-btn"
            className="sticker flex items-center gap-2 bg-deepblue px-4 py-2 text-xs text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Add Day
          </button>
          <Button onClick={() => save.mutate()} disabled={save.isPending} data-testid="admin-save-schedule-btn" className="sticker h-auto bg-gold px-6 py-2 font-heading text-xs text-black hover:bg-flame hover:text-white">
            {save.isPending ? "Saving…" : "Publish Schedule"}
          </Button>
        </div>

        <h2 className="mt-14 font-heading text-lg font-bold uppercase text-white" data-testid="admin-inquiries-heading">
          Inbox ({inquiries.data?.length ?? 0})
        </h2>
        <div className="mt-4 space-y-3" data-testid="admin-inquiries-list">
          {(inquiries.data ?? []).map((q) => (
            <div key={q.id} className="border-2 border-white/10 bg-panel p-4 text-sm" data-testid={`admin-inquiry-${q.id}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`sticker px-2 py-0.5 text-[10px] ${q.type === "catering" ? "bg-gold text-black" : q.type === "contact" ? "bg-deepblue text-white" : "bg-scarlet text-white"}`}>{q.type}</span>
                <span className="font-bold text-white">{q.name}</span>
                <span className="text-slate-400">{q.email}</span>
                {q.phone && <span className="text-slate-400">{q.phone}</span>}
              </div>
              {q.package && <p className="mt-1 font-mono2 text-xs uppercase text-gold">{q.package}{q.guests ? ` · ${q.guests} guests` : ""}{q.event_date ? ` · ${q.event_date}` : ""}</p>}
              <p className="mt-2 text-slate-300">{q.message}</p>
            </div>
          ))}
          {inquiries.data?.length === 0 && <p className="text-sm text-slate-500">No inquiries yet.</p>}
        </div>
      </div>
    </div>
  );
}
