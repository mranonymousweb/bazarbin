<template>
  <div>
    <div v-if="stories.length" class="mt-6">
      <div v-for="story in stories" :key="story.id" class="story-item p-4 mb-4 border rounded flex items-center">
        <img :src="story.businessProfileImage" alt="پروفایل کسب و کار" class="w-16 h-16 rounded-full mr-4" />
        <div class="flex-1">
          <div class="font-bold text-lg">{{ story.businessName }}</div>
          <div class="text-gray-700">{{ story.productName }}</div>
          <div class="flex items-center">
            <div class="text-green-600 font-semibold">{{ story.productPrice }} تومان</div>
            <span v-if="story.isLocked" class="ml-2 text-red-500" title="قفل شده">🔒</span>
          </div>
          <div class="text-sm text-gray-500">تعداد بازدید: {{ story.views }}</div>
        </div>
      </div>
    </div>
    <div v-else class="mt-6 text-gray-500">هیچ استوری‌ای وجود ندارد.</div>
  </div>
</template>

<script>
export default {
  props: {
    stories: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.story-item:hover {
  background-color: #f0f9ff;
}
</style>
