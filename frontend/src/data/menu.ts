export const IMG = {
  hero: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/0cd3c590003f5ece2d8cd69c779bfebf18c222b328fd36e443b6a1131567427b.jpeg",
  lumpia: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/c3e6613c998446d5e9ca77d539608c6a255e0db82902f03a9fd1903e253eb31d.jpeg",
  burger: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/0d0f5f3debae523ebea9be1e896e4ba2e4a25e88dda6884e106ba8f37d92ebd5.jpeg",
  melt: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/8883f3f3ecad494bd512b4a7dae256294c320d3b234942e45258738ff1813ae3.jpeg",
  turon: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/603dd3779e11b6fa3de6b74b43b73c6e645b162f4b9e8b160e5c03a6f0720e10.jpeg",
  cassava: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/989e175bdcaf3290fd9a8d8255d90e8ea57e7afd8275c5ca628154afcf0e5b8b.jpeg",
  skewers: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/ed911ae231ac25c3e272386157065031a027174984986a2e836e81dd15479940.jpeg",
  quesadilla: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/578b5c29c580053a9383b7ffa95e6c537aeb7bb558586bd830015e2add96fff8.jpeg",
  tacos: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/bdd13aa6403ef8e39330b34344b16d859156c84c6dd822a5a0bfc0e3158e96a6.jpeg",
  crowd: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/b93e7f45b39fa5d364865d17687be763dd0f3eb10714d26df358747f360d1873.jpeg",
  stickers: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/127debf81c996bac318d4296f26d7d939793712c0887c3de8e872ff45fa2871c.jpeg",
  griddle: "https://static.prod-images.emergentagent.com/jobs/8717fc1b-661d-4cbf-b079-5c3a13742e29/images/b3c4f7afa143031c5789a6d1c0dc88f348e72edb81f6bdbb8ac349d309b52887.jpeg",
};

export const PHONE_DISPLAY = "(415) 555-0199";
export const PHONE_TEL = "tel:+14155550199";
export const PHONE_SMS = "sms:+14155550199";
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

export const MENU: MenuCategory[] = [
  {
    id: "skewers",
    label: "Skewers & Tacos",
    blurb: "Open-flame char, street-corner soul.",
    items: [
      {
        id: "baboy-kabob",
        name: "Baboy Kabob",
        description: "Charred Visayan street-style pork skewers marinated in sweet soy, garlic, and citrus, then grilled over an open flame.",
        price: 9,
        heat: 2,
        tags: ["Grilled", "Gluten-Free"],
        image: IMG.skewers,
        badge: "Flame-Grilled",
      },
      {
        id: "adobo-tacos",
        name: "Chicken Adobo Tacos",
        description: "Shredded chicken slow-simmered in tangy soy, vinegar, and garlic. Served in warm tortillas with fresh cilantro and calamansi. No diced onions.",
        price: 11,
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
        price: 13,
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
        price: 12,
        heat: 1,
        tags: ["Sweet-Garlic"],
      },
      {
        id: "longaniza-melt",
        name: "Longaniza Melt",
        description: "Sweet, garlicky crumbled Filipino sausage and plenty of melted cheese inside a thick lumpia wrapper, griddle-steamed until soft and gooey, then finished with Fiesta Mestiza sauce.",
        price: 12,
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
        price: 11,
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
        description: "Golden-fried Filipino spring rolls filled with seasoned ground meat and vegetables. Served with sweet chili sauce.",
        price: 8,
        heat: 1,
        tags: ["Fan Favorite", "Classic"],
        image: IMG.lumpia,
        badge: "OG",
        favorite: true,
      },
      {
        id: "cheesesteak-lumpia",
        name: "Cheesesteak Lumpia",
        description: "Thinly sliced ribeye and melted cheese rolled tight and fried until crisp.",
        price: 10,
        heat: 1,
        tags: ["Ribeye"],
      },
      {
        id: "southeast-eggrolls",
        name: "Southeast Eggrolls",
        description: "Smoky slow-cooked pulled pork and crisp tangy coleslaw wrapped and fried.",
        price: 9,
        heat: 1,
        tags: ["Pulled Pork"],
      },
      {
        id: "turon-magic",
        name: "Turon Magic",
        description: "Sweet saba bananas and brown sugar fried until crisp and finished with warm bourbon-caramel drizzle.",
        price: 7,
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
        price: 8,
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
        description: "Chewy baked coconut-cassava cake infused with banana, pineapple, and warm spice flavors inspired by Southern Hummingbird cake.",
        price: 7,
        heat: 0,
        tags: ["Fan Favorite", "Gluten-Free"],
        image: IMG.cassava,
        badge: "South x SEA",
        favorite: true,
      },
      {
        id: "carrot-cheesecake",
        name: "Carrot Cheesecake",
        description: "Rich cheesecake layered over a moist, spiced carrot-cake crust.",
        price: 8,
        heat: 0,
        tags: ["Spiced"],
      },
    ],
  },
];

export const FAVORITES: MenuItem[] = MENU.flatMap((c) => c.items).filter((i) => i.favorite);

export const PACKAGES = [
  { id: "street-block", name: "Street Block Party", desc: "Skewers + lumpia spread for the whole block. Up to 50 guests.", price: "from $18/guest" },
  { id: "griddle-vip", name: "Griddle Master VIP", desc: "Live smash-burger griddle station + full lumpia lineup. Up to 120 guests.", price: "from $26/guest" },
  { id: "lumpia-tower", name: "Lumpia Tower Craze", desc: "A literal tower of lumpia + sweet bakes dessert bar. Any size crowd.", price: "from $14/guest" },
];
