<template>
  <span>
    <Tooltip>
      <template #activator>
        <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
           @click="$emit('click')"></i>
      </template>
      {{ label }}
    </Tooltip>
  </span>
</template>

<script>
export default {
  name: "EditButton",
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
