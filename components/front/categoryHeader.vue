<template>
  <front-item-page-header
    :item="category"
    :business="business"
    type="category"
    @change-liked="$emit('change-liked')"
    @change-bookmarked="$emit('change-bookmarked')"
  />
</template>

<script>
import FrontItemPageHeader from "./itemPageHeader";
export default {
  name: "FrontCategoryHeader",
  components: {FrontItemPageHeader},
  props: {
    category: {
      type: Object,
      required: true,
    },
    business: {
      type: Object,
      required: true,
    }
  }
}
</script>
