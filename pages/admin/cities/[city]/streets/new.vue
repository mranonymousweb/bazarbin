<template>
  <admin-citiesStreetForm
    :city-id="city_id"
  />
</template>

<script>
import AdminCitiesStreetForm from "~/components/admin/cities/StreetForm";
export default {
  components: {AdminCitiesStreetForm},
  layout: 'admin',
  middleware: 'load.cities',
  asyncData({ params }) {
    return {city_id: params.city}
  }
}
</script>
