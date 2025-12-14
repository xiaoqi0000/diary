<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useDiaryStore } from "@/stores/diaryStore";
import type { DiaryEntry } from "@/types/diary";

const diaryStore = useDiaryStore();
const searchQuery = ref("");
const selectedMood = ref("");
const showSearch = ref(false);

const filteredDiaries = computed(() => {
  let diaries = diaryStore.diaries;

  if (searchQuery.value) {
    diaries = diaries.filter(
      (diary) =>
        diary.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        diary.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        diary.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ),
    );
  }

  if (selectedMood.value) {
    diaries = diaries.filter((diary) => diary.mood === selectedMood.value);
  }

  return diaries;
});

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const previewContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h1 class="text-3xl font-bold text-gray-900">我的日记</h1>
      <div class="flex gap-2">
        <button
          @click="showSearch = !showSearch"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔍 搜索
        </button>
        <select
          v-model="selectedMood"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <option value="">所有心情</option>
          <option value="happy">😊 开心</option>
          <option value="sad">😢 伤心</option>
          <option value="neutral">😐 平静</option>
          <option value="excited">🤩 兴奋</option>
          <option value="anxious">😰 焦虑</option>
          <option value="grateful">🙏 感恩</option>
        </select>
      </div>
    </div>

    <div v-if="showSearch" class="bg-white p-4 rounded-lg shadow-xs border">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索日记标题、内容或标签..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-if="diaryStore.loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else-if="diaryStore.error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ diaryStore.error }}
      <button
        @click="diaryStore.clearError"
        class="ml-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>

    <div v-else-if="filteredDiaries.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📔</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">
        {{ searchQuery || selectedMood ? "没有找到匹配的日记" : "还没有日记" }}
      </h3>
      <p class="text-gray-500 mb-6">
        {{
          searchQuery || selectedMood
            ? "试试其他搜索条件"
            : "开始记录你的第一篇日记吧！"
        }}
      </p>
      <RouterLink
        v-if="!searchQuery && !selectedMood"
        to="/new"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ✍️ 写第一篇日记
      </RouterLink>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="diary in filteredDiaries"
        :key="diary.id"
        class="bg-white rounded-lg shadow-xs border hover:shadow-md transition-shadow cursor-pointer"
      >
        <RouterLink :to="`/diary/${diary.id}`" class="block p-6">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
              {{ diary.title }}
            </h3>
            <span class="text-2xl">
              {{ moodEmojis[diary.mood] }}
            </span>
          </div>

          <p class="text-gray-500 text-sm mb-3">
            {{ formatDate(diary.date) }}
          </p>

          <p class="text-gray-600 mb-4 line-clamp-3">
            {{ previewContent(diary.content) }}
          </p>

          <div v-if="diary.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="tag in diary.tags"
              :key="tag"
              class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              #{{ tag }}
            </span>
          </div>

          <div v-if="diary.isPrivate" class="mt-3 text-gray-400 text-sm">
            🔒 私密日记
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
