import axios from "axios";
import type { DiaryEntry, CreateDiaryEntry } from "@/types/diary";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const diaryService = {
  async getAllDiaries(): Promise<DiaryEntry[]> {
    const response = await api.get("/diaries");
    return response.data;
  },

  async getDiaryById(id: string): Promise<DiaryEntry> {
    const response = await api.get(`/diaries/${id}`);
    return response.data;
  },

  async createDiary(diary: CreateDiaryEntry): Promise<DiaryEntry> {
    const response = await api.post("/diaries", diary);
    return response.data;
  },

  async updateDiary(
    id: string,
    diary: Partial<CreateDiaryEntry>,
  ): Promise<DiaryEntry> {
    const response = await api.patch(`/diaries/${id}`, diary);
    return response.data;
  },

  async deleteDiary(id: string): Promise<void> {
    await api.delete(`/diaries/${id}`);
  },

  async searchDiaries(query: string): Promise<DiaryEntry[]> {
    const response = await api.get(
      `/diaries/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  async getDiariesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<DiaryEntry[]> {
    const response = await api.get(
      `/diaries/date-range?start=${startDate}&end=${endDate}`,
    );
    return response.data;
  },

  async getDiariesByMood(mood: string): Promise<DiaryEntry[]> {
    const response = await api.get(`/diaries/mood/${mood}`);
    return response.data;
  },
};
