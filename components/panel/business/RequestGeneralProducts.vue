<template>
  <div>

    <div>
      درخواست ثبت محصول جدید
    </div>

    <div class="flex justify-center">
      <submit-btn
        label="مرحله قبلی"
        icon="flaticon-065-right-arrow-1"
        class="mx-2"
        @click="$emit('click-prev')"
      />
      <submit-btn
        label="افزودن"
        icon="flaticon-043-plus"
        class="mx-2"
      />
    </div>
  </div>
</template>

<script>
import SubmitBtn from "../../SubmitBtn";
export default {
  name: "PanelBusinessRequestGeneralProducts",
  components: {SubmitBtn},
  props: {
    category: {
      type: Object,
      required: true
    }
  },
}
</script>
