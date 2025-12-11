<template>
  <admin-citiesStreetForm
    :city-id="city_id"
    :street="street"
  />
</template>

<script>
import AdminCitiesStreetForm from "~/components/admin/cities/StreetForm";
export default {
  components: {AdminCitiesStreetForm},
  layout: 'admin',
  middleware: 'load.cities',
  async asyncData(context) {
    const street = context.params.street
      ? await context.$axios.$get('admin/streets/' + context.params.street)
        .then(response => {
          return response
        })
      : null
    return {
      city_id: context.params.city,
      street,
    }
  },
  data() {
    return {
      street: null
    }
  }
}
</script>
