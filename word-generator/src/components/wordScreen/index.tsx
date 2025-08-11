'use client';
import React from 'react';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import dynamic from 'next/dynamic';
const Recorder = dynamic(() => import('../recorder/Recorder'), { ssr: false });
import LevelSelector from './LevelSelector';
import WordDisplay from './WordDisplay';
import GenerateButton from './GenerateButton';

import '../../app/i18n';
import useWordScreen from '../../hooks/useWordScreen';

export default function WordScreen() {
  // Hook to get state and functions for word screen functionality
  const {
    showWelcome,
    setShowWelcome,
    tips,
    features,
    level,
    setLevel,
    allWords,
    current,
    setCurrent,
    handleGenerate,
    i18n,
    t,
  } = useWordScreen();

  // Main wrapper style - creates white background with black dot pattern
  const wrapperStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#ffffff',
    backgroundImage: `
      radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)
    `,
    backgroundSize: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };

  // Background overlay style - currently transparent but kept for future enhancements
  const backgroundOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    zIndex: 1
  };

  // Main content area styling - centers content with proper spacing
  const mainStyle: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6rem 1rem 2rem 1rem',
    position: 'relative',
    zIndex: 10
  };

  // Glass card styling - creates frosted glass effect with shadows
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: `
      0 8px 32px 0 rgba(0, 0, 0, 0.15),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
      0 0 0 1px rgba(0, 0, 0, 0.05)
    `,
    width: '100%',
    maxWidth: '600px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideUp 0.6s ease-out'
  };

  // Container for level selector component
  const levelSelectorContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  };

  // Main content section containing word display and generate button
  const contentSectionStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem'
  };

  // Recorder section styling - centers the recorder component
  const recorderSectionStyle: React.CSSProperties = {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  };



  // CSS keyframe animations and responsive styles
  const keyframes = `
    // Slide up animation for card entrance
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // Floating animation - currently unused but available for future features
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    // Mobile responsive styles for smaller screens
    @media (max-width: 640px) {
      .main-content {
        padding-top: 4rem !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
      
      .glass-card {
        padding: 1.5rem !important;
        border-radius: 20px !important;
      }
    }

    // Desktop styles for larger screens
    @media (min-width: 641px) {
      .glass-card {
        padding: 2.5rem !important;
      }
    }

    // Hover effects for the glass card
    .glass-card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 40px 0 rgba(0, 0, 0, 0.2),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
        0 0 0 1px rgba(0, 0, 0, 0.08);
    }
  `;

  // Color blobs behind the card
const blobBaseStyle: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '80%',
  filter: 'blur(80px)',
  opacity: 2,
  zIndex: 2, // behind the card but above the background pattern
  transform: 'translate(-50%, -50%)',
};

const blobs = [
  {
    style: {
      ...blobBaseStyle,
      top: '30%',
      left: '25%',
      width: '300px',
      height: '300px',
      background: 'rgba(255, 122, 128, 0.4)', // pink
    },
  },
  {
    style: {
      ...blobBaseStyle,
      top: '70%',
      left: '75%',
      width: '250px',
      height: '250px',
      background: 'rgba(0, 200, 255, 0.4)', // cyan
    },
  },
  {
    style: {
      ...blobBaseStyle,
      top: '50%',
      left: '50%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 0, 0.3)', // yellow
    },
  },
];


  return (
    <>
      {/* Inject CSS animations and responsive styles */}
      <style jsx>{keyframes}</style>
      <div style={wrapperStyle}>
        {/* Background overlay for future enhancements */}
        <div style={backgroundOverlayStyle}></div>
        <Header />
        <main style={mainStyle} className="main-content">
          {/* Main content card with glass morphism effect */}
          {/* Colored blobs for background */}
{blobs.map((blob, index) => (
  <div key={index} style={blob.style}></div>
))}

          <section style={cardStyle} className="glass-card">
            {/* Level selector section */}
            <div style={levelSelectorContainerStyle}>
              <LevelSelector
                level={level}
                setLevel={setLevel}
                allWords={allWords}
                setCurrent={setCurrent}
              />
            </div>

            {/* Word display and generate button section */}
            <div style={contentSectionStyle}>
              <WordDisplay word={current} i18n={i18n} />
              <GenerateButton onClick={handleGenerate} />
            </div>

            {/* Voice recorder section */}
            <div style={recorderSectionStyle}>
              <Recorder />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}