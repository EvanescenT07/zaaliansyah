import Link from "next/link";
import { SocialMediaType } from "@/types/data-types";
import * as FaIcons from "react-icons/fa";

export const SocialMedia = ({ containerStyle, data }: SocialMediaType) => {
  const renderIcon = (iconName: string) => {
    const IconComponent = FaIcons[iconName as keyof typeof FaIcons];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <div className={containerStyle}>
      {data.map((item) => {
        return (
          <Link
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[50px] h-[50px] bg-background border border-transparent shadow-xl rounded-full flex items-center justify-center transition-all duration-500 hover:w-[140px] hover:bg-primary hover:shadow-xl hover:shadow-primary/20 group cursor-pointer"
          >
            {/* Icon */}
            <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0">
              <span className="text-xl text-foreground group-hover:text-primary-foreground">
                {renderIcon(item.iconName)}
              </span>
            </span>

            {/* Title */}
            <span className="absolute text-primary-foreground font-semibold text-sm font-work-sans transition-all duration-500 scale-0 group-hover:scale-100 delay-150 z-10">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
