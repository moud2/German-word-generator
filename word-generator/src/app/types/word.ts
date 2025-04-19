export interface WordEntry {
  lemma: string;
  type: 'noun' | 'verb' | 'adjective';
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  translations?: Record<string, string[]>;
  conjugation?: string;

  // This is what was missing:
  gender?: 'm' | 'f' | 'n'; // based on your JSON data
}
