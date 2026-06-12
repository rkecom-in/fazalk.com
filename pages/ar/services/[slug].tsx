import type { GetStaticPaths, GetStaticProps } from 'next'
import ServicePageContent from '@/components/seo/ServicePageContent'
import { getArabicServicePage, servicePagesAr, type ServicePage } from '@/lib/seo-services'

type ArabicServicePageProps = {
  service: ServicePage
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: servicePagesAr.map(service => ({ params: { slug: service.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<ArabicServicePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const service = getArabicServicePage(slug)

  if (!service) return { notFound: true }

  return { props: { service } }
}

export default function ArabicServiceLandingPage({ service }: ArabicServicePageProps) {
  return <ServicePageContent service={service} locale="ar" />
}
