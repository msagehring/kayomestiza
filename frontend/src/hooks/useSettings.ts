import {
  PHONE_DISPLAY,
  PHONE_NUMBER,
  EMAIL,
  INSTAGRAM,
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

// Site settings live here now (static hosting, no admin backend). Edit and redeploy to change them.
export const DEFAULT_SETTINGS: SiteSettings = {
  drop: {
    enabled: true,
    drop_at: "2026-11-02T00:00:00-05:00",
    overline: "Soft Launch ★ Nov 2 – Dec 31, 2026",
    item_name: "",
    subtitle:
      "Our soft launch runs November 2 through December 31. Delivery only, around Stafford. Join the list and you'll get each week's menu first.",
    location_note: "Stafford, VA ★ Delivery only ★ Menu announced to the list first",
  },
  contact: {
    phone_display: PHONE_DISPLAY,
    phone_number: PHONE_NUMBER,
    email: EMAIL,
    instagram: INSTAGRAM,
    facebook: "",
    tiktok: "",
  },
};

export function useSettings() {
  return DEFAULT_SETTINGS;
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
