<template>
  <div >
    <admin-cities-CityForm
      v-if="city"
      :city="city"
    />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'load.cities',
  async asyncData(context) {
    const city = context.params.city
      ? await context.$axios.$get('admin/cities/' + context.params.city)
        .then(response => {
          return response
        })
      : null
    return { city }
  }
}
</script>
