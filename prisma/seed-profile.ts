import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

const connectionString = process.env.PRISMA_DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting Profile Seed...");

  await prisma.profile.deleteMany();

  // 1. Upload the profile photo to Blob
  const photoPath = path.join(process.cwd(), "public", "assets", "profile.png");
  const photoBuffer = fs.readFileSync(photoPath);
  const { url: photoBlobUrl } = await put("profile.png", photoBuffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  console.log(`✅ Uploaded photo to ${photoBlobUrl}`);

  // 2. Create the Database Record
  await prisma.profile.create({
    data: {
      cvUrl:
        "https://bah4c0frzrcszkxt.public.blob.vercel-storage.com/PDF/CV-eng-ver.pdf",
      photoUrl: photoBlobUrl,
      desktopText:
        "Recent Informatics graduate from President University with a passion for building impactful digital products. My interests span mobile development, full-stack development, machine learning, artificial intelligence, and software engineering. A fast learner with strong leadership, problem-solving, and creative thinking skills, I enjoy turning ideas into intuitive and meaningful digital experiences.",
      mobileText:
        "Recent Informatics graduate passionate about mobile development, AI, machine learning, and full-stack development. Fast learner, creative problem solver, and always excited to build meaningful digital experiences.",
    },
  });

  console.log(" Profile successfully seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
