export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: "happy" | "sad" | "neutral" | "excited" | "anxious" | "grateful";
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDiaryEntry {
  title: string;
  content: string;
  date: string;
  mood: DiaryEntry["mood"];
  tags: string[];
  isPrivate: boolean;
}
