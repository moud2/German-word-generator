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
      <script defer data-domain="qamar.onrender.com" src="https://plausible.io/js/script.js"></script>
        <title>German Word Generator</title>
        
        <meta
          name="description"
          content="Learn a new German word every time you hit Generate!"
        />
      </Head>

      {/* ⚠️ Trial Version Notice */}
      <div className="bg-yellow-100 text-yellow-800 text-center text-sm px-4 py-2 font-medium shadow-md">
        هذا إصدار تجريبي، الرجاء عدم التقاط صور أو مشاركة الرابط
      </div>

      {/* Main content */}
      <div className={`${poppins.variable} font-sans`}>
        <WordScreen />
      </div>
    </>
  )
}
