# German Topic – AI-Powered Grammar Feedback for German Learners

**German Topic** is a web application that helps users improve their spoken German by generating vocabulary prompts and providing AI-based feedback on grammatical mistakes. It is designed for learners who want to speak more confidently and learn from their spoken errors in real time.

**Live Demo:** [https://germantopic.com](https://germantopic.com)

---

## Features

- Generate random German words based on language level (A1–B2)
- Record user speech and transcribe it automatically
- Receive grammar corrections and feedback powered by AI
- (Coming soon) Track progress and feedback history

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend & Authentication**: Supabase
- **AI & Processing Services**:
  - OpenAI – grammar correction and feedback
  - AssemblyAI – speech-to-text transcription

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/german-word-generator.git
cd german-word-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the root of your project and include the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to test the app locally.

---

## Target Users

- German learners at A1–B2 level
- Learners who want feedback on their spoken grammar
- People practicing real-time speaking in a web-based environment

---

## Future Improvements

- Progress tracking and session history
- Vocabulary difficulty settings
- Export of feedback as PDF
- Support for additional languages and accents

---

## License

This project is intended for academic and demonstration purposes. For commercial or extended use, please contact the developer.

---

## Contact

**Mahamoud Hafed Mohamed**  
Website: https://germantopic.com
