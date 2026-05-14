import type { Metadata } from "next";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "Contact — Zircon34",
  description: "Start a project with Zircon34 Design Studio.",
};

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
