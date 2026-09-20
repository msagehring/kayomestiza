import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import {
  PHONE_DISPLAY,
  PHONE_NUMBER,
  EMAIL,
} from "@/data/menu";

export interface DropSettings {
  enabled: boolean;
  drop_at: string | null;
  overline: string;
  item_name: string;
  subtitle: string;
  location_note: string;
}

export interface ContactSettings {
  phone_display: string;
  phone_number: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface SiteSettings {
  drop: DropSettings;
  contact: ContactSettings;
}

// Defaults mirror the seeded backend document so the UI renders instantly on first
// paint and stays functional even if the settings request is still in flight or fails.
export const DEFAULT_SETTINGS: SiteSettings = {
  drop: {
    enabled: true,
    drop_at: null,
    overline: "Opening Soon",
    item_name: "",
    subtitle:
      "Kayo Mestiza is firing up its first pop-up. Join the list and you'll be the first to know the date, the spot, and the menu.",
    location_note: "Fredericksburg, VA ★ Locations announced to the list first",
  },
  contact: {
    phone_display: PHONE_DISPLAY,
    phone_number: PHONE_NUMBER,
    email: EMAIL,
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

export function useSettings() {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiGet<SiteSettings>("/settings"),
    staleTime: 60_000,
  });
  return query.data ?? DEFAULT_SETTINGS;
}

// Derived contact link helpers so components never re-build tel:/sms:/mailto: by hand.
export function useContact() {
  const { contact } = useSettings();
  return {
    ...contact,
    tel: `tel:${contact.phone_number}`,
    sms: `sms:${contact.phone_number}`,
    mailto: `mailto:${contact.email}`,
  };
}
