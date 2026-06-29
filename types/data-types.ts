import {
  Academic,
  Experience,
  Playlist,
  Project as PrismaProject,
  SocialMedia,
  Status,
  TechStack,
} from "@/lib/generated/prisma/client";
import { JSX } from "react";

export interface HeroProps {
  academics: Academic[];
  experiences: Experience[];
  projects: (PrismaProject & { techStacks: TechStack[] })[];
  techStacks: TechStack[];
  statuses: Status[];
  socials: SocialMedia[];
}

export type ProjectWithTechType = PrismaProject & {
  techStacks: TechStack[];
};

export type ExperienceType = Experience;

export type StatusType = Status;

export type TechStackType = TechStack[];

export type PlaylistType = Playlist[];

export interface SocialMediaType {
  containerStyle?: string;
  data: SocialMedia[];
}

export interface SocialMediaProps {
  containerStyle?: string;
  iconStyle?: string;
}

export interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExperienceType | null;
}

export interface ContactProps {
  icon: JSX.Element;
  title: string;
  value: string;
}


