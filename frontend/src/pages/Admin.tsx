import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiPut, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";

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

  const [entries, setEntries] = useState<EditableEntry[]>([]);
  useEffect(() => {
    if (schedule.data) setEntries(schedule.data.entries.map(({ id: _id, ...e }) => e));
  }, [schedule.data]);

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
