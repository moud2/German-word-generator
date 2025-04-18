import Head from 'next/head'
import { Poppins } from 'next/font/google'
import WordScreen from './components/wordScreen'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

export default function Home() {
  return (
    <>
      <Head>
        <title>German Word Generator</title>
        <meta
          name="description"
          content="Learn a new German word every time you hit Generate!"
        />
      </Head>
      <WordScreen />
    </>
  )
}
