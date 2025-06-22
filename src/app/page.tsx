import { BusinessDirectory } from "@/components/BusinessDirectory";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="text-white p-4">TEST - This should be red background with white text</div>
      <Navbar />
      <Hero />
      <BusinessDirectory />
    </div>
  );
}
