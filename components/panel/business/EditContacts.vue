<template>
  <div class="bg-white rounded p-3 lg:p-6 business-contact-info">
    <div class="flex items-center">
      <i class="text-base flaticon-135-phone-call-1 ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">اطلاعات تماس</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <slide-down :open="open">
      <div class="flex flex-wrap md:flex-nowrap p-1 pt-4">
        <div class="w-full md:w-80">
          <div v-for="template in templates" :key="template.id" class="flex items-center bg-gray-50 rounded h-12 md:h-14">
            <img :src="baseUrl + template.picture" alt="" class="w-8 h-8 mx-2 md:mx-3">
            <span class="flex-grow flex-shrink whitespace-nowrap">{{ template.name }}</span>
            <button class="mx-2 md:mx-3" @click="addContact(template.id)">
              <i class="flaticon-043-plus"></i>
            </button>
          </div>
        </div>
        <div v-if="templates.length" class="list mt-4 md:mt-0 md:pr-4 space-y-2 md:space-y-4">
          <panel-business-contact-info
            v-for="(contact, index) in contacts"
            :key="index"
            v-model="contacts[index]"
            :template="templates.find(x => x.id === contact.template_id)"
            :exist="exist"
            @delete="contacts.splice(index,1)"
          />
        </div>
      </div>
    </slide-down>

    <table v-if="!open && false" class="w-full text-sm">
      <thead>
      <tr class="bg-gray-50 h-12">
        <th class="text-right px-2 w-60">نوع</th>
        <th class="text-right px-2">عنوان</th>
        <th class="text-right px-2">مقدار</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(item,index) in contacts" :key="index">
        <td class="p-2">
          <div class="flex items-center">
            <img
              v-if="templates.length"
              :src="baseUrl + templates.find(x => x.id === item.template_id).picture" alt=""
              class="w-7 h-7 mx-3">
            <span v-if="templates.length">{{ templates.find(x => x.id === item.template_id).name }}</span>
          </div>
        </td>
        <td class="p-2">{{ item.title }}</td>
        <td class="p-2">{{ item.value }}</td>
      </tr>
      </tbody>

    </table>

  </div>
</template>

<script>
import PanelBusinessContactInfo from "./ContactInfo";
export default {
  name: "PanelBusinessEditContacts",
  components: {PanelBusinessContactInfo},
  props: {
    value: {
      type: Array,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: !this.exist,
      contacts: [],
      templates: [],
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('home/contacts')
      .then(response => {
        this.templates = response
      })
  },
  watch: {
    value() {
      this.contacts = this.value
    },
    contacts() {
      this.$emit('input', this.contacts)
    }
  },
  created() {
    this.contacts = this.value
  },
  methods: {
    addContact(id) {
      this.contacts.push({
        title: '',
        value: '',
        template_id: id,
        id: 0
      })
    }
  }
}
</script>

<style lang="scss">
.business-contact-info {
  .list {
    width: 480px;
    max-width: 100%;
  }
}
</style>
