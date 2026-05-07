import type { Metadata } from "next";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "Contact — Zircon",
  description: "Start a project with Zircon Architecture Studio.",
};

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
