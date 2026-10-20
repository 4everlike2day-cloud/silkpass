'use client'
import {useEffect, useState} from 'react'

// Переключатель светлой и тёмной темы. Выбор хранится в браузере (w2uz-theme).
// Пока посетитель ничего не выбрал, сайт следует теме его устройства.
type Theme = 'light' | 'dark'
const KEY = 'w2uz-theme'

const systemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export default function ThemeToggle({label}: {label: {light: string; dark: string}}) {
  const [theme, setTheme] = useState<Theme | null>(null)
  useEffect(() => {
    const t = document.documentElement.dataset.theme as Theme | undefined
    setTheme(t === 'light' || t === 'dark' ? t : systemTheme())
  }, [])
  const toggle = () => {
    const next: Theme = (theme || systemTheme()) === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(KEY, next)
    } catch {}
    setTheme(next)
  }
  const dark = theme === 'dark'
  const title = dark ? label.light : label.dark
  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={title} title={title}>
      {dark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      )}
    </button>
  )
}

// Скрипт для <head>: ставит тему до отрисовки страницы, чтобы не было вспышки светлого фона.
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`
