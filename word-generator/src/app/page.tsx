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
     

      <div className={`${poppins.variable} font-sans`}>
        <WordScreen />
      </div>
    </>
  );
}
