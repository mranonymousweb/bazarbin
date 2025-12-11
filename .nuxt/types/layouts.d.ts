import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "admin" | "default" | "panel"
declare module 'nuxt/app' {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}