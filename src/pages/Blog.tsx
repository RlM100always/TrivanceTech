import React, { useMemo, useState } from 'react';
import { Search, Calendar, ArrowRight, Clock, Eye, TrendingUp, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts, blogCategories } from '../data/blogPosts';
import SEO from '../components/seo/SEO';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';
import { StaggerContainer, StaggerItem } from '../components/ui/motion/Reveal';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const subscribe = async () => {
    if (!newsletterEmail.trim() || subscribeStatus === 'loading') return;
    setSubscribeStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      if (!res.ok) throw new Error('failed');
      setSubscribeStatus('done');
      setNewsletterEmail('');
    } catch {
      setSubscribeStatus('error');
    }
  };

  const filteredPosts = useMemo(
    () =>
      blogPosts.filter((post) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term));
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [searchTerm, selectedCategory]
  );

  const isBrowsingAll = selectedCategory === 'all' && !searchTerm;
  const featuredPost = blogPosts.find((post) => post.featured);

  // The featured post only gets its own hero card when nothing is filtered. Once the
  // reader searches or picks a topic it must fall back into the grid, otherwise a
  // query that matches only the featured post renders an empty list.
  const gridPosts = isBrowsingAll
    ? filteredPosts.filter((post) => post.id !== featuredPost?.id)
    : filteredPosts;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AiTechWorlds Tech Insights & Innovation',
    url: 'https://www.aitechworlds.com/blog',
    description:
      'Practical insights on web development, mobile apps, AI/ML, cybersecurity, and remote-first tech from the AiTechWorlds team.',
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://www.aitechworlds.com/blog/${post.id}`,
      datePublished: post.publishDate,
      author: { '@type': 'Person', name: post.author },
    })),
  };

  return (
    <PageShell>
      <SEO
        title="Tech Insights & Innovation Blog"
        description="Practical, no-hype insights on web development, mobile apps, AI/ML, cybersecurity, cloud, and remote-first tech culture from the AiTechWorlds team."
        path="/blog"
        keywords={['tech blog', 'web development blog', 'AI insights', 'software development tips', 'AiTechWorlds blog']}
        jsonLd={blogJsonLd}
      />

      <PageHero
        eyebrow={`${blogPosts.length} articles · ${blogCategories.length - 1} topics`}
        eyebrowIcon={<TrendingUp size={13} />}
        title="Tech insights & innovation"
        highlight="innovation"
        description="Practical, no-hype playbooks on web, mobile, AI, and security — written from real client work, not from a content calendar."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]}
      />

      {/* Search + topics */}
      <Section tone="muted" compact>
        <GlassCard interactive={false} className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                aria-label="Search articles"
                placeholder="Search articles, topics, tags…"
                className="w-full rounded-xl border border-neutral-300 bg-white/80 py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-500 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-neutral-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'border border-neutral-200 bg-white/70 text-neutral-600 backdrop-blur hover:border-primary-300 hover:text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-primary-300'
                  }`}
                >
                  {category === 'all' ? 'All Topics' : category}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400" aria-live="polite">
          Showing {filteredPosts.length} of {blogPosts.length} articles
        </p>
      </Section>

      {/* Featured */}
      {featuredPost && isBrowsingAll && (
        <Section tone="plain" compact>
          <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-600 dark:text-primary-400">
            <TrendingUp size={14} /> Featured
          </h2>

          <GlassCard as="article" flush className="group">
            <Link to={`/blog/${featuredPost.id}`} className="block md:flex">
              <div className="relative overflow-hidden md:w-1/2">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 md:w-1/2">
                <span className="mb-4 self-start rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {featuredPost.category}
                </span>
                <h3 className="text-2xl font-bold leading-snug text-neutral-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-3xl">
                  {featuredPost.title}
                </h3>
                <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-400">{featuredPost.excerpt}</p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <img
                      src={featuredPost.authorImage}
                      alt=""
                      loading="lazy"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{featuredPost.author}</p>
                      <p className="flex flex-wrap items-center gap-x-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(featuredPost.publishDate).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {featuredPost.readTime}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="hidden shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors group-hover:bg-primary-700 sm:inline-flex">
                    Read more <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </GlassCard>
        </Section>
      )}

      {/* Grid */}
      <Section tone="plain" compact>
        {gridPosts.length > 0 ? (
          <StaggerContainer
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8"
            stagger={0.07}
          >
            {gridPosts.map((post) => (
              <StaggerItem key={post.id}>
                <GlassCard as="article" flush className="group h-full">
                  <Link to={`/blog/${post.id}`} className="flex h-full flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow backdrop-blur dark:bg-neutral-900/90 dark:text-white">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-2 text-xl font-bold text-neutral-900 transition-colors duration-200 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-neutral-200/70 pt-4 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.authorImage}
                            alt=""
                            loading="lazy"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">{post.author}</span>
                        </div>
                        <span className="inline-flex items-center gap-1">
                          <Eye size={14} />
                          {post.views > 999 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <GlassCard interactive={false} className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-white/5">
              <Search size={32} />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">No articles found</h2>
            <p className="mx-auto mt-2 max-w-md text-neutral-600 dark:text-neutral-400">
              Try a different keyword or browse all topics.
            </p>
            <div className="mt-6 flex justify-center">
              <ActionButton onClick={clearFilters}>Clear Filters</ActionButton>
            </div>
          </GlassCard>
        )}
      </Section>

      {/* Newsletter */}
      <Section tone="accent" compact>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Never miss a practical guide
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Get our best breakdowns on web, mobile, AI, and security delivered straight to your inbox.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              subscribe();
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@company.com"
              value={newsletterEmail}
              onChange={(e) => {
                setNewsletterEmail(e.target.value);
                if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
              }}
              className="flex-1 rounded-xl border border-neutral-300 bg-white/80 px-4 py-3 text-neutral-900 placeholder-neutral-500 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-neutral-400"
            />
            <ActionButton type="submit" size="lg" disabled={subscribeStatus === 'loading'} className="shrink-0">
              {subscribeStatus === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : subscribeStatus === 'done' ? (
                <>
                  Subscribed <Check size={18} />
                </>
              ) : (
                'Subscribe'
              )}
            </ActionButton>
          </form>

          <p aria-live="polite" className="mt-3 text-sm">
            {subscribeStatus === 'error' && (
              <span className="text-red-600 dark:text-red-400">Something went wrong — please try again.</span>
            )}
            {subscribeStatus === 'done' && (
              <span className="text-neutral-600 dark:text-neutral-400">
                You're on the list — watch your inbox.
              </span>
            )}
          </p>
        </div>
      </Section>
    </PageShell>
  );
};

export default Blog;
