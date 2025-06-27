import { BusinessDirectory } from "@/components/BusinessDirectory";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await searchParams as required in Next.js 15+
  const params = await searchParams;
  const searchTerm = params.search || "";

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <Hero />
      <BusinessDirectory searchTerm={searchTerm} />
    </div>
  );
}
