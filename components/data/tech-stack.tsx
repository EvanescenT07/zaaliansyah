import { TechStackType } from "@/types/data-types";
import Marquee from "react-fast-marquee";
import * as SiIcons from "react-icons/si";

export const TechStack = ({ data }: { data: TechStackType }) => {
  const row1 = data.filter((tech) => tech.category === 1);
  const row2 = data.filter((tech) => tech.category === 2);
  const row3 = data.filter((tech) => tech.category === 3);

  const renderIcon = (iconName: string) => {
    const IconComponent = (SiIcons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const renderMarquee = (
    techList: TechStackType,
    direction: "left" | "right",
  ) => (
    <Marquee
      pauseOnClick={true}
      speed={30}
      gradient={true}
      gradientColor="248, 251, 253"
      gradientWidth={100}
      direction={direction}
    >
      {techList.map((tech) => (
        <div
          key={tech.id}
          className="group w-30 h-30 bg-primary/10 backdrop-blur-md border border-transparent shadow-lg hover:shadow-2xl rounded-2xl flex flex-col items-center justify-center m-4 hover:scale-105 transition-transform duration-500"
        >
          <div className="text-5xl mb-3 text-foreground group-hover:text-primary">
            {renderIcon(tech.iconName)}
          </div>
          <div className="text-sm font-comfortaa text-foreground group-hover:text-primary font-semibold text-center">
            {tech.name}
          </div>
        </div>
      ))}
    </Marquee>
  );
  return (
    <section className="py-4" id="techstack">
      <div className="text-center mb-16">
        <h2 className="text-4xl xl:text-5xl font-bold text-comfortaa text-foreground mb-4">
          Tech Stack
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-ring mx-auto rounded-full" />
        <p className="text-lg text-foreground/70 mt-6 font-work-sans max-w-2xl mx-auto">
          Showcasing the technologies and tools that I have learned and used
        </p>
      </div>

      {/* Tech Rows */}
      <div className="flex flex-col space-y-2">
        {renderMarquee(row1, "right")}
        {renderMarquee(row2, "left")}
        {renderMarquee(row3, "right")}
      </div>
    </section>
  );
};
