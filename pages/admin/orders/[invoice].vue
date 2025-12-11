<template>
  <div>
    <panel-order
      v-if="invoice"
      ref="order"
      :invoice="invoice"
      @delete="remove"
    />
  </div>
</template>

<script>
import PanelOrder from "../../../components/panel/Order";
export default {
  name: "OrderPage",
  components: {PanelOrder},
  layout: 'admin',
  data() {
    return {
      invoice: null
    }
  },
  async fetch() {
    await this.$axios.$get(`/admin/invoices/${this.$route.params.invoice}`)
      .then(response => {
        this.invoice = response
      })
  },
  methods: {
    remove(index) {
      if (index === 'all') {
        this.$axios.$delete(`/admin/invoices/${this.$route.params.invoice}`)
          .then(() => {
            this.$store.commit('notification/success', 'سفارش شما با موفقیت حذف شد.')
            this.$refs.order.deleteConfirmation = false
            this.$router.back()
          })
      } else {
        this.$axios.$delete(`/admin/invoices/${this.$route.params.invoice}/${this.invoice.items[index].id}`)
          .then(response => {
            this.$store.commit('notification/success', 'آیتم مورد نظر از سفارش حذف شد.')
            this.$refs.order.deleteItemIndex = null
            this.$refs.order.deleteConfirmation = false
            if (!response) {
              this.$router.back()
            } else {
              this.invoice = response
            }
          })
      }
    }
  }
}
</script>
