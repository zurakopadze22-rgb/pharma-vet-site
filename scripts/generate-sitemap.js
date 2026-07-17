import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsData } from '../src/data/products.js';
import { blogArticles } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://www.pharmavet.ge';

// Static routes
const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/products', priority: '0.9', changefreq: 'weekly' },
  { url: '/partners', priority: '0.8', changefreq: 'monthly' },
  { url: '/become-partner', priority: '0.8', changefreq: 'monthly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
];

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static routes
staticRoutes.forEach(route => {
  xml += `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
});

// Add dynamic product routes
productsData.forEach(product => {
  xml += `  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add dynamic blog routes
blogArticles.forEach(article => {
  xml += `  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${article.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

xml += `</urlset>`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Sitemap successfully generated at: ${outputPath}`);
