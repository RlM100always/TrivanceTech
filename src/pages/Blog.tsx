import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Clock, Eye, TrendingUp, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts, blogCategories } from '../data/blogPosts';
import SEO from '../components/seo/SEO';

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

  const filteredPosts = blogPosts.filter((post) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.tags.some((tag) => tag.toLowerCase().includes(term));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id);

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <SEO
        title="Tech Insights & Innovation Blog"
        description="Practical, no-hype insights on web development, mobile apps, AI/ML, cybersecurity, cloud, and remote-first tech culture from the AiTechWorlds team."
        path="/blog"
        keywords={['tech blog', 'web development blog', 'AI insights', 'software development tips', 'AiTechWorlds blog']}
        jsonLd={blogJsonLd}
      />

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <TrendingUp size={16} className="mr-2" />
            {blogPosts.length} articles · {blogCategories.length - 1} topics
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Tech Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-400">Innovation</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
            Practical, no-hype playbooks on web, mobile, AI, and security — written from real client work, not from a content calendar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
          <div className="relative w-full lg:max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search articles, topics, tags…"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && !searchTerm && (
          <div className="mb-16">
            <h2 className="flex items-center text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-5">
              <TrendingUp size={16} className="mr-2" /> Featured
            </h2>
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group block bg-white dark:bg-neutral-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative overflow-hidden">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                  <span className="self-start px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <img src={featuredPost.authorImage} alt={featuredPost.author} className="w-9 h-9 rounded-full mr-3" />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{featuredPost.author}</p>
                        <p className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(featuredPost.publishDate).toLocaleDateString()}
                          <Clock size={12} className="ml-3 mr-1" />
                          {featuredPost.readTime}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
                      Read more <ArrowRight size={16} className="ml-2" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group">
                <article className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white rounded-full text-sm font-medium shadow">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center">
                        <img src={post.authorImage} alt={post.author} className="w-8 h-8 rounded-full mr-2" />
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{post.author}</span>
                      </div>
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {post.views > 999 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-neutral-600 dark:text-neutral-300">Try a different keyword or browse all topics.</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 p-8 md:p-12 text-white text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Never miss a practical guide</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get our best breakdowns on web, mobile, AI, and security delivered straight to your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              subscribe();
            }}
          >
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={newsletterEmail}
              onChange={(e) => {
                setNewsletterEmail(e.target.value);
                if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
            />
            <button
              type="submit"
              disabled={subscribeStatus === 'loading'}
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-100 disabled:opacity-70 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {subscribeStatus === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : subscribeStatus === 'done' ? (
                <>
                  Subscribed <Check size={18} />
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          {subscribeStatus === 'error' && (
            <p className="mt-3 text-sm text-white/80">Something went wrong — please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
