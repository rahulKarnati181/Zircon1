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
};

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
    cover: "/assets/Lightwell House/Main.png",
    gallery: [
      "/assets/Lightwell House/Main.png",
      "/assets/Lightwell House/Indoor1.png",
      "/assets/Lightwell House/Indoor2.png",
    ],
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
    cover: "/assets/KR House/Main.png",
    gallery: [
      "/assets/KR House/Main.png",
      "/assets/KR House/Indoor1.png",
    ],
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
    cover: "/assets/Concrete Cabin Farmhouse/Main.png",
    gallery: [
      "/assets/Concrete Cabin Farmhouse/Main.png",
      "/assets/Concrete Cabin Farmhouse/Outdoor.png",
    ],
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
    cover: "/assets/Block House/Main.png",
    gallery: [
      "/assets/Block House/Main.png",
      "/assets/Block House/Indoor1.png",
    ],
  },
];
