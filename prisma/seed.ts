import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.PRISMA_DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting full data migration...");

  // 1. Clean up existing data
  await prisma.academic.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.status.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.socialMedia.deleteMany();

  // 2. Seed Academic Data
  await prisma.academic.createMany({
    data: [
      {
        institution: "President University",
        degree: "Bachelor Degree",
        major: "Informatics - AI Concentration",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Academic/_logopresuniv.png",
        year: "Sep 2022 - Aug 2025",
        location: "Jababeka, Cikarang Utara",
        orderIndex: 1,
      },
      {
        institution: "SMA Bintara Depok",
        degree: "High School Diploma",
        major: "Natural Science",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Academic/_logopresuniv.png",
        year: "Jun 2018 - Jun 2021",
        location: "Depok, Jawa Barat",
        orderIndex: 2,
      },
    ],
  });

  // 3. Seed Experience Data
  await prisma.experience.createMany({
    data: [
      {
        company: "PT AXA Mandiri Financial Services",
        position: "System Development",
        division: "System Development Division",
        period: "Nov 2025 - May 2026",
        location: "South Jakarta",
        status: "Internship",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Experience/_logoaxamandiri.png",
        companyUrl: "https://mypage.axa.co.id/",
        description:
          "As a System Development Intern (Mobile Flutter Developer) at AXA Mandiri, I contributed to the development and maintenance of cross-platform mobile applications for Android and iOS using Flutter. I was responsible for developing a major feature on the frontend, focusing on responsive UI and reliable performance. I implemented user interfaces by translating Figma designs into clean, reusable Flutter widgets through close collaboration with the UI/UX team, and integrated RESTful APIs by handling JSON data in coordination with backend developers to ensure smooth data flow. Throughout the development process, I followed clean coding practices, participated in code reviews, and was actively involved in the full development lifecycle, including daily stand-ups and regular progress checkpoints. I also used Git for version control to collaborate effectively with the team, manage code changes, and support an efficient development workflow.",
        orderIndex: 1,
      },
      {
        company: "PT Bank SMBC Indonesia Tbk",
        position: "System Administration Management Intern",
        division: "SAM Division",
        period: "Feb 2025 - Nov 2025",
        location: "South Jakarta",
        status: "Internship",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Experience/_logosmbci.png",
        companyUrl: "https://www.smbc.co.id/",
        description:
          "As a proactive member of an Agile team, I was deeply involved in the entire software development lifecycle, from sprint planning to final release. I played a key role in shaping our product's direction by authoring over 20 user stories and backlog items, which directly led to new feature releases. Working in close support of the Product Owner, I helped prioritize development efforts and ensured features aligned with user requirements by executing detailed User Acceptance Testing (UAT). To support the team's long-term success, I also developed more than 7 technical documents for internal applications and actively contributed to initiatives that improved our overall team culture and processes.",
        orderIndex: 2,
      },
      {
        company: "PT Berlian Sistem Informasi",
        position: "CX System Development Intern",
        division: "DMA Division",
        period: "Aug 2024 - Januari 2025",
        location: "East Jakarta",
        status: "Internship",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Experience/_logobsi.png",
        companyUrl: "https://www.bsi.co.id/",
        description:
          "As a CX System Development Intern, I contributed to key projects that improved data integrity and team efficiency. I helped establish a centralized Source of Truth database to reduce inconsistencies and played a significant role in developing a Docusaurus-based internal guidance system, using Azure DevOps with Git for team collaboration. By applying Agile practices, I directly contributed to the team achieving an 87% development efficiency rate. I also supported product quality by creating 15+ UAT scenarios, documenting insights from over 10 brainstorming sessions, and participating in 20+ cross-functional meetings to ensure stakeholder alignment",
        orderIndex: 3,
      },
      {
        company: "PUMA Informatics",
        position: "Vice Head of Communication & Design Division",
        division: "Design Division",
        period: "Dec 2023 - Dec 2024",
        location: "President University",
        status: "Organization",
        logoUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Experience/_logopuma.png",
        companyUrl: "https://www.instagram.com/itpresuniv/",
        description:
          "As Vice of the Design Division, I led and mentored a team of 3+ members, managing task delegation and deliverable reviews to consistently meet deadlines and quality standards. I established and maintained the organization's brand identity by designing the official PUMA logo and creating all visual content for social media, which improved channel consistency and visibility. My hands-on work also included producing print assets like the wall magazine and contributing to the full production of the company profile video, from storyboarding through post-production.",
        orderIndex: 4,
      },
    ],
  });

  // 4. Seed Status Data
  await prisma.status.createMany({
    data: [
      { title: "Grade Point Average", count: 3.77, orderIndex: 1 },
      { title: "Work Projects", count: 9, orderIndex: 2 },
      { title: "Technologies Used", count: 30, orderIndex: 3 },
      { title: "Code Commits", count: 162, orderIndex: 4 },
    ],
  });

  // 5. Seed Playlist Data
  await prisma.playlist.createMany({
    data: [
      {
        title: "[Lofi] Fly Me To The Moon",
        artist: "Frank Sinatra",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_Fly_Me_to_the_Moon.mp3",
        orderIndex: 1,
      },
      {
        title: "[Lofi] La Vie en Rose",
        artist: "Édith Piaf",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_La_Vie_en_rose.mp3",
        orderIndex: 2,
      },
      {
        title: "[Lofi] New Horizons",
        artist: "Animal Crossing",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_New_Horizons.mp3",
        orderIndex: 3,
      },
      {
        title: "[Lofi] Redbone",
        artist: "Childish Gambino",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_Redbone.mp3",
        orderIndex: 4,
      },
      {
        title: "[Lofi] The Girl i haven't met",
        artist: "Kudasaibeats",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_The_girl_i_havent_met.mp3",
        orderIndex: 5,
      },
      {
        title: "[Lofi] The Less I Know The Better",
        artist: "Tame Impala",
        audioUrl:
          "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Playlist/%5BLOFI%5D_The_Less_i_know_the_better.mp3",
        orderIndex: 6,
      },
    ],
  });

  // 6. Seed Social Media
  await prisma.socialMedia.createMany({
    data: [
      {
        name: "GitHub",
        url: process.env.NEXT_PUBLIC_GITHUB_PATH || "https://www.github.com",
        iconName: "FaGithub",
        orderIndex: 1,
      },
      {
        name: "LinkedIn",
        url:
          process.env.NEXT_PUBLIC_LINKEDIN_PATH || "https://www.linkedin.com",
        iconName: "FaLinkedinIn",
        orderIndex: 2,
      },
      {
        name: "Instagram",
        url:
          process.env.NEXT_PUBLIC_INSTAGRAM_PATH || "https://www.instagram.com",
        iconName: "FaInstagram",
        orderIndex: 3,
      },
      {
        name: "Spotify",
        url: process.env.NEXT_PUBLIC_SPOTIFY_PATH || "https://www.spotify.com",
        iconName: "FaSpotify",
        orderIndex: 4,
      },
    ],
  });

  // 7. Seed Tech Stack
  await prisma.techStack.createMany({
    data: [
      // Row 1
      { name: "Flutter", iconName: "SiFlutter", category: 1 },
      { name: "TypeScript", iconName: "SiTypescript", category: 1 },
      { name: "JavaScript", iconName: "SiJavascript", category: 1 },
      { name: "TailwindCSS", iconName: "SiTailwindcss", category: 1 },
      { name: "Next.JS", iconName: "SiNextdotjs", category: 1 }, // Used in Projects
      { name: "ReactJS", iconName: "SiReact", category: 1 },
      { name: "Laravel", iconName: "SiLaravel", category: 1 },
      { name: "ExpressJS", iconName: "SiExpress", category: 1 },
      { name: "PostgreSQL", iconName: "SiPostgresql", category: 1 }, // Used in Projects
      { name: "MySQL", iconName: "SiMysql", category: 1 }, // Used in Projects
      { name: "Node.js", iconName: "SiNodedotjs", category: 1 },
      { name: "Bun", iconName: "SiBun", category: 1 },

      // Row 2
      { name: "Python", iconName: "SiPython", category: 2 },
      { name: "Flask", iconName: "SiFlask", category: 2 }, // Used in Projects
      { name: "FastAPI", iconName: "SiFastapi", category: 2 }, // Used in Projects
      { name: "TensorFlow", iconName: "SiTensorflow", category: 2 },
      { name: "PyTorch", iconName: "SiPytorch", category: 2 },
      { name: "ONNX", iconName: "SiOnnx", category: 2 },
      { name: "OpenCV", iconName: "SiOpencv", category: 2 },
      { name: "Keras", iconName: "SiKeras", category: 2 },
      { name: "NumPy", iconName: "SiNumpy", category: 2 },
      { name: "Pandas", iconName: "SiPandas", category: 2 },
      { name: "Jupyter Notebook", iconName: "SiJupyter", category: 2 },
      { name: "OpenAI", iconName: "SiOpenai", category: 2 },
      { name: "Google Gemini", iconName: "SiGooglegemini", category: 2 },
      { name: "GitHub Copilot", iconName: "SiGithubcopilot", category: 2 },

      // Row 3
      { name: "Git", iconName: "SiGit", category: 3 },
      { name: "Figma", iconName: "SiFigma", category: 3 },
      { name: "Laragon", iconName: "SiLaragon", category: 3 },
      { name: "Docker", iconName: "SiDocker", category: 3 }, // Used in Projects
      { name: "Vercel", iconName: "SiVercel", category: 3 },
      { name: "Railway", iconName: "SiRailway", category: 3 },
      { name: "Ubuntu", iconName: "SiUbuntu", category: 3 },
      { name: "GitHub", iconName: "SiGithub", category: 3 },

      // Extra Technologies used purely in Projects but not on the Marquee (category 0)
      { name: "AdonisJS", iconName: "SiAdonisjs", category: 0 },
      {
        name: "IBM Granite",
        iconName: "GiArtificialIntelligence",
        category: 0,
      },
    ],
  });

  // 8. Seed Projects (With relations to Tech Stack)
  await prisma.project.create({
    data: {
      title: "Caffmed",
      description:
        "An innovative web application designed to assist in detecting brain tumors utilized machine learning by analyzing user-uploaded brain X-ray images. This project leverages the power of machine learning and integrates a floating AI-powered chatbot using the OpenAI API to enhance user interaction and support.",
      imageUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Project/Caffmed.png",
      imageAlt: "Portfolio Website Screenshot",
      githubUrl: "https://github.com/EvanescenT07/caffmed",
      liveUrl: "https://caffmed.vercel.app",
      orderIndex: 1,
      techStacks: {
        connect: [{ name: "Next.JS" }, { name: "Flask" }, { name: "Docker" }],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Caffmusic",
      description:
        "A web application that demonstrates machine learning capabilities for music genre classification. Built with Next.js and FastAPI, it uses a CNN model trained on the GTZAN dataset to classify audio files into 10 genres including Blues, Classical, Hip Hop, and Rock through real-time audio processing.",
      imageUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Project/Caffmusic.png",
      imageAlt: "Portfolio Website Screenshot",
      githubUrl: "https://github.com/EvanescenT07/caffmusic",
      liveUrl: "https://caffmusic.vercel.app",
      orderIndex: 2,
      techStacks: {
        connect: [
          { name: "Next.JS" },
          { name: "FastAPI" },
          { name: "PostgreSQL" },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Document Summarizer",
      description:
        "A Capstone project using the IBM Granite model. This application feature can summarize documents in docx and txt formats inputted by users.",
      imageUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Project/DocsSumm.png",
      imageAlt: "Portfolio Website Screenshot",
      githubUrl: "https://github.com/EvanescenT07/ibm-granite_summarization",
      liveUrl: "https://ibm-granite-summarization.vercel.app/",
      orderIndex: 3,
      techStacks: {
        connect: [
          { name: "Next.JS" },
          { name: "PostgreSQL" },
          { name: "IBM Granite" },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Warehouse Inventory Management System",
      description:
        "A Capstone project developed by a three-person as part of graduation requirements at President University, this Warehouse Inventory Management System leverages cutting-edge technology to streamline warehouse operations. It pairs a high-accuracy YOLOv11 object detection model for automated item identification with an integrated IoT framework consisting of a conveyor system , load cell sensors , and a QR code-based labeling mechanism. All data is monitored and managed through a responsive web dashboard , built to reduce human intervention and boost productivity.",
      imageUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/Project/WIMS.png",
      imageAlt: "WIMS",
      githubUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/PDF/WIMS.pdf",
      liveUrl: "https://capstone.yuel.web.id/",
      orderIndex: 4,
      techStacks: {
        connect: [{ name: "AdonisJS" }, { name: "FastAPI" }, { name: "MySQL" }],
      },
    },
  });

  console.log("Database successfully seeded with ALL local data! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
