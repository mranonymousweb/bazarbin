<template>
  <component :is="tag" class="relative overflow-visible tooltip"
             @mouseenter="active = true"
             @mouseleave="active = false"
             @click="active = false"
  >
    <transition name="fade">
      <span v-show="active"
            class="
            absolute bottom-full block text-white bg-gray-900 p-2 mb-2 rounded left-1/2 text-xs
            whitespace-nowrap tooltiptext">
        <slot></slot>
      </span>
    </transition>
    <slot name="activator"></slot>
  </component>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    tag: {
      type: String,
      default: 'span'
    }
  },
  data() {
    return {
      active: false
    }
  }
}
</script>

<style>
.tooltip .tooltiptext {
  transform: translate(-50%, 0);
}
.tooltip .tooltiptext::after {
  top: 100%;
  left: 50%;
  content: " ";
  margin-left: -5px;
  border-width: 5px;
  position: absolute;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
</style>
