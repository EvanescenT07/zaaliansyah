import { prisma } from "@/lib/prisma";
import { ContextCacheProps } from "@/types/chatbot-types";

const CACHE_TTL_MS = 10 * 60 * 1000;
let contextCache: ContextCacheProps | null = null;

/**
 * Serializes portfolio data into a compact text context.
 * Excludes non-conversational fields (logoUrl, imageUrl, etc.)
 * to minimize token usage.
 */
export function serializeContext(data: {
  profile: { desktopText: string } | null;
  academics: {
    degree: string;
    major: string;
    institution: string;
    year: string;
    location: string;
  }[];
  experiences: {
    position: string;
    company: string;
    division: string;
    period: string;
    location: string;
    status: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    githubUrl: string | null;
    liveUrl: string | null;
    techStacks: { name: string }[];
  }[];
  techStacks: { name: string }[];
  statuses: { title: string; count: number }[];
}): string {
  const academicText = data.academics
    .map(
      (a) =>
        `- ${a.degree} in ${a.major} @ ${a.institution} (${a.year}, ${a.location})`,
    )
    .join("\n");
  const experienceText = data.experiences
    .map(
      (e) =>
        `- ${e.position} @ ${e.company} (${e.division}) | ${e.period} | ${e.location} | ${e.status}\n  ${e.description}`,
    )
    .join("\n");
  const projectText = data.projects
    .map((p) => {
      const techs = p.techStacks.map((t) => t.name).join(", ");
      const links = [
        p.githubUrl && `GitHub: ${p.githubUrl}`,
        p.liveUrl && `Live: ${p.liveUrl}`,
      ]
        .filter(Boolean)
        .join(" | ");
      return `- ${p.title}: ${p.description}\n  Tech: ${techs}${links ? `\n  ${links}` : ""}`;
    })
    .join("\n");
  const techText = data.techStacks.map((t) => t.name).join(", ");
  const statusText = data.statuses
    .map((s) => `${s.title}: ${s.count}`)
    .join(" | ");
  return `
## Fikar's Portfolio — Source of Truth 
### About
${data.profile?.desktopText ?? "N/A"}
### Education
${academicText || "N/A"}
### Experience
${experienceText || "N/A"}
### Projects
${projectText || "N/A"}
### Tech Stack
${techText || "N/A"}
### Stats
${statusText || "N/A"}
`.trim();
}

export async function getPortfolioContext(): Promise<string> {
  const now = Date.now();

  if (contextCache && now - contextCache.builtAt < CACHE_TTL_MS) {
    return contextCache.content;
  }

  const [profile, academics, experiences, projects, techStacks, statuses] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.academic.findMany({ orderBy: { orderIndex: "asc" } }),
      prisma.experience.findMany({ orderBy: { orderIndex: "asc" } }),
      prisma.project.findMany({
        orderBy: { orderIndex: "asc" },
        include: { techStacks: true },
      }),
      prisma.techStack.findMany({ orderBy: { category: "asc" } }),
      prisma.status.findMany({ orderBy: { orderIndex: "asc" } }),
    ]);

  const content = serializeContext({
    profile,
    academics,
    experiences,
    projects,
    techStacks,
    statuses,
  });

  contextCache = {
    content,
    builtAt: now,
  };
  return content;
}
