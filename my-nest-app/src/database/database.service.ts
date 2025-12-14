import { Injectable } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import * as path from 'path';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  diaries: DiaryEntry[];
}

@Injectable()
export class DatabaseService {
  private db: Low<DatabaseSchema>;

  constructor() {
    const dbPath = path.join(process.cwd(), 'diaries.json');
    const adapter = new JSONFile<DatabaseSchema>(dbPath);
    this.db = new Low(adapter, {
      diaries: []
    });

    this.initialize();
  }

  private async initialize() {
    await this.db.read();
    if (!this.db.data || !this.db.data.diaries) {
      this.db.data = { diaries: [] };
      await this.db.write();
    }
  }

  async findAll(): Promise<DiaryEntry[]> {
    await this.db.read();
    return this.db.data!.diaries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<DiaryEntry | null> {
    await this.db.read();
    return this.db.data!.diaries.find(diary => diary.id === id) || null;
  }

  async create(data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryEntry> {
    await this.db.read();
    const newDiary: DiaryEntry = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.data!.diaries.push(newDiary);
    await this.db.write();
    return newDiary;
  }

  async update(id: string, data: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>): Promise<DiaryEntry | null> {
    await this.db.read();
    const index = this.db.data!.diaries.findIndex(diary => diary.id === id);

    if (index === -1) {
      return null;
    }

    this.db.data!.diaries[index] = {
      ...this.db.data!.diaries[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await this.db.write();
    return this.db.data!.diaries[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.db.read();
    const index = this.db.data!.diaries.findIndex(diary => diary.id === id);

    if (index === -1) {
      return false;
    }

    this.db.data!.diaries.splice(index, 1);
    await this.db.write();
    return true;
  }

  async search(query: string): Promise<DiaryEntry[]> {
    await this.db.read();
    const lowercaseQuery = query.toLowerCase();

    return this.db.data!.diaries.filter(diary =>
      diary.title.toLowerCase().includes(lowercaseQuery) ||
      diary.content.toLowerCase().includes(lowercaseQuery) ||
      diary.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async findByDateRange(startDate: string, endDate: string): Promise<DiaryEntry[]> {
    await this.db.read();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.db.data!.diaries.filter(diary => {
      const diaryDate = new Date(diary.date);
      return diaryDate >= start && diaryDate <= end;
    });
  }

  async findByMood(mood: string): Promise<DiaryEntry[]> {
    await this.db.read();
    return this.db.data!.diaries.filter(diary => diary.mood === mood);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}