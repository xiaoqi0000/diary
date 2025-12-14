export class DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'grateful';
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<DiaryEntry>) {
    Object.assign(this, data);
    this.id = data.id || DiaryEntry.generateId();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
