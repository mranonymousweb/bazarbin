import numberToWord from './numberToWord'
export default {
  mixins: [numberToWord],
  methods: {
    priceToStr(value) {
      if (!value) {
        return ''
      }
      const val = parseInt(value.toString().replaceAll(',', ''))
      return val > 10 ? this.numberToWord(Math.floor(val)) + ' تومان' : ''
    }
  }
}
