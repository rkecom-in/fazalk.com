import HomeSeo from "@/components/seo/HomeSeo";
import HeroSection from "@/components/layout/HeroSection";
import PositioningStrip from "@/components/layout/PositioningStrip";
import WhatWeSolve from "@/components/layout/WhatWeSolve";
import ProofStrip from "@/components/layout/ProofStrip";
import CoreOfferings from "@/components/layout/CoreOfferings";
import SeoServiceLinks from "@/components/layout/SeoServiceLinks";
import SampleDeliverables from "@/components/layout/SampleDeliverables";
import BottomSections from "@/components/layout/BottomSections";
import SiteHeader from "@/components/layout/SiteHeader";
import FaqSection from "@/components/layout/FaqSection";
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

export default function Home({
  initialLanguage,
}: HomeProps) {
  const isAr = initialLanguage === 'ar'

  return (
    <>
      <HomeSeo language={initialLanguage} />
      <main className="min-h-screen bg-background" lang={initialLanguage} dir={isAr ? 'rtl' : 'ltr'}>
        <SiteHeader />
        <HeroSection />
        <PositioningStrip />
        <WhatWeSolve />
        <ProofStrip />
        <CoreOfferings />
        <SeoServiceLinks />
        <SampleDeliverables />
        <FaqSection />
        <BottomSections />
      </main>
    </>
  )
}
