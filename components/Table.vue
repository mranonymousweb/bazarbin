<template>
  <table class="w-full text-sm">

    <thead>
    <tr class="bg-gray-50 h-12">
      <th
        v-for="col in cols"
        :key="col.label"
        :class="'text-right px-2 ' + col.class"
        v-text="col.label"
      ></th>
    </tr>
    </thead>

    <tbody>
    <slot/>
    </tbody>

  </table>
</template>

<script>
export default {
  name: "Table",
  props: {
    cols: {
      type: Array,
      required: true,
    },
  }
}
</script>
