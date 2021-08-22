// General
import Head from 'next/head'

export interface OwnProps {
  title?: string
}

export default function HeadCustom({ title }: OwnProps) {
  const customTitle = title || 'Curation Dashboard'

  return (
    <Head>
      <title>{customTitle}</title>
      <link
        href="https://storage.googleapis.com/graph-fonts/EuclidCircular/fonts.css"
        rel="stylesheet"
      ></link>
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="https://storage.googleapis.com/graph-web/favicon.png"
      ></link>
    </Head>
  )
}
