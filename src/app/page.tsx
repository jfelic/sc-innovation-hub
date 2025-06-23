import { BusinessDirectory } from "@/components/BusinessDirectory";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <BusinessDirectory />
    </div>
  );
}
