export interface Project {
  id: string
  name: string
  description: string
  category?: string
  images?: string[]
  budget: string
  year?: string
  location?: string
}

const projects: Project[] = [
  {
    id: "proj-1",
    name: "Modern Penthouse",
    description: "A contemporary penthouse with clean lines, natural materials, and panoramic city views.",
    category: "Residential",
    images: [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    budget: "$180,000 - $240,000",
    year: "2025",
    location: "New York, NY",
  },
  {
    id: "proj-2",
    name: "Executive Office Suite",
    description: "Thoughtfully designed commercial interior that balances brand identity with productivity.",
    category: "Commercial",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1200&q=80",
    ],
    budget: "$120,000 - $175,000",
    year: "2024",
    location: "San Francisco, CA",
  },
  {
    id: "proj-3",
    name: "Luxury Villa",
    description: "A high-end villa project emphasizing craftsmanship, bespoke furnishings, and timeless elegance.",
    category: "Residential",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    budget: "$350,000 - $500,000",
    year: "2023",
    location: "Miami, FL",
  },
  {
    id: "proj-4",
    name: "Boutique Hotel Lobby",
    description: "A welcoming hospitality interior pairing tactile finishes, sculptural lighting, and a sense of arrival for every guest.",
    category: "Hospitality",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    ],
    budget: "$275,000 - $400,000",
    year: "2025",
    location: "Charleston, SC",
  },
]

export function getAllProjects() {
  return projects
}

export function getProjectById(id: string) {
  return projects.find((p) => p.id === id) || null
}

export function getRelatedProjects(category?: string, excludeId?: string) {
  return projects.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4)
}

export default projects
