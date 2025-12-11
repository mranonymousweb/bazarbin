export default {
  methods: {
    numberToWord(num, level = 0) {
      function isCorrectNumber(num) {
        return /^-?(\d{1,3},?)+(\.?\d+)?$/.test(num);
      }
      if (num === null) {
        return "";
      }
      if (level===0 && typeof num === "string" && isCorrectNumber(num)) {
        num = parseInt(num.replace(/,/g,""));
      }

      if (num<0) {
        num = num * -1;
        return "منفی " + this.numberToWord(num, level);
      }
      if (num === 0) {
        if (level === 0) {
          return "صفر";
        } else {
          return "";
        }
      }
      let result = ""
      const yekan = [" یک ", " دو ", " سه ", " چهار ", " پنج ", " شش ", " هفت ", " هشت ", " نه "]
      const dahgan = [" بیست ", " سی ", " چهل ", " پنجاه ", " شصت ", " هفتاد ", " هشتاد ", " نود "]
      const sadgan = [" یکصد ", " دویست ", " سیصد ", " چهارصد ", " پانصد ", " ششصد ", " هفتصد ", " هشتصد ", " نهصد "]
      const dah = [" ده ", " یازده ", " دوازده ", " سیزده ", " چهارده ", " پانزده ", " شانزده ", " هفده ", " هیجده ", " نوزده "]

      if (level > 0) {
        result += " و ";
        level -= 1;
      }
      if (num < 10) {
        result += yekan[num - 1];
      } else if (num < 20) {
        result += dah[num - 10];
      } else if (num < 100) {
        result += dahgan[parseInt(num / 10, 10) - 2] +  this.numberToWord(num % 10, level + 1);
      } else if (num < 1000) {
        result += sadgan[parseInt(num / 100, 10) - 1] + this.numberToWord(num % 100, level + 1);
      } else if (num < 1000000) {
        result += this.numberToWord(parseInt(num / 1000, 10), level) + " هزار " + this.numberToWord(num % 1000, level + 1);
      } else if (num < 1000000000) {
        result += this.numberToWord(parseInt(num / 1000000, 10), level) + " میلیون " + this.numberToWord(num % 1000000, level + 1);
      }
      return result;
    }
  }
}
