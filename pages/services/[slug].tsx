import type { GetStaticPaths, GetStaticProps } from 'next'
import ServicePageContent from '@/components/seo/ServicePageContent'
import { getServicePage, servicePages, type ServicePage } from '@/lib/seo-services'

type ServicePageProps = {
  service: ServicePage
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: servicePages.map(service => ({ params: { slug: service.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<ServicePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const service = getServicePage(slug)

  if (!service) return { notFound: true }

  return { props: { service } }
}

export default function ServiceLandingPage({ service }: ServicePageProps) {
  return <ServicePageContent service={service} locale="en" />
}
