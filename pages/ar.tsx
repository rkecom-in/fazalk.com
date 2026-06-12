import type { GetStaticProps } from 'next'
import type { Language } from '@/lib/i18n'

export { default } from './index'

type HomeProps = {
  initialLanguage: Language
}

export const getStaticProps = (async () => ({
  props: {
    initialLanguage: 'ar',
  },
})) satisfies GetStaticProps<HomeProps>
