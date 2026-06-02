import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import { PrismaClient } from "@generated";;
import anyAscii from "any-ascii";

function generateSlug(text: string): string {
  return anyAscii(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}


const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Human Care Hero data...");
// --- Seed Hero Content ---
await prisma.heroContent.upsert({
  where: { id: "singleton" }, // Change from "hero-main" to "singleton"
  update: {},
  create: {
    id: "singleton", // Change from "hero-main" to "singleton"
    badgeText: "Since 2010 • Making Impact in Bangladesh",
    headline: "Humanity is Better Than Responsibility",
    description: "We believe in compassion over obligation...",
    livesImpacted: "50K+",
    projectsCount: "120+",
    yearsActive: "15+",
    donateLink: "https://qrinux.com/",
    images: [
      "https://ik.imagekit.io/0hkqv3jnd/hero/hero1_5ce-vIS7K.jpg",
      "https://ik.imagekit.io/0hkqv3jnd/hero/hero2_xrY7W13sn.jpg",
      "https://ik.imagekit.io/0hkqv3jnd/hero/hero3_Jkv4ysata.jpg",
      "https://ik.imagekit.io/0hkqv3jnd/hero/hero4_6pjBi-DiD.jpg",
      "https://ik.imagekit.io/0hkqv3jnd/hero/hero5_OoKPzxLwZ.jpg",
    ],
  },
});

  // --- Seed Projects ---

  const projects = [
    {
    slug: 'clean-water-initiative',
    title: 'Clean Water Initiative',
    location: 'Dhaka & Chittagong',
    description: 'Installing water purification systems and building wells to provide clean drinking water to 10,000 families in rural areas.',
    image: 'https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwcHJvamVjdCUyMGRldmVsb3BpbmclMjBjb3VudHJ5fGVufDF8fHx8MTc3MTk1ODQ4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 78,
    beneficiaries: '8,500+',
    timeline: '2024-2026',
    fullDescription: 'Access to clean water is a fundamental human right, yet thousands of families in rural Bangladesh still struggle with waterborne diseases. Our Clean Water Initiative addresses this critical need through a comprehensive approach that combines modern technology with community engagement. We install advanced water purification systems and construct deep tube wells in areas where groundwater contamination is a serious concern.',
    objectives: [
      'Install 50 water purification systems',
      'Build 100 deep tube wells',
      'Train local committees',
      'Provide hygiene education',
    ],
    impact: [
      '8,500 families supported',
      '60% disease reduction',
      '40 women trained',
      '25 villages self-managed',
    ],
  },

  {
    slug: 'education-for-all',
    title: 'Education for All',
    location: 'Sylhet & Rajshahi',
    description: 'Building 15 new schools and providing educational materials, teacher training, and scholarships to underprivileged children.',
    image: 'https://images.unsplash.com/photo-1764645362980-08d8704fd102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGNsYXNzcm9vbSUyMGRldmVsb3BpbmclMjBjb3VudHJ5fGVufDF8fHx8MTc3MTk1ODQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 65,
    beneficiaries: '12,000+',
    timeline: '2023-2025',
    fullDescription: 'Beyond infrastructure, we invest heavily in teacher training and provide comprehensive scholarships to ensure no child is left behind due to financial constraints.',
    objectives: [
      'Construct schools',
      'Train teachers',
      'Provide scholarships',
      'Digital centers',
    ],
    impact: [
      '12,000 students enrolled',
      '85% literacy improvement',
      '250 teachers certified',
      '15 communities benefited',
    ],
  },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  //seed notices
  await prisma.notice.createMany({
  data: [
    {
      slug: "emergency-flood-relief",
      date: new Date('2026-07-20'),
      title: "Emergency Flood Relief Distribution Completed",
      description:
        "Successfully distributed emergency supplies to 5,000 families affected by recent floods in Sylhet district.",
      excerpt:
        "Our emergency response team worked around the clock to provide essential supplies including food, water, medicines, and temporary shelter materials to flood-affected families.",
      content:
        "Our emergency response team successfully completed the distribution of relief supplies to 5,000 families affected by the recent floods in Sylhet district.",
      type: "urgent",
      latest: true,
      image:
        "https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e",
    },
    {
      slug: "new-school-rajshahi",
      date: new Date('2026-04-20'),
      title: "New School Building Inaugurated in Rajshahi",
      description:
        "Our 15th educational institution opened its doors to 300 students.",
      excerpt:
        "This modern school building features 12 well-equipped classrooms.",
      content:
        "We are proud to announce the inauguration of our 15th educational institution in Rajshahi district.",
      type: "success",
      latest: true,
      image:
        "https://images.unsplash.com/photo-1764645362980-08d8704fd102",
    },
    {
      slug: "mobile-health-clinic",
      date: new Date('2026-02-20'),
      title: "Mobile Health Clinic Reaches Remote Villages",
      description:
        "Medical team provided free check-ups and medications to over 800 people.",
      excerpt:
        "Our mobile health clinic successfully completed a week-long medical camp.",
      content:
        "Our mobile health clinic completed a week-long medical camp in Bandarban.",
      type: "notice",
      latest: false,
      image:
        "https://images.unsplash.com/photo-1706806595099-f07588729caf",
    }
  ],
  skipDuplicates: true,
});
//seed team
const teamMembers = [
  {
    slug: "dr-nusrat-rahman",
    name: "Dr. Nusrat Rahman",
    role: "Founder & Executive Director",
    bio: "Project management expert overseeing field operations with a 95% project success rate.",
    expertise: "Public Health, Humanitarian Leadership, Community Development",
    image: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    email: "nusrat@humancare.org",
    linkedin: "https://linkedin.com/in/nusrat-rahman",
    education: [
      "Doctor of Medicine (MD) - Dhaka Medical College",
      "Master of Public Health (MPH) - Johns Hopkins University, USA",
      "Certificate in Humanitarian Leadership - Harvard University"
    ],
    achievements: [
      "Founded Human Care in 2010",
      "National NGO Excellence Award 2023",
      "Expanded operations to 12 districts across Bangladesh",
      "Served over 50,000 beneficiaries",
      "Published 15+ research papers on community health"
    ],
    experience: [
      "2010-Present: Founder & Executive Director, Human Care",
      "2007-2010: Program Manager, BRAC Health Program",
      "2005-2007: Field Coordinator, Doctors Without Borders",
      "2003-2005: Medical Officer, Government of Bangladesh"
    ]
  },
  {
    slug: "fahim-ahmed",
    name: "Fahim Ahmed",
    role: "Director of Operations",
    bio: "Project management expert overseeing field operations with a 95% project success rate.",
    expertise: "Project Management, Operations, Sustainable Development",
    image: "https://images.unsplash.com/photo-1709785980187-5504ce6b7d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    email: "fahim@humancare.org",
    linkedin: "https://linkedin.com/in/fahim-ahmed",
    education: [
      "B.Sc. in Civil Engineering - BUET",
      "Master in Development Studies - University of Dhaka",
      "Project Management Professional (PMP) Certification"
    ],
    achievements: [
      "Successfully managed 50+ development projects",
      "Implemented operations in 12 districts",
      "Trained over 200 field staff and volunteers",
      "Achieved 95% project success rate",
      "Developed standardized operational protocols"
    ],
    experience: [
      "2018-Present: Director of Operations, Human Care",
      "2013-2018: Senior Project Manager, Human Care",
      "2011-2013: Infrastructure Coordinator, Care Bangladesh",
      "2009-2011: Civil Engineer, Private Sector"
    ]
  }
];

for (const member of teamMembers) {
  await prisma.team.upsert({
    where: { slug: member.slug },
    update: {}, 
    create: member
  });
}
//seed gallery
const galleryItems = [
  {
    title: 'New School in Rajshahi',
    category: 'education',
    url: 'https://images.unsplash.com/photo-1764645362980-08d8704fd102?q=80&w=1080',
    date: new Date('2026-02-15'),
    description: 'Students in our newly built classroom facility',
  },
  {
    title: 'Mobile Health Clinic',
    category: 'healthcare',
    url: 'https://images.unsplash.com/photo-1706806595099-f07588729caf?q=80&w=1080',
    date: new Date('2026-02-10'),
    description: 'Medical team serving remote villages',
  },
  {
    title: 'Water Purification System',
    category: 'water',
    url: 'https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?q=80&w=1080',
    date: new Date('2026-01-25'),
    description: 'Installing clean water systems',
  },
  {
    title: 'Flood Relief Distribution',
    category: 'emergency',
    url: 'https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?q=80&w=1080',
    date: new Date('2026-02-05'),
    description: 'Emergency supplies for affected families',
  },
  {
    title: 'Women Empowerment',
    category: 'community',
    url: 'https://images.unsplash.com/photo-1759738099669-d64b0656f6cf?q=80&w=1080',
    date: new Date('2026-01-12'),
    description: 'Vocational training workshop',
  }
];

for (const item of galleryItems) {
  const slug = generateSlug(item.title);
  const categorySlug = generateSlug(item.category);

  await prisma.galleryItem.upsert({
    where: { url: item.url },
    update: { ...item, slug, categorySlug },
    create: { ...item, slug, categorySlug },
  });
}
console.log("✅ Database seeded successfully!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });