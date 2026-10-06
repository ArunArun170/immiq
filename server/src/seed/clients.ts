import Client from "../models/Client";

const clients = [
  {
    name: "Kovai TexTech Pvt Ltd",
    industry: "Manufacturing",
    description:
      "Technology solutions and digital transformation support for a modern manufacturing business.",
    projectType: "Digital Transformation",
    location: "Coimbatore, Tamil Nadu",
    featured: true,
  },
  {
    name: "GreenLeaf Agro Solutions",
    industry: "Agritech",
    description:
      "Digital technology solutions designed to improve agricultural operations and business visibility.",
    projectType: "Web Platform",
    location: "Tamil Nadu, India",
    featured: true,
  },
  {
    name: "BrightPath College of Engineering",
    industry: "Education",
    description:
      "Technology-focused learning and training initiatives for students and academic teams.",
    projectType: "Corporate & Campus Training",
    location: "Coimbatore, Tamil Nadu",
    featured: true,
  },
  {
    name: "NorthStar Logistics",
    industry: "Logistics",
    description:
      "Software and data-driven solutions for improving logistics workflows and operational visibility.",
    projectType: "SaaS Development",
    location: "Chennai, Tamil Nadu",
    featured: false,
  },
  {
    name: "MediCore Clinics",
    industry: "Healthcare",
    description:
      "Digital experiences and technology solutions for modern healthcare operations.",
    projectType: "Digital Services",
    location: "Tamil Nadu, India",
    featured: false,
  },
  {
    name: "UrbanCart Retail",
    industry: "Retail",
    description:
      "Customer-focused digital solutions designed for modern retail businesses.",
    projectType: "Web & SaaS Development",
    location: "Coimbatore, Tamil Nadu",
    featured: false,
  },
  {
    name: "PixelForge Studio",
    industry: "Media",
    description:
      "Creative technology and digital experiences combining design, development and emerging technology.",
    projectType: "Digital Experience",
    location: "Coimbatore, Tamil Nadu",
    featured: false,
  },
  {
    name: "Sundaram Auto Components",
    industry: "Automotive",
    description:
      "Technology solutions supporting operational efficiency and digital transformation.",
    projectType: "Enterprise Technology",
    location: "Tamil Nadu, India",
    featured: false,
  },
  {
    name: "FinEdge Capital",
    industry: "Finance",
    description:
      "Secure and scalable digital solutions for financial business workflows.",
    projectType: "Software Development",
    location: "India",
    featured: false,
  },
  {
    name: "Orbit Startups Hub",
    industry: "Startup",
    description:
      "Technology strategy, product development and innovation support for startup teams.",
    projectType: "Product Development",
    location: "Coimbatore, Tamil Nadu",
    featured: true,
  },
];

export const seedClients = async (): Promise<void> => {
  await Client.deleteMany({});
  await Client.insertMany(clients);

  console.log(`✅ Seeded ${clients.length} clients`);
};