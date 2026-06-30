import ClientWrapper from "@/components/overlay/client-wrapper";
import { Footer } from "@/components/ui/footer";
import { Greeting } from "@/components/ui/greeting";
import { Hero } from "@/components/ui/hero";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [
    profile,
    academics,
    experiences,
    project,
    techStacks,
    statuses,
    socials,
  ] = await Promise.all([
    prisma.profile.findFirstOrThrow(),

    prisma.academic.findMany({
      orderBy: { orderIndex: "asc" },
    }),
    prisma.experience.findMany({
      orderBy: {
        orderIndex: "asc",
      },
    }),
    prisma.project.findMany({
      orderBy: { orderIndex: "asc" },
      include: { techStacks: true },
    }),
    prisma.techStack.findMany({ orderBy: { category: "asc" } }),
    prisma.status.findMany({ orderBy: { orderIndex: "asc" } }),
    prisma.socialMedia.findMany({ orderBy: { orderIndex: "asc" } }),
  ]);

  return (
    <ClientWrapper>
      {/* Greeting */}
      <section>
        <Greeting />
      </section>

      {/* Overlay */}
      <div className="h-screen"></div>

      {/* Main Content */}
      <section id="home" className="px-4 xl:px-8 scroll-mt-8">
        <Hero
          profile={profile}
          academics={academics}
          experiences={experiences}
          projects={project}
          techStacks={techStacks}
          statuses={statuses}
          socials={socials}
        />
      </section>

      {/* Footer */}
      <section className="px-4 xl:px-8">
        <Footer />
      </section>
    </ClientWrapper>
  );
}
