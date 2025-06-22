import { Navbar } from '../../components/Navbar'
import { Hero } from '../../components/Hero'
import { BusinessDirectory } from '../../components/BusinessDirectory'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <BusinessDirectory />
    </main>
  )
}