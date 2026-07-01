"use client";

import { useState } from "react";
import { ExperienceType } from "@/types/data-types";
import { Card, CardContent } from "@/components/ui/card";
import { ExperienceModal } from "@/components/overlay/experience-modal";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseIcon,
  Building2Icon,
  Calendar,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const Experience = ({ data }: { data: ExperienceType[] }) => {
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceType | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (data: ExperienceType) => {
    setSelectedExperience(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  return (
    <>
      <section id="experience">
        <div className="text-center mb-16">
          <h2 className="text-4xl xl:text-5xl font-bold font-comfortaa text-foreground mb-4">
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-ring mx-auto rounded-full" />
          <p className="text-lg text-foreground/70 mt-6 font-work-sans max-w-2xl mx-auto">
            Showcasing my professional milestones
          </p>
        </div>

        <div className="w-full relative pb-12 experience-slider">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
            spaceBetween={16}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="w-full pb-10"
          >
            {/* Experience Data */}
            {data.map((data, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div
                  onClick={() => openModal(data)}
                  className="group transition-all cursor-pointer hover:scale-[1.01] duration-500"
                >
                  <Card className="bg-background/10 backdrop-blur-2xl border border-transparent shadow-xl hover:shadow-2xl ">
                    <CardContent className="p-6">
                      {/* Badge */}
                      <Badge
                        variant={
                          data.status === "Fulltime" ||
                          data.status === "Full time"
                            ? "fulltime"
                            : data.status === "Contract"
                              ? "fulltime"
                              : data.status === "Internship"
                                ? "internship"
                                : "organization"
                        }
                        className="absolute top-4 right-4 text-xs z-10 font-work-sans"
                      >
                        {data.status}
                      </Badge>

                      {/* Logo */}
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-transparent p-4 mx-auto md:mx-0">
                        <Image
                          src={data.logoUrl}
                          alt={data.company}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4 text-center md:text-left mt-4">
                        {/* Company Name */}
                        <div className="font-work-sans">
                          <h2 className="text-2xl font-bold font-comfortaa text-foreground group-hover:text-primary transition-colors duration-500">
                            {data.company}
                          </h2>
                          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <BriefcaseIcon className="w-4 h-4 text-foreground/70" />
                            <p className="text-sm text-foreground">
                              {data.position}
                            </p>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <Building2Icon className="w-4 h-4 text-foreground/70" />
                            <p className="text-sm text-foreground">
                              {data.division}
                            </p>
                          </div>
                        </div>

                        {/* Period and Location */}
                        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                          <div className="flex items-center gap-2 text-foreground/70 font-work-sans">
                            <Calendar className="w-4 h-4 text-foreground" />
                            {data.period.includes("Present") ? (
                              <span className="text-sm text-foreground">
                                {data.period.split("Present")[0]}
                                <span className="text-foreground text-blink">
                                  Present
                                </span>
                                {data.period.split("Present")[1] || ""}
                              </span>
                            ) : (
                              <span className="text-foreground text-sm">
                                {data.period}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Open Modal */}
                      <div className="flex w-full items-center justify-center md:justify-start space-x-2 text-center md:text-left text-foreground/70 group-hover:text-primary transition-colors duration-500 mt-4">
                        <span className="text-xs ">
                          Click to see more details
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Experience Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedExperience}
      />
    </>
  );
};
