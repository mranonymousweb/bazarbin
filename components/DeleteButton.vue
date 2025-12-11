<template>
  <span>
    <Tooltip>
      <template #activator>
        <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer"
           @click="$emit('click')"></i>
      </template>
      {{ label }}
    </Tooltip>
  </span>
</template>

<script>
export default {
  name: "DeleteButton",
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
