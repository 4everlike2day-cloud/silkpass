/** @type {import('next').NextConfig} */
const nextConfig = {
  // Сайт собирается в статические файлы (папка out/) и публикуется на Cloudflare Pages.
  output: 'export',
  images: {unoptimized: true},
}
export default nextConfig
