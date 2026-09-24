export interface Inquiry {
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

const badge = (type: string) =>
  type === "catering" ? "bg-gold text-black" : type === "contact" ? "bg-deepblue text-white" : "bg-scarlet text-white";

export const InquiriesList = ({ entries }: { entries: Inquiry[] }) => (
  <>
    <h2 className="mt-14 font-heading text-lg font-bold uppercase text-white" data-testid="admin-inquiries-heading">
      Inbox ({entries.length})
    </h2>
    <div className="mt-4 space-y-3" data-testid="admin-inquiries-list">
      {entries.map((q) => (
        <div key={q.id} className="border-2 border-white/10 bg-panel p-4 text-sm" data-testid={`admin-inquiry-${q.id}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`sticker px-2 py-0.5 text-[10px] ${badge(q.type)}`}>{q.type}</span>
            <span className="font-bold text-white">{q.name}</span>
            <span className="text-slate-400">{q.email}</span>
            {q.phone && <span className="text-slate-400">{q.phone}</span>}
          </div>
          {q.package && (
            <p className="mt-1 font-mono2 text-xs uppercase text-gold">
              {q.package}
              {q.guests ? ` · ${q.guests} guests` : ""}
              {q.event_date ? ` · ${q.event_date}` : ""}
            </p>
          )}
          <p className="mt-2 text-slate-300">{q.message}</p>
        </div>
      ))}
      {entries.length === 0 && <p className="text-sm text-slate-500">No inquiries yet.</p>}
    </div>
  </>
);
