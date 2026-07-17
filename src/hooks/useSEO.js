import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to dynamically manage page-specific SEO metadata
 */
export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  schema,
  lang = 'GE'
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update HTML language attribute
    const htmlLang = lang === 'GE' ? 'ka' : lang.toLowerCase();
    document.documentElement.setAttribute('lang', htmlLang);

    // 2. Update Title
    if (title) {
      document.title = title;
    }

    // Helper to get or create a meta tag
    const getOrCreateMeta = (attributeName, attributeValue) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      return meta;
    };

    // 3. Update Standard Meta tags
    if (description) {
      const descMeta = getOrCreateMeta('name', 'description');
      descMeta.setAttribute('content', description);
    }
    if (keywords) {
      const keywordsMeta = getOrCreateMeta('name', 'keywords');
      keywordsMeta.setAttribute('content', keywords);
    }

    // 4. Update Open Graph Tags
    const currentUrl = canonical || window.location.href;
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalOgImage = ogImage || 'https://www.pharmavet.ge/logo.webp';

    getOrCreateMeta('property', 'og:url').setAttribute('content', currentUrl);
    getOrCreateMeta('property', 'og:type').setAttribute('content', ogType);
    if (finalOgTitle) {
      getOrCreateMeta('property', 'og:title').setAttribute('content', finalOgTitle);
    }
    if (finalOgDescription) {
      getOrCreateMeta('property', 'og:description').setAttribute('content', finalOgDescription);
    }
    if (finalOgImage) {
      getOrCreateMeta('property', 'og:image').setAttribute('content', finalOgImage);
    }

    // 5. Update Twitter Cards
    getOrCreateMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
    if (finalOgTitle) {
      getOrCreateMeta('name', 'twitter:title').setAttribute('content', finalOgTitle);
    }
    if (finalOgDescription) {
      getOrCreateMeta('name', 'twitter:description').setAttribute('content', finalOgDescription);
    }
    if (finalOgImage) {
      getOrCreateMeta('name', 'twitter:image').setAttribute('content', finalOgImage);
    }

    // 6. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 7. Update JSON-LD Schema
    if (schema) {
      let script = document.getElementById('seo-jsonld');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'seo-jsonld');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else {
      const script = document.getElementById('seo-jsonld');
      if (script) {
        script.remove();
      }
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    schema,
    lang,
    location.pathname
  ]);
}
