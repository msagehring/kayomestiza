import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface EditableEntry {
  uid: string;
  day: string;
  time: string;
  location: string;
  address: string;
  note: string;
  closed: boolean;
}

export const newEntry = (): EditableEntry => ({
  uid: globalThis.crypto?.randomUUID?.() ?? `e-${Date.now()}-${Math.random()}`,
  day: "Monday",
  time: "",
  location: "",
  address: "",
  note: "",
  closed: false,
});

interface Props {
  entries: EditableEntry[];
  onChange: (next: EditableEntry[]) => void;
  onSave: () => void;
  saving: boolean;
}

export const ScheduleEditor = ({ entries, onChange, onSave, saving }: Props) => {
  const patch = (uid: string, fields: Partial<EditableEntry>) =>
    onChange(entries.map((e) => (e.uid === uid ? { ...e, ...fields } : e)));

  return (
    <>
      <div className="mt-8 space-y-4" data-testid="admin-schedule-editor">
        {entries.map((entry, i) => (
          <div key={entry.uid} className="grid gap-3 border-2 border-white/10 bg-panel p-4 sm:grid-cols-6" data-testid={`admin-entry-${i}`}>
            <select
              value={entry.day}
              onChange={(e) => patch(entry.uid, { day: e.target.value })}
              data-testid={`admin-entry-day-${i}`}
              className="border border-white/20 bg-coal px-2 py-2 text-sm text-white"
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <Input placeholder="5:00 PM - 10:00 PM" value={entry.time} data-testid={`admin-entry-time-${i}`} onChange={(e) => patch(entry.uid, { time: e.target.value })} className="border-white/20 bg-coal text-white sm:col-span-2" />
            <Input placeholder="Location" value={entry.location} data-testid={`admin-entry-location-${i}`} onChange={(e) => patch(entry.uid, { location: e.target.value })} className="border-white/20 bg-coal text-white sm:col-span-2" />
            <label className="flex items-center gap-2 font-mono2 text-xs uppercase text-slate-300">
              <input type="checkbox" checked={entry.closed} data-testid={`admin-entry-closed-${i}`} onChange={(e) => patch(entry.uid, { closed: e.target.checked })} />
              Closed
            </label>
            <Input placeholder="Address" value={entry.address} data-testid={`admin-entry-address-${i}`} onChange={(e) => patch(entry.uid, { address: e.target.value })} className="border-white/20 bg-coal text-white sm:col-span-3" />
            <Input placeholder="Note (optional)" value={entry.note} data-testid={`admin-entry-note-${i}`} onChange={(e) => patch(entry.uid, { note: e.target.value })} className="border-white/20 bg-coal text-white sm:col-span-2" />
            <button
              type="button"
              onClick={() => onChange(entries.filter((e) => e.uid !== entry.uid))}
              data-testid={`admin-entry-remove-${i}`}
              className="flex items-center gap-1 font-mono2 text-xs uppercase text-scarlet hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onChange([...entries, newEntry()])}
          data-testid="admin-add-entry-btn"
          className="sticker flex items-center gap-2 bg-deepblue px-4 py-2 text-xs text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Add Day
        </button>
        <Button onClick={onSave} disabled={saving} data-testid="admin-save-schedule-btn" className="sticker h-auto bg-gold px-6 py-2 font-heading text-xs text-black hover:bg-flame hover:text-white">
          {saving ? "Saving…" : "Publish Schedule"}
        </Button>
      </div>
    </>
  );
};
