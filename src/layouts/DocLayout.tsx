import { type View } from 'vitarx'
import { RouterView } from 'vitarx-router'
import DocFooter from '../components/DocFooter.jsx'
import DocSidebar from '../components/DocSidebar.jsx'
import SideBarButton from '../components/SideBarButton.jsx'
import { useSidebarState } from '../shared/menu.js'
import '../assets/styles/layout.scss'

/**
 * 将文本复制到剪贴板
 * @param text 要复制的字符串
 * @returns Promise<boolean> 表示复制是否成功
 */
export async function copyToClipboard(text: string): Promise<void> {
  // 优先使用 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
  }

  // 兼容旧浏览器：使用 textarea + execCommand
  const textarea = document.createElement('textarea')
  textarea.value = text

  // 避免影响页面布局
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.left = '-9999px'

  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  document.execCommand?.('copy')
  document.body.removeChild(textarea)
}
export default function DocLayout(): View {
  const sidebarState = useSidebarState()
  async function handleClick(e: MouseEvent): Promise<void> {
    e.stopPropagation()
    const target = e.target as HTMLElement
    if (!target.closest('.v-source-code__copy')) return void 0
    if (target.closest('.success')) return void 0
    const text = target.parentElement!.querySelector('code')?.textContent ?? ''
    try {
      await copyToClipboard(text)
      target.classList.add('success')
      setTimeout(() => {
        target.classList.remove('success')
      }, 1000)
    } catch (e) {
      alert(`failed to copy code：${String(e)}`)
    }
  }
  return (
    <div
      class="default-theme-doc-layout"
      data-sidebar-open={sidebarState.value}
      onClick={handleClick}
    >
      <DocSidebar />
      <main class="doc-container">
        <RouterView />
        <DocFooter />
      </main>
      <SideBarButton />
    </div>
  )
}
