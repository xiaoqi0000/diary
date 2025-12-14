<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useDiaryStore } from "@/stores/diaryStore";
import type { CreateDiaryEntry } from "@/types/diary";

const router = useRouter();
const diaryStore = useDiaryStore();

const diaryForm = reactive<CreateDiaryEntry>({
  title: "",
  content: "",
  date: new Date().toISOString().split("T")[0] || "",
  mood: "neutral",
  tags: [""], // 初始化一个空的标签输入框
  isPrivate: false,
});

const tagInput = ref("");
const isSubmitting = ref(false);
const showPreview = ref(false);

const hasDraft = computed(() => {
  return !!localStorage.getItem("diaryDraft");
});

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
};

const moodOptions = [
  { value: "happy", label: "开心", emoji: "😊" },
  { value: "sad", label: "伤心", emoji: "😢" },
  { value: "neutral", label: "平静", emoji: "😐" },
  { value: "excited", label: "兴奋", emoji: "🤩" },
  { value: "anxious", label: "焦虑", emoji: "😰" },
  { value: "grateful", label: "感恩", emoji: "🙏" },
];

const addTagInput = () => {
  diaryForm.tags.push("");
};

const removeTagInput = (index: number) => {
  diaryForm.tags.splice(index, 1);
};

const updateTag = (index: number, value: string) => {
  diaryForm.tags[index] = value;
};

const handleTagKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTagInput();
  } else if (e.key === "Backspace" && diaryForm.tags[index] === "" && diaryForm.tags.length > 1) {
    e.preventDefault();
    removeTagInput(index);
  }
};

const submitDiary = async () => {
  if (!diaryForm.title || !diaryForm.content) {
    alert("请填写标题和内容");
    return;
  }

  // 过滤掉空标签
  const cleanedTags = diaryForm.tags.filter(tag => tag.trim() !== "");
  const finalForm = {
    ...diaryForm,
    tags: cleanedTags
  };

  isSubmitting.value = true;

  try {
    await diaryStore.createDiary(finalForm);
    router.push("/");
  } catch (error) {
    console.error("Failed to create diary:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const saveDraft = () => {
  const draft = {
    ...diaryForm,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("diaryDraft", JSON.stringify(draft));
  alert("草稿已保存");
};

const loadDraft = () => {
  const draftStr = localStorage.getItem("diaryDraft");
  if (draftStr) {
    try {
      const draft = JSON.parse(draftStr);
      Object.assign(diaryForm, draft);
      delete draft.savedAt;
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  }
};

const clearDraft = () => {
  localStorage.removeItem("diaryDraft");
  Object.assign(diaryForm, {
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    mood: "neutral",
    tags: [""], // 保持至少一个空的标签输入框
    isPrivate: false,
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

if (localStorage.getItem("diaryDraft")) {
  loadDraft();
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">写日记</h1>
      <div class="flex gap-2">
        <button
          v-if="hasDraft"
          @click="clearDraft"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          清除草稿
        </button>
        <button
          @click="saveDraft"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          保存草稿
        </button>
        <button
          @click="showPreview = !showPreview"
          class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          {{ showPreview ? "编辑" : "预览" }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-xs border">
      <div v-if="showPreview" class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ diaryForm.title || "无标题" }}
        </h2>
        <div class="flex items-center gap-4 mb-6 text-gray-600">
          <span>{{ formatDate(diaryForm.date) }}</span>
          <span class="text-2xl">{{ moodEmojis[diaryForm.mood] }}</span>
          <span v-if="diaryForm.isPrivate">🔒 私密</span>
        </div>
        <div class="prose max-w-none">
          <div class="whitespace-pre-wrap">
            {{ diaryForm.content || "暂无内容" }}
          </div>
        </div>
        <div v-if="diaryForm.tags.length > 0" class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="tag in diaryForm.tags"
            :key="tag"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <form v-else @submit.prevent="submitDiary" class="p-6 space-y-6">
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            标题
          </label>
          <input
            id="title"
            v-model="diaryForm.title"
            type="text"
            required
            placeholder="给今天起个标题吧..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              日期
            </label>
            <input
              id="date"
              v-model="diaryForm.date"
              type="date"
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              心情
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="mood in moodOptions"
                :key="mood.value"
                type="button"
                @click="diaryForm.mood = mood.value as CreateDiaryEntry['mood']"
                :class="[
                  'p-3 rounded-lg border-2 transition-all',
                  diaryForm.mood === mood.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <span class="text-2xl">{{ mood.emoji }}</span>
                <span class="block text-sm mt-1">{{ mood.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            for="content"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            内容
          </label>
          <textarea
            id="content"
            v-model="diaryForm.content"
            required
            rows="12"
            placeholder="记录今天发生的事情..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <p class="text-sm text-gray-500 mt-2">
            {{ diaryForm.content.length }} 个字符
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div class="space-y-3">
            <!-- 标签输入框组 -->
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(tag, index) in diaryForm.tags"
                :key="index"
                class="relative"
              >
                <input
                  :value="tag"
                  @input="updateTag(index, ($event.target as HTMLInputElement).value)"
                  @keydown="handleTagKeydown($event, index)"
                  type="text"
                  :placeholder="index === 0 ? '输入标签...' : ''"
                  class="px-4 py-2 pr-10 border-2 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-32"
                  :class="{
                    'border-gray-300': tag.trim() === '',
                    'border-blue-300 bg-blue-50': tag.trim() !== ''
                  }"
                />
                <!-- 删除按钮 -->
                <button
                  v-if="diaryForm.tags.length > 1"
                  type="button"
                  @click="removeTagInput(index)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="删除此标签"
                >
                  ✕
                </button>
              </div>

              <!-- 添加标签按钮 -->
              <button
                type="button"
                @click="addTagInput"
                class="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center gap-1"
                title="添加新标签"
              >
                <span class="text-lg">+</span>
                <span class="text-sm">添加</span>
              </button>
            </div>

            <!-- 提示信息 -->
            <p class="text-sm text-gray-500">
              💡 按 Enter 添加下一个标签，按 Backspace 删除空标签框
            </p>

            <!-- 已填写的标签预览 -->
            <div v-if="diaryForm.tags.filter(t => t.trim() !== '').length > 0" class="flex flex-wrap gap-2">
              <span class="text-sm text-gray-600">已添加标签：</span>
              <span
                v-for="tag in diaryForm.tags.filter(t => t.trim() !== '')"
                :key="tag"
                class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="isPrivate"
            v-model="diaryForm.isPrivate"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500"
          />
          <label for="isPrivate" class="ml-2 text-sm text-gray-700">
            🔒 这是私密日记
          </label>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$router.push('/')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? "保存中..." : "保存日记" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
