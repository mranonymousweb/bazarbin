<template>
  <div class="lg:fixed lg:bottom-8 lg:left-0 lg:px-8 panel-chat-container">
    <div ref="container" class="flex">
      <div
        v-if="chats.length"
        :class="['lg:w-1/3 lg:pl-4 panel-chat-contacts', isMobile && selected ? 'invisible w-0' : 'visible w-full']"
      >
        <div class="h-full bg-white py-6 rounded ">
          <Input v-model="search" placeholder="جستجو" class="px-6 mb-4"/>
          <div
            v-for="(chat, index) in chats"
            :key="chat.id"
            :class="[
            'flex items-center px-6 py-4 cursor-pointer',
            index + 1 < chats.length ? 'border-b' : '',
            chat.id === selected ? 'bg-sky-100' : '',
          ]"
            @click="selected = chat.id"
          >
            <img :src="baseUrl+chat.contact.avatar" alt="" class="chat-contact-avatar rounded-full object-cover ml-9 flex-shrink-0">
            <div class="overflow-hidden w-full">
              <div class="font-medium mb-2 flex justify-between items-center w-full">
                <span>
                  {{ chat.contact.firstname }} {{ chat.contact.lastname }}
                </span>
                <span
                  v-if="chat.unseen"
                  :class="['flex items-center justify-center rounded-full bg-red-450 text-white pt-0.5 w-6 h-6 text-sm']"
                >
                  {{ chat.unseen }}
                </span>
              </div>
              <div class="text-gray-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
                {{ sanitizeHtml(chat.last_message) || 'هنوز پیامی ارسال نشده است' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="chats.length"
        :class="['lg:w-2/3 lg:pr-4 panel-chat-messages', isMobile && !selected ? 'invisible w-0' : 'visible w-full']"
      >
        <div class="h-full bg-white p-3 lg:p-8 rounded">
          <div v-if="selected" class="flex flex-col h-full">
            <div v-if="messages.length === 0" class="text-center p-4 pt-8 text-gray-400">
              هنوز پیامی ارسال نشده است
            </div>
            <div ref="messages" class="chat-messages custom-scrollbar flex-grow overflow-y-auto mb-4 flex flex-col-reverse lg:-ml-6 lg:pl-6">
              <div
                v-for="item in messages"
                :key="item.id"
                :class="['mb-4 lg:mb-12 flex text-sm w-full md:w-4/5 chat-message', item.user_id !== userId && 'justify-end flex-row-reverse ml-0 mr-auto']"
              >
                <div class="hidden lg:block w-16 flex-shrink-0">
                  <img :src="baseUrl+$store.state.user.data.avatar" alt="" class="w-16 h-16 border border-cyan-250 rounded-full object-cover">
                </div>
                <div class="flex-grow mx-2 lg:mx-4">
                  <div :class="['flex justify-between mb-1 text-gray-500 font-medium text-xs', item.user_id !== userId && 'flex-row-reverse']">
                    <span class="hidden md:inline-block">{{ $store.state.user.data.firstname }} {{ $store.state.user.data.lastname }}</span>
                    <nuxt-link v-if="item.business" :to="`/${item.business.link}`">{{ item.business.name }}</nuxt-link>
                    <nuxt-link v-if="item.product" :to="`/${item.business_link}/${item.product.category_id}/${item.product.id}`">{{ item.product_name }}</nuxt-link>
                  </div>
                  <div
                    :class="[
                    'rounded-b-xl p-6 pb-1',
                    item.user_id === userId ? 'bg-blueGray-150 rounded-tl-xl' : 'bg-blue-450 text-white rounded-tr-xl'
                  ]"
                  >
                    <div v-if="item.attachment" class="relative">
                      <a v-if="item.id !== -1" :href="baseUrl+item.attachment" target="_blank">
                        <img :src="baseUrl+item.attachment" alt="">
                      </a>
                      <img v-else :src="`${item.id !== -1 ? baseUrl : ''}${item.attachment}`" alt="">
                      <div
                        v-if="uploading && item.id === -1"
                        class="absolute w-full h-full top-0 flex items-center justify-center"
                      >
                        <circle-progress
                          :value="upload_percent"
                          size="60"
                          class="text-green-500 cursor-pointer"
                          @click="cancelUploadFile"
                        >
                          <button class="text-white bg-black bg-opacity-70 w-14 h-14 rounded-full leading-none">
                            <i class="flaticon-034-cancel text-xl font-bold flex items-center justify-center"></i>
                          </button>
                        </circle-progress>
                      </div>
                    </div>
                    <div v-if="item.message" v-html="sanitizeHtml(item.message)"></div>
                    <div :class="['pt-2 flex justify-end items-center', item.user_id !== userId && 'flex-row-reverse']">
                      <tooltip>
                        <template #activator>
                        <span v-if="item.id !== -1" :class="['text-xs py-1', item.user_id === userId && 'text-gray-500 px-4']">
                          {{ formatDate(item.updated_at, 'HH:mm') }}
                        </span>
                        </template>
                        {{ formatDate(item.updated_at, 'jYYYY/jMM/jDD | HH:mm') }}
                      </tooltip>
                      <i v-if="item.user_id === userId && item.id !== -1" class="flaticon-151-check text-base text-emerald-400"></i>
                      <i v-else-if="item.user_id === userId" class="flaticon-167-wall-clock text-base text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div class="w-16 lg:w-20 flex-shrink-0">
                  <nuxt-link v-if="item.product"  :to="`/${item.business_link}/${item.product.category_id}/${item.product.id}`">
                    <img :src="baseUrl+item.product_picture" alt="" class="w-14 h-14 border border-cyan-250 rounded-full object-cover">
                  </nuxt-link>
                  <nuxt-link v-if="item.business" :to="`/${item.business.link}`">
                    <img :src="baseUrl+item.business.avatar" alt="" class="w-16 h-14 border border-cyan-250 rounded-lg object-contain">
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="border border-blueGray-350 px-8 py-4 rounded-3xl flex items-end">
              <div
                ref="input"
                contenteditable="true"
                class="chat-message-input custom-scrollbar text-sm flex-grow focus:outline-none overflow-auto"
                placeholder="پیام خود را بنویسید"
                @click="storeRange"
                @keyup="storeRange"
              ></div>
              <div class="flex">
                <input ref="attachmentInput" type="file" class="hidden" accept="image/png,image/jpeg,image/gif" @change="uploadAttachment"/>
                <button class="mx-6" @click="$refs.attachmentInput.click()">
                  <icons-link width="20"/>
                </button>
                <button>
                  <dropdown width="96" align="left" :container-classes="['bottom-10 mb-2 -left-4']">
                    <template #trigger>
                      <icons-smile width="20"/>
                    </template>
                    <template #content>
                      <div class="flex flex-wrap text-3xl p-4 space-x-4 space-y-4">
                        <button class="ml-4" @click="addEmoji">😂</button>
                        <button @click="addEmoji">😭</button>
                        <button @click="addEmoji">🥺</button>
                        <button @click="addEmoji">🤣</button>
                        <button @click="addEmoji">❤️</button>
                        <button @click="addEmoji">✨</button>
                        <button @click="addEmoji">😍</button>
                        <button @click="addEmoji">🙏</button>
                        <button @click="addEmoji">😊</button>
                        <button @click="addEmoji">🥰</button>
                        <button @click="addEmoji">👍</button>
                        <button @click="addEmoji">👎</button>
                        <button @click="addEmoji">💕</button>
                        <button @click="addEmoji">🤔</button>
                      </div>
                    </template>
                  </dropdown>
                </button>
                <div class="border-r border-blueGray-350 my-2 mx-6"></div>
                <button @click="sendMessage">
                  <icons-send class="w-8"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full bg-white p-6 pt-12 rounded text-center text-green-600 font-medium leading-10">
        برای شروع گفتگو با صاحبان کسب و کار
        <br>
        از طریق صفحه معرفی کسب و کار یا محصول اقدام نمایید.
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import Input from "../Input";
import IconsSend from "../icons/send";
import IconsLink from "../icons/link";
import IconsSmile from "../icons/smile";
import Tooltip from "../Tooltip";
import Dropdown from "../Dropdown";
import moment from "../../mixins/moment";
import errorParser from "../../mixins/error_parser";
import CircleProgress from "../CircleProgress";

export default {
  name: "PanelChat",
  components: {CircleProgress, Dropdown, Tooltip, IconsSmile, IconsLink, IconsSend, Input},
  mixins: [moment, errorParser],
  props: {
    chats: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      selected: +this.$route.query.c,
      message: [],
      messages: null,
      caretPos: null,
      range: null,
      uploading: false,
      upload_percent: 0,
      upload_text: '',
      uploadFileCancelTokenSource: null,
      business_id: this.$route.query.business || 0,
      product_id: this.$route.query.product || 0,
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    if (this.$route.query.business || this.$route.query.product) {
      const url = this.$route.query.business
        ? `/chat/business/${this.$route.query.business}`
        : `/chat/product/${this.$route.query.product}`
      await this.$axios.get(url)
        .then(response => {
          if (response.status === 201) {
            this.$emit('new-chat', response.data.data)
          }
          this.selected = response.data?.data?.id
        })
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.data.id
    },
    isMobile() {
      return this.$store.state.isMobile || ['sm', 'md'].includes(this.$store.state.screenSize)
    }
  },
  watch: {
    $route(value) {
      if (!value.query?.c) {
        this.selected = null
      }
    },
    selected(value) {
      if (value) {
        this.getMessages()
        let url = this.$route.path + '?c=' + value
        if (Object.keys(this.$route.query).length) {
          Object.keys(this.$route.query).forEach(key => {
            if (key !== 'c') {
              url += `&${key}=${this.$route.query[key]}`
            }
          })
        }
        this.$router.push(url)
      }
    }
  },
  beforeMount() {
    if (this.selected) {
      this.getMessages()
    }
  },
  mounted() {
    document.addEventListener('scroll', this.fixHeight)
    if (window.echoUserChannel) {
      window.echoUserChannel.listen('NewMessage', this.handleMessage);
    }
    this.$nextTick(() => {
      this.fixHeight()
      if (this.messages) {
        this.scrollToEnd()
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.fixHeight)
    if (window.echoUserChannel) {
      window.echoUserChannel.stopListening('NewMessage', this.handleMessage)
    }
  },
  methods: {
    fixHeight() {
      const y = window.scrollY < 140 ? window.scrollY : 140
      this.$refs.container.style.height = this.isMobile ? 'auto' : y ? `calc(100vh - 140px - 4rem + ${y}px)` : `calc(100vh - 140px - 4rem)`
    },
    handleMessage(e) {
      if (e.chat.id === this.selected && e.message.user_id !== this.$store.state.user.data.id) {
        this.messages = [e.message, ...this.messages]
        this.$nextTick(() => {
          const el = this.$refs.messages.querySelector('.chat-message:first-child')
          console.log({
            messages: this.$refs.messages.getBoundingClientRect(),
            scrollHeight: this.$refs.messages.scrollHeight,
            clientHeight: this.$refs.messages.clientHeight,
            scrollTop: this.$refs.messages.scrollTop,
            message: el.getBoundingClientRect(),
            hasFocus: document.hasFocus()
          });

          if (document.hasFocus() && this.$refs.messages.scrollTop === 0) {
            this.$axios.$get(`/seen/${this.messages[0].id}`)
              .then(() => {
                this.messages[0].seen = true
              })
          } else if (this.$refs.messages.scrollTop === 0) {
            this.$emit('new-message', this.selected)
            this.$refs.messages.scrollTop -= el.clientHeight + 48
          }
        })
      } else if (e.chat.id !== this.selected) {
        this.$emit('new-message', e.chat.id)
      }
    },
    sendMessage() {
      this.messages = [{
        user_id: this.userId,
        message: this.sanitizeHtml(this.$refs.input.innerHTML),
        chat_id: this.selected,
        id: -1,
      }, ...this.messages]
      this.$refs.input.innerHTML = ''
      const data = {message: this.messages[0].message, business: this.business_id, product: this.product_id}
      this.$axios.$post(`/chat/${this.selected}`, data)
        .then(response => {
          Object.keys(response.data).forEach(key => {
            this.messages[0][key] = response.data[key]
          })
        })
        .catch(error => this.showError(error))
    },
    getMessages() {
      this.messages = []
      this.$axios.$get(`/chat/${this.selected}`)
        .then(response => {
          this.messages = response.data
          this.$nextTick(() => {
            this.scrollToEnd()
          })
        })
        .catch(error => this.showError(error))
    },
    scrollToEnd() {
      this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight - this.$refs.messages.clientHeight)
    },
    storeRange() {
      this.range = window.getSelection().getRangeAt(0).cloneRange()
    },
    addEmoji(e) {
      const emoji = document.createElement('span')
      const emptyText = document.createElement('span')
      emoji.className = 'emoji'
      emoji.setAttribute('contenteditable', 'false')
      emoji.innerText = e.target.innerText

      if (!this.range || !this.range.endContainer) {
        this.$refs.input.append(emoji)
        this.$refs.input.append(emptyText)
      } else if (this.range.endContainer.nodeName === '#text') {
        const temp = document.createElement('span');
        this.range.endContainer.nodeValue && temp.append(document.createTextNode(this.range.endContainer.nodeValue.slice(0, this.range.endOffset)))
        temp.append(emoji)
        this.range.endContainer.nodeValue && temp.append(document.createTextNode(this.range.endContainer.nodeValue.slice(this.range.endOffset)))
        temp.append(emptyText)
        this.range.endContainer.replaceWith(...temp.childNodes)
      } else if (this.range.endContainer?.classList && this.range.endContainer.classList.contains('chat-message-input')) {
        this.$refs.input.append(emoji)
        this.$refs.input.append(emptyText)
      } else if (!this.range.endOffset) {
        this.range.endContainer.append(emoji)
        this.range.endContainer.append(emptyText)
      }
    },
    sanitizeHtml(html) {
      return sanitizeHtml(html, {
        allowedTags: ['br','span','div','b','strong'],
        allowedAttributes: {
          span: ['class']
        }
      })
    },
    uploadAttachment() {
      const file = this.$refs.attachmentInput.files[0]

      if (!file) return

      const formData = new FormData();
      formData.append('attachment', file);
      this.business_id && formData.append('business', this.business_id.toString());
      this.product_id && formData.append('product', this.product_id.toString());

      this.upload_percent = 0
      this.upload_text = `0 / ${this.convertSize(file.size)}`
      this.uploadFileCancelTokenSource = this.$axios.CancelToken.source();
      this.uploading = true

      this.messages = [{
        user_id: this.userId,
        message: null,
        attachment: URL.createObjectURL(file),
        chat_id: this.selected,
        id: -1,
      }, ...this.messages]

      this.$axios.$post(`/chat/${this.selected}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: this.onUploadProgress,
        cancelToken: this.uploadFileCancelTokenSource.token
      })
        .then(response => {
          this.uploading = false
          this.$refs.attachmentInput.value = ''
          Object.keys(response.data).forEach(key => {
            this.messages[0][key] = response.data[key]
          })
        })
        .catch(error => this.showError(error))
    },
    onUploadProgress(e) {
      this.upload_percent = Math.round((e.loaded * 100) / e.total)
      this.upload_text = e.loaded < e.total
        ? `${this.convertSize(e.loaded)} / ${this.convertSize(e.total)}`
        : 'در حال پردازش فایل'
    },
    cancelUploadFile() {
      this.$refs.attachmentInput.value = ''
      this.uploadFileCancelTokenSource.cancel()
      this.uploading = false
    },
    convertSize(value) {
      if (value >= 1024 * 1024) {
        return Number((value / (1024 * 1024)).toFixed(2)) + ' MB'
      }
      if (value >= 1024) {
        return Number((value / 1024).toFixed(2)) + ' KB'
      }
      return value + ' B'
    }
  }
}
</script>

<style lang="scss">

.panel-chat-container {
  width: 100%;

  > div {
    max-height: calc(100vh - 2rem);
    height: calc(100vh - 115px - 2rem);

    @media (min-width: 768px) {
      height: calc(100vh - 140px - 4rem);
    }
  }

  @media (min-width: 1280px) {
    width: calc(100% - 20rem);
  }

  @media (min-width: 1536px) {
    width: 80%;
  }
}

.chat-contact-avatar {
  width: 4.5rem;
  height: 4.5rem;
}

.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #acacac;
    border-radius: 10px;
    cursor: pointer;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999;
    cursor: pointer;
  }
}

.chat-message-input {
  min-height: 24px;
  max-height: 100px;
}

.chat-message-input:empty::before {
  content: attr(placeholder);
  color: #999;
}

.chat-message-input:empty:focus::before {
  content: "";
}

.emoji {
  font-size: 1.5em;
  line-height: 1.5;
}

</style>
