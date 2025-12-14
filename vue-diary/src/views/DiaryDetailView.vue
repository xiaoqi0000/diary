<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDiaryStore } from "@/stores/diaryStore";
import DiaryEditForm from "@/components/DiaryEditForm.vue";

const route = useRoute();
const router = useRouter();
const diaryStore = useDiaryStore();

const isEditing = ref(false);
const showDeleteConfirm = ref(false);

const diaryId = computed(() => route.params.id as string);

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const formatDateTime = (dateString: string | Date) => {
  return new Date(dateString).toLocaleString("zh-CN");
};

const editDiary = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const handleSaved = async () => {
  console.log("handleSaved called");
  isEditing.value = false;
  console.log("Navigating to home");

  try {
    // 尝试使用名称路由
    console.log("Trying to navigate by name...");
    await router.push({ name: 'home' });
    console.log("Navigation successful");
  } catch (error) {
    console.error("Navigation failed:", error);
    // 备用方案：使用路径
    console.log("Trying to navigate by path...");
    await router.push('/');
    console.log("Path navigation successful");
  }
};

const deleteDiary = async () => {
  try {
    await diaryStore.deleteDiary(diaryId.value);
    router.push("/");
  } catch (error) {
    console.error("Failed to delete diary:", error);
  }
};

onMounted(async () => {
  await diaryStore.fetchDiaryById(diaryId.value);
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
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
    </div>

    <div
      v-else-if="diaryStore.currentDiary"
      class="bg-white rounded-lg shadow-xs border"
    >
      <div v-if="!isEditing" class="p-6">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ diaryStore.currentDiary.title }}
          </h1>
          <div class="flex gap-2">
            <button
              @click="editDiary"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ✏️ 编辑
            </button>
            <button
              @click="showDeleteConfirm = true"
              class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              🗑️ 删除
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4 mb-6 text-gray-600">
          <span>{{ formatDate(diaryStore.currentDiary.date) }}</span>
          <span class="text-2xl">{{
            moodEmojis[diaryStore.currentDiary.mood]
          }}</span>
          <span>{{ moodLabels[diaryStore.currentDiary.mood] }}</span>
          <span v-if="diaryStore.currentDiary.isPrivate" class="text-gray-500">
            🔒 私密日记
          </span>
        </div>

        <div class="prose max-w-none mb-8">
          <div class="whitespace-pre-wrap text-gray-700">
            {{ diaryStore.currentDiary.content }}
          </div>
        </div>

        <div
          v-if="diaryStore.currentDiary.tags.length > 0"
          class="mb-8 flex flex-wrap gap-2"
        >
          <span
            v-for="tag in diaryStore.currentDiary.tags"
            :key="tag"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <div class="pt-6 border-t text-sm text-gray-500">
          <p>
            创建时间：{{ formatDateTime(diaryStore.currentDiary.createdAt) }}
          </p>
          <p
            v-if="
              diaryStore.currentDiary.updatedAt !==
              diaryStore.currentDiary.createdAt
            "
          >
            更新时间：{{ formatDateTime(diaryStore.currentDiary.updatedAt) }}
          </p>
        </div>
      </div>

      <div v-else class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">编辑日记</h2>

        <DiaryEditForm
          :diary="diaryStore.currentDiary"
          @cancel="cancelEdit"
          @saved="handleSaved"
        />
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📔</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">日记不存在</h3>
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        返回首页
      </router-link>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">确定要删除这篇日记吗？此操作不可恢复。</p>
        <div class="flex justify-end gap-4">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="deleteDiary"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
