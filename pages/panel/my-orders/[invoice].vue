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
import errorParser from "../../../mixins/error_parser";

export default {
  name: "MyOrderPage",
  components: {PanelOrder},
  mixins: [errorParser],
  layout: 'panel',
  data() {
    return {
      invoice: null
    }
  },
  async fetch() {
    await this.$axios.$get(`/home/invoices/${this.$route.params.invoice}`)
      .then(response => {
        this.invoice = response.data
      })
      .catch(error => this.showError(error))
  },
  methods: {
    remove(index) {
      if (index === 'all') {
        this.$axios.$delete(`/home/invoices/${this.$route.params.invoice}`)
          .then(() => {
            this.$store.commit('notification/success', 'سفارش شما با موفقیت حذف شد.')
            this.$refs.order.deleteConfirmation = false
            this.$router.back()
          })
          .catch(error => this.showError(error))
      } else {
        this.$axios.$delete(`/home/invoices/${this.$route.params.invoice}/${this.invoice.items[index].id}`)
          .then(response => {
            this.$store.commit('notification/success', 'آیتم مورد نظر از سفارش شما حذف شد.')
            this.$refs.order.deleteItemIndex = null
            this.$refs.order.deleteConfirmation = false
            if (!response) {
              this.$router.back()
            } else {
              this.invoice = response
            }
          })
          .catch(error => this.showError(error))
      }
    }
  }
}
</script>
