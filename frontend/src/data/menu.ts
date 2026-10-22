export const IMG = {
  hero: "/images/hero.jpeg",
  lumpia: "/images/lumpia.jpeg",
  burger: "/images/burger.jpeg",
  melt: "/images/melt.jpeg",
  turon: "/images/turon.jpeg",
  cassava: "/images/cassava.jpeg",
  skewers: "/images/skewers.jpeg",
  quesadilla: "/images/quesadilla.jpeg",
  tacos: "/images/tacos.jpeg",
  crowd: "/images/crowd.jpeg",
  stickers: "/images/stickers.jpeg",
  griddle: "/images/griddle.jpeg",
};

export const PHONE_DISPLAY = "826-272-5555";
export const PHONE_NUMBER = "+18262725555";
export const PHONE_TEL = "tel:+18262725555";
export const PHONE_SMS = "sms:+18262725555";
export const EMAIL = "eats@kayomestiza.com";
export const INSTAGRAM = "https://instagram.com/kayomestiza";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  heat: 0 | 1 | 2 | 3;
  tags: string[];
  image?: string;
  badge?: string;
  favorite?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  blurb: string;
  items: MenuItem[];
}

export const fmtPrice = (n: number) => `$${n.toFixed(2)}`;

export const MENU: MenuCategory[] = [
  {
    id: "combos",
    label: "Combos & Flights",
    blurb: "Build-your-box bundles. Suggested pairings, bundle-priced.",
    items: [
      {
        id: "kayo-box",
        name: "The Kayo Box",
        description: "Any Griddle item — PB&J Smash, Tocino Smash, Longaniza Melt, or Oh Manok Asul Quesadilla — plus 2 pieces of Traditional Lumpia. Our signature combo.",
        price: 13,
        heat: 2,
        tags: ["Signature", "Meal Combo"],
        image: IMG.melt,
        badge: "The Signature",
      },
      {
        id: "street-walk",
        name: "The Street Walk",
        description: "2 Baboy Kabobs + 2 Chicken Adobo Tacos. Completely utensil-free and built to carry around a concert, festival, or street fair.",
        price: 14,
        heat: 2,
        tags: ["Utensil-Free", "Festival Ready"],
        image: IMG.skewers,
        badge: "Meal Combo",
      },
      {
        id: "soul-roll-flight",
        name: "The Soul-Roll Flight",
        description: "1 Cheesesteak Lumpia + 1 Southeast Eggroll + 2 Traditional Lumpia. The full fusion-roll range on one plate — perfect for sharing.",
        price: 12,
        heat: 1,
        tags: ["Sharing", "Tasting Flight"],
        image: IMG.lumpia,
        badge: "Built to Share",
      },
      {
        id: "blasian-feast",
        name: "The Blasian Feast",
        description: "Any 2 Griddle items + The Soul-Roll Flight. Split the heavy hitters — no guesswork. Built for two.",
        price: 28,
        heat: 2,
        tags: ["For Two", "Feast"],
        image: IMG.burger,
        badge: "For Two",
      },
      {
        id: "encore-basket",
        name: "The Encore Basket",
        description: "An order of Turon Magic + your choice of Sweet Mango Cream Cheese Lumpia or a slice of Hummingbird Cassava Cake. Hot-and-crispy meets baked comfort.",
        price: 10,
        heat: 0,
        tags: ["Dessert", "Sharing"],
        image: IMG.turon,
        badge: "Sweet Finish",
      },
    ],
  },
  {
    id: "skewers",
    label: "Skewers & Tacos",
    blurb: "Open-flame char, street-corner soul.",
    items: [
      {
        id: "baboy-kabob",
        name: "Baboy Kabob",
        description: "Charred Visayan street-style pork skewer marinated in sweet soy, garlic, and citrus, then grilled over an open flame. Priced per skewer.",
        price: 4,
        heat: 2,
        tags: ["Grilled", "Gluten-Free"],
        image: IMG.skewers,
        badge: "Flame-Grilled",
      },
      {
        id: "adobo-tacos",
        name: "Chicken Adobo Tacos",
        description: "Shredded chicken slow-simmered in tangy soy, vinegar, and garlic. Served in a warm tortilla with fresh cilantro and calamansi. No diced onions. Priced per taco.",
        price: 4,
        heat: 1,
        tags: ["Slow-Simmered"],
        image: IMG.tacos,
      },
    ],
  },
  {
    id: "griddle",
    label: "From the Griddle",
    blurb: "Smashed thin. Crispy edges. Zero mercy.",
    items: [
      {
        id: "pbj-smash",
        name: "PB&J Smash Burger",
        description: "Crispy-edged beef patties smashed with sweet mango-berry jam and creamy peanut butter.",
        price: 11,
        heat: 1,
        tags: ["Fan Favorite", "Sweet-Savory"],
        image: IMG.burger,
        badge: "Cult Classic",
        favorite: true,
      },
      {
        id: "tocino-smash",
        name: "Tocino Smash",
        description: "Crispy, sweet, garlicky ground pork patties seasoned like Filipino tocino, smashed thin on the griddle and topped with melted cheese on a toasted bun.",
        price: 10,
        heat: 1,
        tags: ["Sweet-Garlic"],
      },
      {
        id: "longaniza-melt",
        name: "Longaniza Melt",
        description: "Sweet, garlicky crumbled Filipino sausage and plenty of melted cheese inside a thick lumpia wrapper, griddle-steamed until soft and gooey, then finished with Fiesta Mestiza sauce.",
        price: 10,
        heat: 2,
        tags: ["Fan Favorite", "Gooey"],
        image: IMG.melt,
        badge: "Griddle King",
        favorite: true,
      },
      {
        id: "oh-manok",
        name: "\u201COh Manok\u201D Asul Quesadilla",
        description: "Savory pulled chicken and sharp melting blue cheese inside a thick, multi-layered lumpia wrapper, grilled until crisp.",
        price: 9,
        heat: 1,
        tags: ["Blue Cheese"],
        image: IMG.quesadilla,
      },
    ],
  },
  {
    id: "lumpia",
    label: "The Lumpia Lineup",
    blurb: "Traditional & twisted. Rolled tight, fried loud.",
    items: [
      {
        id: "traditional-lumpia",
        name: "Traditional Lumpia",
        description: "Golden-fried Filipino spring rolls filled with seasoned ground meat and vegetables. Served with sweet chili sauce. 2 pieces.",
        price: 4.5,
        heat: 1,
        tags: ["Fan Favorite", "Classic"],
        image: IMG.lumpia,
        badge: "OG",
        favorite: true,
      },
      {
        id: "cheesesteak-lumpia",
        name: "Cheesesteak Lumpia",
        description: "Thinly sliced ribeye and melted cheese rolled tight and fried until crisp. Priced per roll.",
        price: 4.5,
        heat: 1,
        tags: ["Ribeye"],
      },
      {
        id: "southeast-eggrolls",
        name: "Southeast Eggrolls",
        description: "Smoky slow-cooked pulled pork and crisp tangy coleslaw wrapped and fried. Priced per roll.",
        price: 4.5,
        heat: 1,
        tags: ["Pulled Pork"],
      },
      {
        id: "turon-magic",
        name: "Turon Magic",
        description: "Sweet saba bananas and brown sugar fried until crisp and finished with warm bourbon-caramel drizzle.",
        price: 6,
        heat: 0,
        tags: ["Fan Favorite", "Dessert", "Vegan-Friendly"],
        image: IMG.turon,
        badge: "Sweet Heat",
        favorite: true,
      },
      {
        id: "mango-cream-cheese",
        name: "Sweet Mango Cream Cheese Lumpia",
        description: "Cream cheese and mango jam wrapped and fried, finished with powdered sugar. Seasonal option: blueberry fruit compote.",
        price: 5.5,
        heat: 0,
        tags: ["Dessert", "Seasonal Option"],
      },
    ],
  },
  {
    id: "sweet",
    label: "Sweet Bakes",
    blurb: "Low-and-slow desserts with island soul.",
    items: [
      {
        id: "cassava-cake",
        name: "Hummingbird Cassava Cake",
        description: "Chewy baked coconut-cassava cake infused with banana, pineapple, and warm spice flavors inspired by Southern Hummingbird cake. Per slice.",
        price: 5.5,
        heat: 0,
        tags: ["Fan Favorite", "Gluten-Free"],
        image: IMG.cassava,
        badge: "South x SEA",
        favorite: true,
      },
      {
        id: "carrot-cheesecake",
        name: "Carrot Cheesecake",
        description: "Rich cheesecake layered over a moist, spiced carrot-cake crust. Per slice.",
        price: 6,
        heat: 0,
        tags: ["Spiced"],
      },
    ],
  },
];

export const FAVORITES: MenuItem[] = MENU.flatMap((c) => c.items).filter((i) => i.favorite);

export const PACKAGES = [
  { id: "private-event", name: "Private Events", desc: "Birthdays, weddings, backyard parties — we roll up and serve your crowd from the window.", price: "Quoted per event" },
  { id: "office-popup", name: "Office & Community Pop-Ups", desc: "Lunch drops for workplaces, churches, schools and neighborhood blocks.", price: "Quoted per event" },
  { id: "market-vendor", name: "Markets, Festivals & Vendor Spots", desc: "Booking the truck as a food vendor for your market or festival? Send the details.", price: "Quoted per event" },
];
