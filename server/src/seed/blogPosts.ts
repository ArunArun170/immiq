import BlogPost from "../models/BlogPost";

const blogPosts = [
  {
    title: "Why curiosity should come before technology",
    slug: "why-curiosity-should-come-before-technology",
    excerpt:
      "Technology becomes more meaningful when curiosity drives the learning process.",
    content:
      "At IMMIQ, we believe meaningful technology learning starts with curiosity. Instead of beginning with a rigid syllabus, we encourage people to explore questions, experiment with technology and build real solutions.",
    category: "Technology",
    author: "IMMIQ Team",
    readTime: 5,
    featured: true,
    published: true,
    publishedAt: new Date("2026-09-25"),
    tags: ["Curiosity", "Learning", "Technology"],
  },
  {
    title: "What is Spatial Computing?",
    slug: "what-is-spatial-computing",
    excerpt:
      "A practical introduction to spatial computing and why it matters for the next generation of digital experiences.",
    content:
      "Spatial computing brings digital information into the physical world through technologies such as augmented reality, virtual reality, mixed reality and advanced computer vision.",
    category: "Emerging Tech",
    author: "IMMIQ Lab",
    readTime: 7,
    featured: true,
    published: true,
    publishedAt: new Date("2026-09-18"),
    tags: ["Spatial Computing", "AR", "VR", "XR"],
  },
  {
    title: "From idea to SaaS product",
    slug: "from-idea-to-saas-product",
    excerpt:
      "The journey from a business idea to a scalable SaaS product requires more than coding.",
    content:
      "Successful SaaS products combine research, product thinking, design, engineering, data and continuous improvement.",
    category: "SaaS",
    author: "IMMIQ Team",
    readTime: 6,
    featured: false,
    published: true,
    publishedAt: new Date("2026-09-10"),
    tags: ["SaaS", "Product Development", "Software"],
  },
  {
    title: "AI is changing how teams build software",
    slug: "ai-is-changing-how-teams-build-software",
    excerpt:
      "AI-assisted development is changing the way modern software teams think, build and iterate.",
    content:
      "AI can accelerate research, coding, testing, documentation and analysis, but strong engineering judgement remains essential.",
    category: "AI",
    author: "IMMIQ Lab",
    readTime: 6,
    featured: false,
    published: true,
    publishedAt: new Date("2026-09-03"),
    tags: ["AI", "Software Engineering", "Automation"],
  },
  {
    title: "Building technology with depth",
    slug: "building-technology-with-depth",
    excerpt:
      "Simple interfaces can hide deep engineering, thoughtful architecture and strong product decisions.",
    content:
      "At IMMIQ, we look beyond surface-level implementation and focus on building technology with depth, scalability and meaningful user outcomes.",
    category: "Engineering",
    author: "IMMIQ Team",
    readTime: 5,
    featured: false,
    published: true,
    publishedAt: new Date("2026-08-27"),
    tags: ["Engineering", "Architecture", "Product"],
  },
  {
    title: "Why businesses need technology partners",
    slug: "why-businesses-need-technology-partners",
    excerpt:
      "Digital transformation becomes easier when strategy, design and engineering work together.",
    content:
      "Businesses increasingly need technology partners who can understand the problem, design the right solution and continuously improve the product.",
    category: "Business",
    author: "IMMIQ Team",
    readTime: 5,
    featured: false,
    published: true,
    publishedAt: new Date("2026-08-20"),
    tags: ["Business", "Digital Transformation"],
  },
  {
    title: "The future of technology learning",
    slug: "the-future-of-technology-learning",
    excerpt:
      "Technology education is moving towards project-based, interest-driven and AI-assisted learning.",
    content:
      "The future of technology learning will combine curiosity, experimentation, real projects and intelligent tools that help learners move faster.",
    category: "Training",
    author: "IMMIQ Academy",
    readTime: 6,
    featured: false,
    published: true,
    publishedAt: new Date("2026-08-12"),
    tags: ["Training", "Learning", "AI"],
  },
  {
    title: "Exploring the next technology wave",
    slug: "exploring-the-next-technology-wave",
    excerpt:
      "From AI to spatial computing, emerging technologies are opening new possibilities.",
    content:
      "Technology is continuously evolving. The IMMIQ Emerging Tech Lab focuses on exploring, experimenting with and validating technologies that could shape future products and businesses.",
    category: "Emerging Tech",
    author: "IMMIQ Lab",
    readTime: 6,
    featured: false,
    published: true,
    publishedAt: new Date("2026-08-05"),
    tags: ["Emerging Tech", "Innovation", "Future"],
  },
];

export const seedBlogPosts = async (): Promise<void> => {
  await BlogPost.deleteMany({});
  await BlogPost.insertMany(blogPosts);

  console.log(`✅ Seeded ${blogPosts.length} blog posts`);
};