import { BusinessDirectory } from "@/components/BusinessDirectory";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

interface HomeProps {
  searchParams: { search?: string };
}

export default function Home({ searchParams }: HomeProps) {
  const searchTerm = searchParams.search || "";

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <BusinessDirectory searchTerm={searchTerm} />
    </div>
  );
}
