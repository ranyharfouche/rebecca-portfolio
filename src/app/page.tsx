import Hero from '@/components/Hero';
import About from '@/components/About';
import Showcase from '@/components/Showcase';
import OtherPassions from '@/components/OtherPassions';
import Footer from '@/components/Footer';

export default function Home({ heroImage, aboutImage }: { heroImage?: string; aboutImage?: string }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero heroImage={heroImage} />
      <About aboutImage={aboutImage} />
      <Showcase />
      <OtherPassions />
      <Footer />
    </div>
  );
}
