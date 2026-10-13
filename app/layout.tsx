import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";
export const metadata: Metadata = {
  title: "DealRoom OS — Bank Edition (Demo)",
  description: "Interactive sandbox: investor CRM, living wire ledger, 506(c) gate and tracked data room for de novo bank capital raises.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><Shell>{children}</Shell></body></html>);
}
