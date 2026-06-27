export type Project = {
  slug: string;
  name: string;
  location: string;
  year: string;
  typology: string;
  area: string;
  status: string;
  blurb: string;
  cover: string;
  gallery: string[];
  /** Aspect ratio (w/h). Drives the masonry-style work grid. */
  aspect: number;
  /** Vertical offset column when laid out in the work grid (0 = no offset). */
  offsetRem?: number;
};

// Helper to construct a sized Unsplash CDN URL.
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projects: Project[] = [
  {
    slug: "lightwell-house",
    name: "Lightwell House",
    location: "Hyderabad, IN",
    year: "2024",
    typology: "Private Residence",
    area: "4,200 sq ft",
    status: "Completed",
    blurb:
      "A central void carries northern light into every floor, dissolving the boundary between corridor and courtyard.",
    cover: u("1600566753190-17f0baa2a6c3"),
    gallery: [
      u("1600566753190-17f0baa2a6c3"),
      u("1600585154340-be6161a56a0c"),
      u("1600210492486-724fe5c67fb0"),
    ],
    aspect: 4 / 5,
  },
  {
    slug: "kr-house",
    name: "KR House",
    location: "Bengaluru, IN",
    year: "2023",
    typology: "Family Home",
    area: "3,600 sq ft",
    status: "Completed",
    blurb:
      "A muted palette of lime plaster and oak frames daily life around a single, unhurried living volume.",
    cover: u("1600566753086-00f18fb6b3ea"),
    gallery: [
      u("1600566753086-00f18fb6b3ea"),
      u("1564013799919-ab600027ffc6"),
      u("1605276374104-dee2a0ed3cd6"),
    ],
    aspect: 3 / 4,
    offsetRem: 8,
  },
  {
    slug: "concrete-cabin-farmhouse",
    name: "Concrete Cabin Farmhouse",
    location: "Coorg, IN",
    year: "2024",
    typology: "Weekend Retreat",
    area: "2,800 sq ft",
    status: "Completed",
    blurb:
      "Board-formed concrete masses anchor a working farm, opening to the canopy through long, low apertures.",
    cover: u("1604014237800-1c9102c219da"),
    gallery: [
      u("1604014237800-1c9102c219da"),
      u("1600607687939-ce8a6c25118c"),
      u("1600596542815-ffad4c1539a9"),
    ],
    aspect: 5 / 6,
    offsetRem: 3,
  },
  {
    slug: "block-house",
    name: "Block House",
    location: "Chennai, IN",
    year: "2025",
    typology: "Urban Residence",
    area: "5,100 sq ft",
    status: "In progress",
    blurb:
      "Stacked masonry volumes negotiate a tight urban plot — every aperture earned, every threshold considered.",
    cover: u("1600573472556-e636c2acda88"),
    gallery: [
      u("1600573472556-e636c2acda88"),
      u("1613490493576-7fde63acd811"),
      u("1600210491892-03d54c0aaf87"),
    ],
    aspect: 4 / 5,
    offsetRem: 6,
  },
  // ---- Placeholder projects with stock photography ----
  // Swap the cover/gallery URLs for your own images when ready.
  {
    slug: "cliff-pavilion",
    name: "Cliff Pavilion",
    location: "Gokarna, IN",
    year: "2025",
    typology: "Coastal Retreat",
    area: "3,400 sq ft",
    status: "In progress",
    blurb:
      "A long, low pavilion held against the headland — its open frame folds the sea into every room.",
    cover: u("1600585154340-be6161a56a0c"),
    gallery: [u("1600585154340-be6161a56a0c"), u("1600210492486-724fe5c67fb0")],
    aspect: 4 / 5,
  },
  {
    slug: "forest-house",
    name: "Forest House",
    location: "Nilgiris, IN",
    year: "2024",
    typology: "Mountain Residence",
    area: "2,900 sq ft",
    status: "Completed",
    blurb:
      "A timber-clad form, raised above the slope, slipping quietly between the trees.",
    cover: u("1600596542815-ffad4c1539a9"),
    gallery: [u("1600596542815-ffad4c1539a9"), u("1605276374104-dee2a0ed3cd6")],
    aspect: 3 / 4,
    offsetRem: 10,
  },
  {
    slug: "atelier-no-7",
    name: "Atelier No. 7",
    location: "Pondicherry, IN",
    year: "2023",
    typology: "Studio & Residence",
    area: "2,200 sq ft",
    status: "Completed",
    blurb:
      "A live-work courtyard house — workshop, gallery, and quiet rooms folded around a single, planted courtyard.",
    cover: u("1600607687939-ce8a6c25118c"),
    gallery: [u("1600607687939-ce8a6c25118c"), u("1564013799919-ab600027ffc6")],
    aspect: 5 / 6,
    offsetRem: 4,
  },
  {
    slug: "courtyard-villa",
    name: "Courtyard Villa",
    location: "Goa, IN",
    year: "2024",
    typology: "Family Residence",
    area: "4,800 sq ft",
    status: "Completed",
    blurb:
      "A perimeter of solid masonry opens inward to a planted courtyard — the house turning its back on the street.",
    cover: u("1613490493576-7fde63acd811"),
    gallery: [u("1613490493576-7fde63acd811"), u("1600210491892-03d54c0aaf87")],
    aspect: 4 / 5,
    offsetRem: 7,
  },
];
