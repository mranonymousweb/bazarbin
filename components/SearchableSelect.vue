<template>
  <div class="searchable-select">
    <label v-if="label" :class="'block pb-2 ' + labelClass" v-text="label"></label>
    <div class="relative">
      <div
        ref="valueEl"
        :class="inputClass"
        @click="open = !open"
      >{{ selectedName }}</div>
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
        :class="['bg-white p-4 shadow rounded-b absolute searchable-select-results text-sm sm:text-base z-50', resultsClass]"
        @keyup.up="prevItem"
        @keyup.down="nextItem"
        @keyup.enter="select(filteredList[active])"
      >
        <input
          ref="search"
          v-model="searchKey"
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
  name: "SearchableSelect",
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
    modelValue: {
      type: [String, Number],
      default: null
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
  emits: ['update:modelValue', 'search'],
  data() {
    return {
      open: false,
      searchKey: '',
      active: null
    }
  },
  computed: {
    selectedName() {
      const selected = this.items.find(x => x[this.idKey] === this.modelValue)
      return selected ? selected[this.nameKey] : this.placeholder
    },
    filteredList() {
      return this.searchKey
        ? this.items.filter(x => x[this.nameKey]?.includes(this.searchKey) || (this.tagsKey && x[this.tagsKey]?.includes(this.searchKey)))
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
        this.$nextTick(() => this.$refs.search?.focus())
      }
      this.fixListPosition()
    }
  },
  mounted() {
    document.body.appendChild(this.$refs.results)
    window.addEventListener("resize", this.fixListPosition);
    window.addEventListener("click", this.closeOnClickOutside);
  },
  unmounted() {
    if (this.$refs.results && this.$refs.results.parentNode) {
      this.$refs.results.parentNode.removeChild(this.$refs.results)
    }
    window.removeEventListener("resize", this.fixListPosition);
    window.removeEventListener("click", this.closeOnClickOutside);
  },
  methods: {
    select(item) {
      if (!item) return
      this.open = false
      this.$emit('update:modelValue', item[this.idKey])
    },
    fixListPosition() {
      if (!this.$refs.valueEl || !this.$refs.results) return
      const v = this.$refs.valueEl.getBoundingClientRect()
      const r = this.$refs.results
      r.style.minWidth = typeof this.resultListWidth === 'number' ? (v.width * this.resultListWidth) + 'px' : this.resultListWidth
      r.style.top = (v.top + v.height + window.scrollY) + 'px'
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
      const ul = this.$refs.results?.querySelector('ul')
      const li = this.$refs.results?.querySelector('.highlighted')
      if (!ul || !li) return
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
