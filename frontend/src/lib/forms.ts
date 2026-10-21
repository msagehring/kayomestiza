// Static-hosting form transport. The site no longer has its own backend, so form
// submissions go to Web3Forms, which emails each entry to the inbox tied to the key.
// The key is public by design (it only allows sending to that one inbox) and is read
// from VITE_WEB3FORMS_KEY at build time — set it in the hosting dashboard.
import { ApiError } from "./api";

const KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export async function sendForm(subject: string, fields: Record<string, unknown>) {
  if (!KEY) throw new ApiError(503, { detail: "Form key not configured" });
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: KEY, subject, from_name: "kayomestiza.com", ...fields }),
  });
  const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!res.ok || !body?.success) throw new ApiError(res.status, body);
  return body;
}
