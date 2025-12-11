<template>
  <div class="searchable-select">
    <label v-if="label" :class="'block pb-2 ' + labelClass" v-text="label"></label>
    <div class="relative">
      <div
        ref="value"
        :class="inputClass"
        @click="open = !open"
      >
        <ul
          v-if="selectedItems.length"
          class="flex flex-wrap pt-2"
        >
          <li
            v-for="item in selectedItems"
            :key="item[idKey]"
            class="inline-block bg-blue-450 px-2 py-1 rounded mx-1 mb-2 text-white"
          >
            <span>{{ item[nameKey] }}</span>
            <i class="flaticon-034-cancel cursor-pointer text-xs" @click="unselect(item[idKey])"></i>
          </li>
        </ul>
        <span
          v-else
          class="text-gray-400"
        >
          {{ placeholder }}
        </span>
      </div>
      <i
        :class="['absolute left-1 sm:left-4 top-3 sm:top-4 text-cyan-250 h-5 w-5 transition-all transform', open ? 'rotate-180' : '']"
        @click="open = !open"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </i>
      <slot name="icon"/>
      <div
        v-show="open"
        ref="results"
        :class="['bg-white p-4 shadow rounded-b absolute searchable-select-results text-sm sm:text-base', resultsClass]"
        @keyup.up="prevItem"
        @keyup.down="nextItem"
        @keyup.enter="select(filteredList[active])"
      >
        <input
          ref="search"
          v-model="searchKey"
          @input="searchKey = $refs.search.value"
          type="text"
          placeholder="جستجو..."
          class="bg-gray-50 rounded w-full p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-450 mb-4 text-sm sm:text-base">
        <ul
          class="searchable-select-results max-h-72 overflow-y-auto relative"
        >
          <li
            v-for="(item,index) in filteredList"
            :key="item[idKey]"
            :class="['hover:bg-gray-50 px-4 py-2 cursor-pointer', active === index ? 'bg-gray-50 highlighted' : '']"
            @click="select(item)"
            v-text="item[nameKey]"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchableMultipleSelect",
  props: {
    label: {
      type: String,
      default: null
    },
    inputClass: {
      type: String,
      default: 'bg-gray-50 rounded w-full p-2 pl-6 sm:pl-12 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-blue-450 h-12 flex items-center'
    },
    labelClass: {
      type: String,
      default: ''
    },
    resultsClass: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    idKey: {
      type: String,
      default: 'id'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    tagsKey: {
      type: String,
      default: ''
    },
    resultListWidth: {
      type: [Number,String],
      default: 1
    },
    xAnchor: {
      type: [Number,Array],
      default: 0
    },
    right: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      open: false,
      searchKey: '',
      active: null
    }
  },
  computed: {
    selectedItems() {
      return this.items.filter(x => this.value.includes(x[this.idKey].toString()) || this.value.includes(x[this.idKey]))
    },
    filteredList() {
      return this.searchKey
        ? this.items.filter(x => x[this.nameKey].includes(this.searchKey) || (this.tagsKey && x[this.tagsKey].includes(this.searchKey)))
        : this.items
    }
  },
  watch: {
    searchKey(value) {
      this.active = null
      this.$emit('search', value)
    },
    open(value) {
      if (value) {
        this.$nextTick(() => this.$refs.search.focus())
      }
      this.fixListPosition()
    }
  },
  mounted() {
    document.querySelector('#__layout > div').appendChild(this.$refs.results)
    window.addEventListener("resize", this.fixListPosition);
    window.addEventListener("click", this.closeOnClickOutside);
  },
  destroyed() {
    window.removeEventListener("resize", this.fixListPosition);
    window.removeEventListener("click", this.closeOnClickOutside);
  },
  methods: {
    select(item) {
      this.open = false
      this.$emit('input', [...this.value, item[this.idKey]])
    },
    unselect(id) {
      const newValue = [...this.value]
      const index = newValue.indexOf(id);
      if (index > -1) {
        newValue.splice(index, 1);
      }
      this.$emit('input', newValue)
    },
    fixListPosition() {
      const v = this.$refs.value.getBoundingClientRect()
      const r = this.$refs.results
      r.style.minWidth = typeof this.resultListWidth === 'number' ? (v.width * this.resultListWidth) + 'px' : this.resultListWidth
      /* r.style.left = typeof this.xAnchor === 'number'
        ? (v.left + v.width * this.xAnchor) + 'px'
        : (v.left) + 'px' */
      r.style.top = (v.top + v.height - document.body.getBoundingClientRect().top ) + 'px'
      r.style.right = this.right !== null ? this.right : (document.body.clientWidth - (v.left + v.width)) + 'px'
    },
    closeOnClickOutside(event) {
      const e1 = event.target.closest('.searchable-select')
      const e2 = event.target.closest('.searchable-select-results')
      if (e1 !== this.$el && e2 !== this.$refs.results) {
        this.open = false
      }
    },
    prevItem() {
      if (this.active === 0)
        return

      this.active = this.active === null
        ? this.filteredList.length - 1
        : this.active - 1

      this.$nextTick(() => this.fixActiveView())
    },
    nextItem() {
      if (this.active + 1 === this.filteredList.length)
        return

      this.active = this.active === null
        ? 0
        : this.active + 1

      this.$nextTick(() => this.fixActiveView())
    },
    fixActiveView() {
      const ul = this.$refs.results.querySelector('ul')
      const li = this.$refs.results.querySelector('.highlighted')
      if (ul.clientHeight + ul.scrollTop < li.offsetTop + li.clientHeight) {
        ul.scrollTop = li.offsetTop + li.clientHeight - ul.clientHeight
      }
      else if (ul.scrollTop > li.offsetTop) {
        ul.scrollTop = li.offsetTop
      }
    }
  }
}
</script>

<style lang="scss">

.searchable-select-results ul{
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa9b9
  }

  &::-webkit-scrollbar-thumb {
    background: #737cff;
  }
}

</style>
