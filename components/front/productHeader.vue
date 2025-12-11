<template>
  <front-item-page-header
    :item="item"
    type="product"
    @change-liked="$emit('change-liked')"
    @change-bookmarked="$emit('change-bookmarked')"
  />
</template>

<script>
import FrontItemPageHeader from "./itemPageHeader";
export default {
  name: "FrontProductHeader",
  components: {FrontItemPageHeader},
  props: {
    item: {
      type: Object,
      required: true,
    }
  }
}
</script>
