import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
 
export default createMiddleware({
  // 支持的语言列表
  locales: routing.locales,
  
  // 默认语言
  defaultLocale: routing.defaultLocale,
  
  // 本地化路径配置
  localePrefix: 'as-needed',
  localeDetection: false,
  
});
 
export const config = {
  // 匹配所有路径，除了api路由和静态资源
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
