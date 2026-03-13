import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit02Icon,
  Linkedin01Icon,
  RocketIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IconSvgElement } from "@hugeicons/react";
import { HeroSection } from "@/components/hero";
import { FeatureSection } from "@/components/feature-section";

const features = [
  {
    icon: Linkedin01Icon,
    title: "LinkedIn Integration",
    description: "Connect your LinkedIn account securely using OAuth 2.0",
  },
  {
    icon: Edit02Icon,
    title: "Simple Editor",
    description: "Write and format your posts with an intuitive interface",
  },
  {
    icon: RocketIcon,
    title: "One-Click Publish",
    description: "Publish your content directly to LinkedIn instantly",
  },
  {
    icon: SecurityCheckIcon,
    title: "Secure & Private",
    description: "Your credentials are never stored - we use secure tokens",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <HeroSection />

      <div id="features" className="mx-auto mt-24 max-w-5xl">
        <FeatureSection />
      </div>
    </div>
  );
}
