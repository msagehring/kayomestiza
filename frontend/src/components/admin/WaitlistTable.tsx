export interface WaitlistEntry {
  id: string;
  email: string;
  phone: string;
  sms_optin: boolean;
  source: string;
  created_at: string;
}

export const WaitlistTable = ({ entries }: { entries: WaitlistEntry[] }) => (
  <>
    <div className="mt-14 flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-heading text-lg font-bold uppercase text-white" data-testid="admin-waitlist-heading">
        Pop-Up Alert List ({entries.length})
      </h2>
      <a
        href="/api/waitlist/export"
        data-testid="admin-waitlist-export-btn"
        className="sticker bg-gold px-4 py-2 font-heading text-[11px] uppercase text-black hover:bg-flame hover:text-white"
      >
        Download CSV
      </a>
    </div>
    <div className="mt-4 overflow-x-auto border border-white/10" data-testid="admin-waitlist-list">
      <table className="w-full text-left text-sm">
        <thead className="bg-panel font-mono2 text-[10px] uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Mobile</th>
            <th className="px-3 py-2">SMS</th>
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((w) => (
            <tr key={w.id} className="border-t border-white/10" data-testid={`waitlist-row-${w.email}`}>
              <td className="px-3 py-2 text-white">{w.email}</td>
              <td className="px-3 py-2 text-slate-400">{w.phone || "—"}</td>
              <td className="px-3 py-2">
                {w.sms_optin ? <span className="font-mono2 text-[10px] uppercase text-gold">Opted in</span> : <span className="text-slate-600">—</span>}
              </td>
              <td className="px-3 py-2 font-mono2 text-[10px] uppercase text-slate-500">{w.source}</td>
              <td className="px-3 py-2 font-mono2 text-[10px] uppercase text-slate-500">{new Date(w.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && <p className="p-4 text-sm text-slate-500" data-testid="admin-waitlist-empty">Nobody on the list yet.</p>}
    </div>
  </>
);
