import HomeSeo from "@/components/seo/HomeSeo";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroSection from "@/components/layout/HeroSection";
import TheBet from "@/components/layout/TheBet";
import ViabeSection from "@/components/layout/ViabeSection";
import TrackRecord from "@/components/layout/TrackRecord";
import CompanySection from "@/components/layout/CompanySection";
import BottomSections from "@/components/layout/BottomSections";
import type { GetStaticProps } from "next";
import type { Language } from "@/lib/i18n";

type HomeProps = {
  initialLanguage: Language
}

export const getStaticProps = (async () => ({
  props: {
    initialLanguage: 'en',
  },
})) satisfies GetStaticProps<HomeProps>

export default function Home({ initialLanguage }: HomeProps) {
  return (
    <>
      <HomeSeo language={initialLanguage} />
      <main className="min-h-screen bg-background" lang="en" dir="ltr">
        <SiteHeader />
        <HeroSection />
        <TheBet />
        <ViabeSection />
        <TrackRecord />
        <CompanySection />
        <BottomSections />
      </main>
    </>
  )
}
