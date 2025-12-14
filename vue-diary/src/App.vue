<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useDiaryStore } from "@/stores/diaryStore";

const diaryStore = useDiaryStore();

diaryStore.fetchDiaries();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-xs border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <RouterLink to="/" class="text-xl font-bold text-gray-900">
              📔 我的日记
            </RouterLink>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink
              to="/"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-blue-600 text-white hover:bg-blue-700"
            >
              首页
            </RouterLink>
            <RouterLink
              to="/new"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-blue-600 text-white hover:bg-blue-700"
            >
              写日记
            </RouterLink>
            <RouterLink
              to="/statistics"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-blue-600 text-white hover:bg-blue-700"
            >
              统计
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>
