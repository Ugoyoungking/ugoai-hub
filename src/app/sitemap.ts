
import { MetadataRoute } from 'next';

const APP_URL = "https://ugo-ai-studio.vercel.app"; // TODO: Replace with your actual production URL

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/login',
    '/signup',
    '/forgot-password',
    '/faq',
    '/privacy',
    '/terms',
    '/dashboard',
    '/dashboard/ai-agents',
    '/dashboard/workflow-builder',
    '/dashboard/app-generator',
    '/dashboard/website-builder',
    '/dashboard/video-generator',
    '/dashboard/knowledge-base',
    '/dashboard/real-time-collab',
    '/dashboard/notifications',
    '/dashboard/settings',
  ];

  return routes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
