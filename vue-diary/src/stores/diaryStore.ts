import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { DiaryEntry, CreateDiaryEntry } from "@/types/diary";
import { diaryService } from "@/services/diaryService";

export const useDiaryStore = defineStore("diary", () => {
  const diaries = ref<DiaryEntry[]>([]);
  const currentDiary = ref<DiaryEntry | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sortedDiaries = computed(() => {
    return [...diaries.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });

  const diariesByMonth = computed(() => {
    const grouped: Record<string, DiaryEntry[]> = {};

    sortedDiaries.value.forEach((diary) => {
      const date = new Date(diary.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(diary);
    });

    return grouped;
  });

  const moodStatistics = computed(() => {
    const stats: Record<string, number> = {};

    diaries.value.forEach((diary) => {
      stats[diary.mood] = (stats[diary.mood] || 0) + 1;
    });

    return stats;
  });

  async function fetchDiaries() {
    loading.value = true;
    error.value = null;

    try {
      diaries.value = await diaryService.getAllDiaries();
    } catch (err) {
      error.value = "获取日记列表失败";
      console.error("Failed to fetch diaries:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchDiaryById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      currentDiary.value = await diaryService.getDiaryById(id);
      return currentDiary.value;
    } catch (err) {
      error.value = "获取日记详情失败";
      console.error("Failed to fetch diary:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createDiary(diaryData: CreateDiaryEntry) {
    loading.value = true;
    error.value = null;

    try {
      const newDiary = await diaryService.createDiary(diaryData);
      diaries.value.unshift(newDiary);
      return newDiary;
    } catch (err) {
      error.value = "创建日记失败";
      console.error("Failed to create diary:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateDiary(id: string, diaryData: Partial<CreateDiaryEntry>) {
    loading.value = true;
    error.value = null;

    try {
      const updatedDiary = await diaryService.updateDiary(id, diaryData);
      const index = diaries.value.findIndex((d) => d.id === id);

      if (index !== -1) {
        diaries.value[index] = updatedDiary;
      }

      if (currentDiary.value?.id === id) {
        currentDiary.value = updatedDiary;
      }

      return updatedDiary;
    } catch (err) {
      error.value = "更新日记失败";
      console.error("Failed to update diary:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDiary(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await diaryService.deleteDiary(id);
      diaries.value = diaries.value.filter((d) => d.id !== id);

      if (currentDiary.value?.id === id) {
        currentDiary.value = null;
      }
    } catch (err) {
      error.value = "删除日记失败";
      console.error("Failed to delete diary:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function searchDiaries(query: string) {
    loading.value = true;
    error.value = null;

    try {
      const results = await diaryService.searchDiaries(query);
      diaries.value = results;
      return results;
    } catch (err) {
      error.value = "搜索日记失败";
      console.error("Failed to search diaries:", err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchDiariesByMood(mood: string) {
    loading.value = true;
    error.value = null;

    try {
      const results = await diaryService.getDiariesByMood(mood);
      diaries.value = results;
      return results;
    } catch (err) {
      error.value = "按心情筛选失败";
      console.error("Failed to fetch diaries by mood:", err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function setCurrentDiary(diary: DiaryEntry | null) {
    currentDiary.value = diary;
  }

  return {
    diaries: sortedDiaries,
    currentDiary,
    loading,
    error,
    diariesByMonth,
    moodStatistics,
    fetchDiaries,
    fetchDiaryById,
    createDiary,
    updateDiary,
    deleteDiary,
    searchDiaries,
    fetchDiariesByMood,
    clearError,
    setCurrentDiary,
  };
});
