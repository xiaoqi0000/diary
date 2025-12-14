<script setup lang="ts">
import { computed } from "vue";
import { useDiaryStore } from "@/stores/diaryStore";

const diaryStore = useDiaryStore();

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
};

const moodLabels: Record<string, string> = {
  happy: "开心",
  sad: "伤心",
  neutral: "平静",
  excited: "兴奋",
  anxious: "焦虑",
  grateful: "感恩",
};

const totalDiaries = computed(() => diaryStore.diaries.length);

const moodStatistics = computed(() => {
  const stats: Record<string, { count: number; percentage: number }> = {};

  if (totalDiaries.value > 0) {
    Object.entries(diaryStore.moodStatistics).forEach(([mood, count]) => {
      stats[mood] = {
        count,
        percentage: Math.round((count / totalDiaries.value) * 100),
      };
    });
  }

  return stats;
});

const mostUsedMoods = computed(() => {
  return Object.entries(moodStatistics.value)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 3);
});

const currentStreak = computed(() => {
  if (diaryStore.diaries.length === 0) return 0;

  const sortedDates = [...diaryStore.diaries]
    .map((d) => new Date(d.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let currentDate = new Date();

  for (const dateStr of sortedDates) {
    const diaryDate = new Date(dateStr);
    const daysDiff = Math.floor(
      (currentDate.getTime() - diaryDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
});

const thisMonthDiaries = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return diaryStore.diaries.filter((diary) => {
    const diaryDate = new Date(diary.date);
    return (
      diaryDate.getMonth() === currentMonth &&
      diaryDate.getFullYear() === currentYear
    );
  });
});

const getAllTags = computed(() => {
  const tags: Record<string, number> = {};

  diaryStore.diaries.forEach((diary) => {
    diary.tags.forEach((tag) => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });

  return Object.entries(tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
});

const getMonthlyData = computed(() => {
  const months: Record<string, number> = {};

  diaryStore.diaries.forEach((diary) => {
    const date = new Date(diary.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months[monthKey] = (months[monthKey] || 0) + 1;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12);
});

const getMoodColor = (mood: string) => {
  const colors: Record<string, string> = {
    happy: '#10b981', // green-500
    sad: '#3b82f6', // blue-500
    neutral: '#6b7280', // gray-500
    excited: '#f59e0b', // amber-500
    anxious: '#ef4444', // red-500
    grateful: '#8b5cf6', // violet-500
  };
  return colors[mood] || '#3b82f6'; // default blue-500
};

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  return `${year}年${parseInt(month || "0")}月`;
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-900">日记统计</h1>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">总日记数</h3>
        <p class="text-3xl font-bold text-gray-900">{{ totalDiaries }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">本月日记</h3>
        <p class="text-3xl font-bold text-blue-600">
          {{ thisMonthDiaries.length }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">连续记录</h3>
        <p class="text-3xl font-bold text-green-600">{{ currentStreak }} 天</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">常用标签</h3>
        <p class="text-3xl font-bold text-purple-600">
          {{ getAllTags.length }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h2 class="text-xl font-bold text-gray-900 mb-4">心情分布</h2>
        <div v-if="totalDiaries === 0" class="text-gray-500 text-center py-8">
          暂无数据
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="([mood, stats], index) in Object.entries(moodStatistics)"
            :key="mood"
            class="flex items-center gap-3"
          >
            <span class="text-2xl">{{ moodEmojis[mood] }}</span>
            <span class="flex-1">{{ moodLabels[mood] }}</span>
            <div
              class="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden"
            >
              <div
                :style="{
                  width: `${stats.percentage}%`,
                  backgroundColor: getMoodColor(mood)
                }"
                class="h-full rounded-full transition-all duration-500"
                :class="[
                  'mood-progress-bar',
                  `mood-${mood}`
                ]"
              ></div>
            </div>
            <span class="text-sm text-gray-600 w-16 text-right">
              {{ stats.count }} ({{ stats.percentage }}%)
            </span>
          </div>
        </div>

        <div v-if="mostUsedMoods.length > 0" class="mt-6 pt-6 border-t">
          <h3 class="text-sm font-medium text-gray-700 mb-3">最常见的心情</h3>
          <div class="flex gap-2">
            <span
              v-for="[mood] in mostUsedMoods"
              :key="mood"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {{ moodEmojis[mood] }} {{ moodLabels[mood] }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-xs border">
        <h2 class="text-xl font-bold text-gray-900 mb-4">热门标签</h2>
        <div
          v-if="getAllTags.length === 0"
          class="text-gray-500 text-center py-8"
        >
          暂无标签
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="[tag, count] in getAllTags"
            :key="tag"
            class="flex items-center justify-between"
          >
            <span class="text-gray-700">#{{ tag }}</span>
            <span
              class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-sm"
            >
              {{ count }} 次
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-xs border">
      <h2 class="text-xl font-bold text-gray-900 mb-4">月度统计</h2>
      <div
        v-if="getMonthlyData.length === 0"
        class="text-gray-500 text-center py-8"
      >
        暂无数据
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="[month, count] in getMonthlyData"
          :key="month"
          class="flex items-center gap-3"
        >
          <span class="flex-1">{{ formatMonth(month) }}</span>
          <div
            class="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden max-w-xs"
          >
            <div
              :style="{
                width: `${Math.min((count / Math.max(...getMonthlyData.map(([, c]) => c))) * 100, 100)}%`,
              }"
              class="h-full bg-green-600 rounded-full transition-all duration-500"
            ></div>
          </div>
          <span class="text-sm text-gray-600 w-12 text-right">
            {{ count }} 篇
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mood-progress-bar {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mood-happy {
  background-color: #10b981 !important;
}

.mood-sad {
  background-color: #3b82f6 !important;
}

.mood-neutral {
  background-color: #6b7280 !important;
}

.mood-excited {
  background-color: #f59e0b !important;
}

.mood-anxious {
  background-color: #ef4444 !important;
}

.mood-grateful {
  background-color: #8b5cf6 !important;
}
</style>
