<template>
  <div>
    <Tooltip v-if="status == 1">
      <template #activator>
        <i
          class="flaticon-151-check text-blue-450 font-bold text-base cursor-pointer"
          @click="$emit('disable')"
        ></i>
      </template>
      غیر فعال کردن
    </Tooltip>
    <Tooltip v-else>
      <template #activator>
        <i
          class="flaticon-034-cancel text-red-550 font-bold text-base cursor-pointer"
          @click="$emit('enable')"
        ></i>
      </template>
      فعال کردن
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: "EnableDisableButton",
  props: {
    status: {
      type: [String, Number],
      required: true
    }
  }
}
</script>
