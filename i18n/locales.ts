// 站点支持的语言列表 —— 语言切换器、页脚、metadata alternates 共用，加语言只改这里
export const locales = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'русский' },
  { code: 'pt', label: 'português' },
  { code: 'es', label: 'español' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'fr', label: 'français' },
  { code: 'de', label: 'deutsch' },
] as const;

// 生成 alternates.languages 映射：默认语言（en）省略路径前缀
export function localeAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map(({ code }) => [code, code === 'en' ? path : `/${code}${path}`])
  );
}
