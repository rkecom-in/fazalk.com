import HomeSeo from "@/components/seo/HomeSeo";
import HeroSection from "@/components/layout/HeroSection";
import PositioningStrip from "@/components/layout/PositioningStrip";
import WhatWeSolve from "@/components/layout/WhatWeSolve";
import CoreOfferings from "@/components/layout/CoreOfferings";
import SeoServiceLinks from "@/components/layout/SeoServiceLinks";
import SampleDeliverables from "@/components/layout/SampleDeliverables";
import BottomSections from "@/components/layout/BottomSections";
import SiteHeader from "@/components/layout/SiteHeader";
import FaqSection from "@/components/layout/FaqSection";

export default function Home() {
  return (
    <>
      <HomeSeo />
      <main className="min-h-screen bg-background">
        <SiteHeader />
        <HeroSection />
        <PositioningStrip />
        <WhatWeSolve />
        <CoreOfferings />
        <SeoServiceLinks />
        <SampleDeliverables />
        <FaqSection />
        <BottomSections />
      </main>
    </>
  )
}
