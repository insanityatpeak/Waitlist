import type { LucideIcon } from "lucide-react";
import {
  Play,
  Camera,
  Music2,
  Radio,
  Mic,
  MessageCircle,
  Mail,
  Bot,
  Gamepad2,
  HeartPulse,
  TrendingUp,
  Smile,
  Sparkles,
  Cpu,
  Music,
  GraduationCap,
  Utensils,
  Rocket,
  Briefcase,
  LayoutGrid,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { slug: "youtube", name: "YouTube Creators", icon: Play },
  { slug: "instagram", name: "Instagram Creators", icon: Camera },
  { slug: "tiktok", name: "TikTok Creators", icon: Music2 },
  { slug: "twitch", name: "Twitch & Streamers", icon: Radio },
  { slug: "podcasts", name: "Podcasters & Audio", icon: Mic },
  { slug: "x", name: "X/Twitter Creators", icon: MessageCircle },
  { slug: "newsletters", name: "Newsletter & Substack Writers", icon: Mail },
  { slug: "faceless", name: "Faceless/Automation Channels", icon: Bot },
  { slug: "gaming", name: "Gaming Creators", icon: Gamepad2 },
  { slug: "fitness", name: "Fitness & Wellness Creators", icon: HeartPulse },
  { slug: "finance", name: "Finance & Business Creators", icon: TrendingUp },
  { slug: "comedy", name: "Comedy & Entertainment", icon: Smile },
  { slug: "beauty", name: "Beauty & Fashion", icon: Sparkles },
  { slug: "tech", name: "Tech & AI Creators", icon: Cpu },
  { slug: "music", name: "Music Artists", icon: Music },
  { slug: "education", name: "Educational Creators", icon: GraduationCap },
  { slug: "food", name: "Food & Lifestyle", icon: Utensils },
  { slug: "rising", name: "Rising Creators", icon: Rocket },
  { slug: "agencies", name: "Agencies & Creator Management", icon: Briefcase },
  { slug: "other", name: "Other", icon: LayoutGrid },
];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
