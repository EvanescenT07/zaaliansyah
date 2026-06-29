"use client";

import { ProjectWithTechType } from "@/types/data-types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsArrowRight, BsGithub } from "react-icons/bs";
import WorkSliderButton from "@/components/ui/workslider";
import * as SiIcons from "react-icons/si";
import * as GiIcons from "react-icons/gi";

export const Project = ({ data }: { data: ProjectWithTechType[] }) => {
  const [isProject, setIsProject] = useState(data[0]);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsProject(data[swiper.realIndex]);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent =
      (SiIcons as any)[iconName] || (GiIcons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <section id="projects" className="h-full w-full py-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl xl:text-5xl font-bold font-comfortaa text-foreground mb-4">
            Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-ring mx-auto rounded-full" />
          <p className="text-lg text-foreground/70 mt-6 font-work-sans max-w-2xl mx-auto">
            A collection of my latest work and developments.
          </p>
        </div>

        {/* Project Content - Following Hero Layout */}
        <div className="flex flex-col xl:flex-row items-center justify-between">
          {/* Left Content - Project Details */}
          <div className="w-full xl:w-[50%] text-center xl:text-left order-2 xl:order-none">
            <div className="flex flex-col gap-[20px] px-5 group">
              {/* Project Number */}
              <div className="text-8xl leading-none font-extrabold text-foreground font-work-sans transition-all duration-500">
                {String(isProject.orderIndex).padStart(2, "0")}
              </div>

              {/* Project Title */}
              <h2 className="text-2xl xl:text-4xl font-bold leading-tight hover:text-primary transition-all duration-500 capitalize font-comfortaa text-foreground">
                {isProject.title}
              </h2>

              {/* Project Description */}
              <p className="text-sm xl:text-base text-center text-foreground font-work-sans  xl:max-w-[600px] leading-relaxed md:text-justify">
                {isProject.description}
              </p>

              {/* Tech Stack */}
              <div className="flex gap-4 justify-center xl:justify-start">
                {isProject.techStacks.map((tech) => (
                  <div key={tech.name}>
                    <TooltipProvider key={tech.id} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="text-2xl hover:text-primary transition-all duration-500">
                            {renderIcon(tech.iconName)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-secondary font-bold text-md font-work-sans">
                            {tech.name}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center xl:justify-start">
                {isProject.liveUrl && (
                  <Link
                    href={isProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger className="w-[48px] h-[48px] rounded-full bg-primary/20 hover:bg-primary/30 flex justify-center items-center group transition-all duration-500 hover:scale-110">
                          <BsArrowRight className="text-xl text-foreground transition-all duration-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-secondary font-sm font-bold font-work-sans">
                            Demo
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                )}

                {isProject.githubUrl && (
                  <Link
                    href={isProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger className="w-[48px] h-[48px] rounded-full bg-primary/20 hover:bg-primary/30 flex justify-center items-center group transition-all duration-500 hover:scale-110">
                          <BsGithub className="text-xl text-foreground transition-all duration-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-secondary font-sm font-bold font-work-sans">
                            Github Repository
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Project Image/Slider */}
          <div className="w-full xl:w-[50%] order-1 xl:order-none mb-8 xl:mb-0">
            <div className="relative">
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                modules={[Navigation, Pagination]}
                navigation={false}
                pagination={false}
                loop={true}
                onSlideChange={handleSlideChange}
                onSwiper={(sw: SwiperType) => setIsProject(data[sw.realIndex])}
                className="xl:h-[380px] h-[300px] rounded-xl"
              >
                {data.map((item, index) => (
                  <SwiperSlide key={item.title}>
                    <div className="h-full relative group flex justify-center items-center bg-background/10 backdrop-blur-2xl border border-transparent shadow-xl rounded-xl overflow-hidden">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index === 0}
                          quality={100}
                          className="object-cover max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                {/* WorkSlider Button */}
                <WorkSliderButton
                  containerStyle="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-4 z-20 w-full justify-between px-4 xl:w-max xl:justify-none xl:right-6 xl:gap-4"
                  buttonStyle="bg-primary/20 hover:bg-primary/30 backdrop-blur-md w-[40px] h-[40px] rounded-full flex justify-center items-center transition-all duration-500 hover:scale-110"
                  iconsStyle="text-foreground text-[18px]"
                />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
