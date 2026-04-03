import Hero from '@/components/Hero';
import About from '@/components/About';
import Showcase from '@/components/Showcase';
import OtherPassions from '@/components/OtherPassions';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <About />
      <Showcase />
      <OtherPassions />
      <Footer />
    </div>
  );
}
