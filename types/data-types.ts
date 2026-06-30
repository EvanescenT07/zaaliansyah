import type {
  Academic,
  Experience,
  Playlist,
  Project as PrismaProject,
  Profile,
  SocialMedia,
  Status,
  TechStack,
} from "@/lib/generated/prisma/client";
import { JSX } from "react";

export interface BlobItemProps {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

export interface HeroProps {
  profile: Profile;
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

export type CreateAcademicInput = Omit<
  Academic,
  "id" | "createdAt" | "updatedAt"
>;

export type UpsertProfileInput = Omit<
  Profile,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateExperienceInput = Omit<
  Experience,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateProjectInput = Omit<
  PrismaProject,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateTechInput = Omit<TechStack, "id" | "createdAt" | "updatedAt">;

export type CreateStatusInput = Omit<Status, "id" | "createdAt" | "updatedAt">;

export type CreateSocialInput = Omit<
  SocialMedia,
  "id" | "createdAt" | "updatedAt"
>;
