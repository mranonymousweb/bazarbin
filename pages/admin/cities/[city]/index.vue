<template>
    <div>
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 md:pl-4 mb-8 md:mb-0">
          <admin-cities-Citieslist @click-street-btn="city = $event"/>
        </div>
        <div class="w-full md:w-1/2 md:pr-4">
          <admin-cities-StreetsList :city="city"/>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  layout: 'admin',
  asyncData({ params }) {
    return {city: parseInt(params.city)}
  },
}
</script>
