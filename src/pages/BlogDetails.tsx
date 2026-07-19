import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, Share2, Tag, HelpCircle, List, CheckCircle, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO, { SITE_URL } from '../components/seo/SEO';
import mermaid from 'mermaid';

const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const extractHeadings = (html: string) => {
  const headings: { id: string; text: string }[] = [];
  const re = /<h2[^>]*>(.*?)<\/h2>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    headings.push({ id: slugify(text), text });
  }
  return headings;
};

const withHeadingIds = (html: string) =>
  html.replace(/<h2>(.*?)<\/h2>/g, (_match, text: string) => `<h2 id="${slugify(text)}">${text}</h2>`);

/**
 * Removes the common leading indentation from a block of text. Diagram sources
 * live inside indented HTML template literals, but mermaid's parser treats that
 * leading whitespace as significant and fails on it.
 */
const dedent = (text: string) => {
  const lines = text.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^[ \t]*/)?.[0].length ?? 0);
  const common = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(common)).join('\n');
};

const BlogDetails: React.FC = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  // Mermaid bakes theme colours into the rendered SVG, so diagrams have to be
  // re-rendered when the user toggles dark mode rather than restyled by CSS.
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [id]);

  const headings = useMemo(() => (post ? extractHeadings(post.content) : []), [post]);
  const processedContent = useMemo(() => (post ? withHeadingIds(post.content) : ''), [post]);

  // Wide comparison tables would otherwise stretch the page on phones; give each
  // its own scroll container instead.
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    root.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.replaceWith(wrapper);
      wrapper.appendChild(table);
    });
  }, [processedContent]);

  useEffect(() => {
    let cancelled = false;
    const root = articleRef.current;
    if (!root) return;

    // startOnLoad would race with the explicit run() below, processing nodes
    // twice; drive rendering manually instead.
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    });

    // Scope every query to this article. The previous version queried the whole
    // document, so it also picked up nodes belonging to other mounted content.
    root.querySelectorAll('pre.mermaid').forEach((pre) => {
      const div = document.createElement('div');
      div.className = 'mermaid';
      // Diagram source is indentation-sensitive; the HTML literal indents the
      // <pre> body, which mermaid rejects. Strip the common leading indent.
      div.textContent = dedent(pre.textContent ?? '');
      pre.replaceWith(div);
    });

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.mermaid'));
    if (nodes.length === 0) return;

    // run() is async and rejects on a malformed diagram. Unhandled, that left
    // every diagram on the page blank with nothing in the console.
    mermaid
      .run({ nodes, suppressErrors: false })
      .catch((err) => {
        if (cancelled) return;
        console.error('[BlogDetails] mermaid render failed:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [processedContent, isDark]);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Blog Post Not Found</h1>
            <Link
              to="/blog"
              className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sharePost = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate ?? post.publishDate,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'AiTechWorlds',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.id}` },
    keywords: post.keywords.join(', '),
  };

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  const jsonLd = faqJsonLd ? [articleJsonLd, faqJsonLd] : articleJsonLd;

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .concat(blogPosts.filter((p) => p.id !== post.id && p.category !== post.category))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <SEO
        title={post.title}
        description={post.metaDescription}
        path={`/blog/${post.id}`}
        image={post.featuredImage}
        type="article"
        publishedTime={post.publishDate}
        modifiedTime={post.modifiedDate}
        author={post.author}
        keywords={post.keywords}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <header className="relative">
        <div className="absolute inset-0">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-neutral-900/30" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-20">
          <Link
            to="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-white/80 text-sm">
            <div className="flex items-center">
              <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full mr-3 ring-2 ring-white/30" />
              <span className="font-medium text-white">{post.author}</span>
            </div>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {post.readTime}
            </span>
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              {post.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center mb-4 text-neutral-900 dark:text-white font-semibold">
                <List size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                On this page
              </div>
              <nav className="space-y-2 border-l-2 border-neutral-200 dark:border-neutral-700 pl-4">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
              <button
                onClick={sharePost}
                className="mt-8 flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-lg shadow hover:shadow-md transition-all duration-200 text-sm font-medium"
              >
                <Share2 size={16} className="mr-2" />
                Share this article
              </button>
            </div>
          </aside>

          {/* Article */}
          <article className="min-w-0">
            <div
              ref={articleRef}
              className="blog-content prose prose-base sm:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Inline CTA */}
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 p-8 text-white text-center shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Turn this insight into your next project</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Whether you're starting from scratch or fixing what's already built, our remote-first team ships production-grade work — fast, transparent, and built around your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Talk to our team
                  <ArrowRight size={18} className="inline ml-2" />
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Browse services
                </Link>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-10">
              <div className="flex items-center mb-3">
                <Tag size={20} className="text-neutral-500 dark:text-neutral-400 mr-2" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">Tagged with</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-12 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <HelpCircle size={22} className="text-primary-600 dark:text-primary-400 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {post.faqs.map((faq, index) => (
                    <div key={index} className="border border-neutral-100 dark:border-neutral-700 rounded-xl p-5">
                      <p className="flex items-start font-semibold text-neutral-900 dark:text-white mb-2">
                        <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed pl-7">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            <div className="mt-10 flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
              <img src={post.authorImage} alt={post.author} className="w-16 h-16 rounded-full flex-shrink-0" />
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">{post.author}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Engineer at AiTechWorlds — writing practical, no-hype guides drawn from real client work across web, mobile, AI, and security.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">Keep reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white rounded-full text-sm font-medium">
                        {relatedPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-auto">
                      <Calendar size={14} className="mr-1" />
                      {new Date(relatedPost.publishDate).toLocaleDateString()}
                      <Clock size={14} className="ml-3 mr-1" />
                      {relatedPost.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Get the next guide in your inbox</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-xl mx-auto">
            Practical, no-fluff insights on web, mobile, AI, and security — the kind we wish more teams had before they started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Link
              to="/contact"
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
