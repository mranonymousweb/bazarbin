<template>
  <div>
    <div class="flex justify-between pb-4 -mb-4">

      <ul class="flex">
        <li v-for="tab in tabs" :key="tab.name" class="border-l-4 sm:border-l-8 border-gray-50 cursor-pointer">
          <span class="block px-2 text-xs sm:text-base sm:px-4 cursor-pointer" @click="$emit('click', tab.name)">
            <span :class="['flex items-center border-black py-2 sm:py-3 -mb-4', tab.name === active ? activeTabClass : 'text-gray-400']">
              <i v-if="tab.hasOwnProperty('icon')" :class="['pl-2', tab.icon]"></i>
              {{ tab.label }}
              <span v-if="tab.hasOwnProperty('counter') && tab.counter" class="flex items-center justify-center bg-red-450 text-white rounded-full mr-2 text-xs" style="aspect-ratio: 1 / 1; min-width: 1.5rem">
                {{ tab.counter }}
              </span>
            </span>
          </span>
        </li>
      </ul>

      <slot name="afterTabs"/>

    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    tabs: {
      type: Array,
      required: true
    },
    active: {
      type: String,
      required: true
    },
    activeTabClass: {
      type: String,
      default: 'border-b'
    }
  }
}
</script>
