import Head from 'next/head'
import HeroSection from "@/components/layout/HeroSection";
import PositioningStrip from "@/components/layout/PositioningStrip";
import WhatWeSolve from "@/components/layout/WhatWeSolve";
import CoreOfferings from "@/components/layout/CoreOfferings";
import SampleDeliverables from "@/components/layout/SampleDeliverables";
import FractionalCTO from "@/components/layout/FractionalCTO";
import BottomSections from "@/components/layout/BottomSections";

import DecisionMap from '@/components/widgets/DecisionMap'
import CostEstimator from '@/components/widgets/CostEstimator'
import AssessmentTriage from '@/components/widgets/AssessmentTriage'

export default function Home() {
  return (
    <>
      <Head>
        <title>Fazal K. | CTO-Level AI & Cloud Architecture Consulting</title>
        <meta name="description" content="AI & Cloud Architecture Consulting for High-Stakes Decisions. We design the right AI system, fix what's broken, or get clarity before you commit serious time and money." />
      </Head>
      <main className="min-h-screen bg-background">
        <HeroSection />
        <PositioningStrip />
        <DecisionMap />
        <WhatWeSolve />
        <CoreOfferings />
        <SampleDeliverables />
        <FractionalCTO />
        <CostEstimator />
        <AssessmentTriage />
        <BottomSections />
      </main>
    </>
  )
}
