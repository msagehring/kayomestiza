import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { apiGet, apiPost, apiPut, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import { AiStudio } from "@/components/AiStudio";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { ScheduleEditor, newEntry, type EditableEntry } from "@/components/admin/ScheduleEditor";
import { InquiriesList, type Inquiry } from "@/components/admin/InquiriesList";
import { WaitlistTable, type WaitlistEntry } from "@/components/admin/WaitlistTable";
import type { SiteSettings } from "@/hooks/useSettings";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
interface ScheduleResponse {
  entries: (Omit<EditableEntry, "uid"> & { id: string })[];
}

const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiPost<AdminUser>("/auth/login", creds);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? "Invalid email or password" : "Network error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-coal px-4" data-testid="admin-login-screen">
      <form onSubmit={submit} className="w-full max-w-sm border-2 border-white/10 bg-panel p-8" data-testid="admin-login-form">
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
          {error && <p className="text-sm text-red-400" data-testid="admin-login-error">{error}</p>}
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
};

export default function Admin() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => apiGet<AdminUser>("/auth/me"), retry: false });
  const authed = !!me.data;

  const schedule = useQuery({ queryKey: ["admin-schedule"], queryFn: () => apiGet<ScheduleResponse>("/schedule"), enabled: authed });
  const inquiries = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => apiGet<Inquiry[]>("/inquiries"), enabled: authed });
  const waitlist = useQuery({ queryKey: ["admin-waitlist"], queryFn: () => apiGet<WaitlistEntry[]>("/waitlist"), enabled: authed });
  const settingsQuery = useQuery({ queryKey: ["admin-settings"], queryFn: () => apiGet<SiteSettings>("/settings"), enabled: authed });

  const [entries, setEntries] = useState<EditableEntry[]>([]);
  useEffect(() => {
    if (schedule.data) setEntries(schedule.data.entries.map(({ id, ...e }) => ({ ...e, uid: id })));
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

  const saveSchedule = useMutation({
    mutationFn: () => apiPut<ScheduleResponse>("/schedule", { entries: entries.map(({ uid, ...e }) => e) }),
    onSuccess: () => {
      toast.success("Schedule updated — it's live on the site.");
      qc.invalidateQueries({ queryKey: ["admin-schedule"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: () => toast.error("Save failed. Try again."),
  });

  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal text-gold">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => qc.invalidateQueries({ queryKey: ["me"] })} />;
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
          <SettingsEditor
            settings={settings}
            onChange={setSettings}
            onSave={() => saveSettings.mutate()}
            saving={saveSettings.isPending}
          />
        )}

        <AiStudio />

        <ScheduleEditor
          entries={entries}
          onChange={setEntries}
          onSave={() => saveSchedule.mutate()}
          saving={saveSchedule.isPending}
        />

        <InquiriesList entries={inquiries.data ?? []} />
        <WaitlistTable entries={waitlist.data ?? []} />
      </div>
    </div>
  );
}
