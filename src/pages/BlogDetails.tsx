import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Eye, Share2, Tag, MessageSquare } from 'lucide-react';

const BlogDetails: React.FC = () => {
  const { id } = useParams();

  // Sample blog data (in a real app, this would come from an API)
  const blogPosts = [
    {
      id: '1',
      title: 'The Future of Web Development in Bangladesh',
      content: `
        <p>The web development landscape in Bangladesh is experiencing unprecedented growth, driven by a combination of technological advancement, government initiatives, and a growing pool of talented developers.</p>
        
        <h2>Current State of Web Development</h2>
        <p>Bangladesh has emerged as a significant player in the global IT outsourcing market, with web development being one of the key service areas. The country's IT sector has been growing at an average rate of 40% annually, contributing significantly to the national economy.</p>
        
        <h2>Emerging Technologies</h2>
        <p>Several cutting-edge technologies are shaping the future of web development in Bangladesh:</p>
        <ul>
          <li><strong>Progressive Web Apps (PWAs):</strong> Combining the best of web and mobile apps</li>
          <li><strong>Jamstack Architecture:</strong> Providing better performance and security</li>
          <li><strong>Serverless Computing:</strong> Reducing infrastructure costs and complexity</li>
          <li><strong>AI Integration:</strong> Enhancing user experiences with intelligent features</li>
        </ul>
        
        <h2>Challenges and Opportunities</h2>
        <p>While the growth is promising, there are challenges that need to be addressed:</p>
        <ul>
          <li>Skill gap in emerging technologies</li>
          <li>Need for better infrastructure</li>
          <li>Competition from other outsourcing destinations</li>
        </ul>
        
        <p>However, these challenges also present opportunities for growth and innovation. Companies that invest in training and adopt new technologies will be well-positioned for success.</p>
        
        <h2>The Road Ahead</h2>
        <p>The future looks bright for web development in Bangladesh. With continued investment in education, infrastructure, and technology adoption, the country is poised to become a major hub for web development services globally.</p>
      `,
      author: 'Md. Rahman Ahmed',
      authorImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      publishDate: '2024-01-15',
      readTime: '8 min read',
      views: 1250,
      category: 'Technology',
      tags: ['Web Development', 'Bangladesh', 'Future Tech'],
      featuredImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    },
    {
      id: '2',
      title: 'Building Scalable Mobile Apps for International Markets',
      content: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Building Scalable Mobile Apps for International Markets</title>
</head>
<body>
    

    <main>
        <section>
            <h2>Introduction</h2>
            <p>In today's interconnected world, mobile applications have become the primary gateway for businesses to reach global audiences. With over 6.8 billion smartphone users worldwide and mobile apps generating billions in revenue annually, the opportunity for international expansion has never been greater. However, building mobile apps that can scale effectively across different markets, cultures, and technical infrastructures presents unique challenges that require careful planning and strategic implementation.</p>
            
            <p>This comprehensive guide explores the essential strategies, technical considerations, and best practices for developing mobile applications that can successfully penetrate and thrive in international markets while maintaining scalability, performance, and user satisfaction across diverse global audiences.</p>
        </section>

        <section>
            <h2>Understanding the Global Mobile Landscape</h2>
            
            <h3>Market Diversity and Opportunities</h3>
            <p>The global mobile market is characterized by significant diversity in user behavior, preferences, and technological adoption. Emerging markets like India, Brazil, and Southeast Asian countries represent enormous growth opportunities, with rapidly increasing smartphone penetration and mobile-first digital adoption. Meanwhile, mature markets in North America, Europe, and East Asia offer high-value user bases with sophisticated expectations for app quality and functionality.</p>

            <h3>Regional Platform Preferences</h3>
            <p>Platform distribution varies significantly across regions. While iOS maintains strong market share in developed countries like the United States, Japan, and Australia, Android dominates in most other global markets, particularly in price-sensitive regions. Understanding these preferences is crucial for prioritizing development efforts and resource allocation.</p>

            <h3>Infrastructure Considerations</h3>
            <p>Network infrastructure quality varies dramatically worldwide. While 5G networks are expanding in developed markets, many regions still rely heavily on 3G and 4G connections with varying reliability. Some markets experience frequent connectivity issues, making offline functionality and efficient data usage critical design considerations.</p>
        </section>

        <section>
            <h2>Technical Architecture for Global Scale</h2>

            <h3>Cloud Infrastructure Strategy</h3>
            <p>Building for international markets requires robust cloud infrastructure that can handle traffic spikes, provide low-latency access globally, and comply with regional data regulations. Multi-region deployment strategies using services like AWS, Google Cloud, or Microsoft Azure enable applications to serve users from geographically distributed data centers, reducing latency and improving performance.</p>

            <p>Content Delivery Networks (CDNs) play a crucial role in delivering static assets, images, and media content efficiently to users worldwide. Implementing intelligent caching strategies and edge computing capabilities can significantly enhance user experience across different geographical locations.</p>

            <h3>Database Design for Global Applications</h3>
            <p>Database architecture must accommodate diverse data access patterns, regional compliance requirements, and scalability needs. Distributed database systems, data partitioning strategies, and regional data residency compliance are essential considerations. NoSQL databases often provide better scalability for global applications, while SQL databases may be preferred for applications requiring strong consistency guarantees.</p>

            <h3>API Design and Microservices Architecture</h3>
            <p>Microservices architecture enables teams to develop, deploy, and scale different application components independently, which is particularly valuable for international applications with varying feature requirements across markets. RESTful APIs with proper versioning strategies ensure backward compatibility while allowing for market-specific customizations.</p>

            <p>API rate limiting, authentication, and monitoring become critical when serving diverse global audiences with varying usage patterns and potential security threats.</p>
        </section>

        <section>
            <h2>Localization and Internationalization</h2>

            <h3>Technical Implementation of i18n</h3>
            <p>Internationalization (i18n) must be implemented from the beginning of the development process rather than retrofitted later. This includes designing user interfaces that can accommodate text expansion, right-to-left languages, and different character sets. Modern development frameworks like React Native, Flutter, and native iOS/Android provide robust i18n libraries and tools.</p>

            <p>String externalization, dynamic font sizing, flexible layout systems, and culturally appropriate color schemes are fundamental technical requirements. Currency formatting, date and time display, and number formatting must adapt to local conventions automatically.</p>

            <h3>Content Management for Multiple Markets</h3>
            <p>Scalable content management systems enable efficient translation workflows, version control for localized content, and dynamic content delivery based on user location and preferences. Integration with professional translation services and collaborative platforms streamlines the localization process for multiple markets simultaneously.</p>

            <h3>Cultural Adaptation Beyond Translation</h3>
            <p>True localization extends beyond language translation to encompass cultural adaptation of user experience, visual design, and functionality. Payment methods, social media integrations, local service partnerships, and compliance with cultural norms significantly impact user adoption and retention in different markets.</p>
        </section>

        <section>
            <h2>Performance Optimization for Diverse Markets</h2>

            <h3>Network-Aware Development</h3>
            <p>Applications must gracefully handle varying network conditions, from high-speed fiber connections to slow, unreliable mobile networks. Implementing adaptive bitrate streaming for media content, progressive image loading, and intelligent data synchronization strategies ensures usability across different connectivity scenarios.</p>

            <p>Offline-first design principles enable users to access core functionality even without internet connectivity, with data synchronization occurring when connections are restored. This approach is particularly important in emerging markets with unreliable network infrastructure.</p>

            <h3>Device Performance Optimization</h3>
            <p>Global markets include a wide spectrum of device capabilities, from flagship smartphones to budget devices with limited processing power and memory. Performance optimization techniques include efficient memory management, background processing limitations, and graceful degradation of features on lower-end devices.</p>

            <p>Battery life optimization is crucial across all markets, but particularly important in regions where charging infrastructure may be less reliable. Implementing power-efficient algorithms, minimizing background activity, and providing battery usage transparency helps maintain user satisfaction.</p>

            <h3>Data Usage Minimization</h3>
            <p>In markets where data costs are significant, applications must minimize bandwidth consumption through data compression, efficient caching strategies, and optional high-bandwidth features. Providing users with data usage controls and wifi-only options for heavy operations demonstrates sensitivity to local economic conditions.</p>
        </section>

        <section>
            <h2>Compliance and Legal Considerations</h2>

            <h3>Data Privacy Regulations</h3>
            <p>Global applications must comply with diverse data protection regulations including GDPR in Europe, CCPA in California, LGPD in Brazil, and numerous other regional privacy laws. Implementing privacy-by-design principles, obtaining proper consent, and providing data portability and deletion capabilities are essential requirements.</p>

            <p>Cross-border data transfer restrictions may require data localization strategies, where user data is processed and stored within specific geographical boundaries. This can significantly impact architecture decisions and operational complexity.</p>

            <h3>Content and Feature Compliance</h3>
            <p>Different markets have varying regulations regarding content, features, and business models. Social features, payment processing, content sharing, and communication capabilities may be subject to local restrictions. Building flexible feature flag systems enables dynamic compliance adjustments without requiring separate app versions.</p>

            <h3>App Store Regulations</h3>
            <p>App store policies and approval processes vary by region and platform. Understanding local app store requirements, payment processing restrictions, and content guidelines prevents delays in market entry and ensures sustained availability.</p>
        </section>

        <section>
            <h2>Monetization Strategies for Global Markets</h2>

            <h3>Payment Method Diversification</h3>
            <p>Successful international applications must support diverse payment methods popular in different regions. While credit cards dominate in some markets, mobile payments, digital wallets, bank transfers, and even cash-based payment systems are preferred in others. Integrating with local payment processors and supporting regional preferences significantly impacts conversion rates.</p>

            <h3>Pricing Strategy Adaptation</h3>
            <p>Purchasing power varies dramatically across global markets, requiring sophisticated pricing strategies that balance accessibility with profitability. Dynamic pricing based on local economic conditions, currency fluctuation management, and market-specific promotional strategies optimize revenue while maintaining competitiveness.</p>

            <h3>Revenue Model Optimization</h3>
            <p>Different markets respond better to different revenue models. While freemium models may work well in developed markets, ad-supported models might be more effective in emerging economies. Subscription services, one-time purchases, and hybrid models should be evaluated based on local user behavior and preferences.</p>
        </section>

        <section>
            <h2>User Experience and Design Considerations</h2>

            <h3>Cross-Cultural UX Design</h3>
            <p>User interface design must account for cultural preferences, reading patterns, and interaction expectations that vary across markets. Color symbolism, iconography, navigation patterns, and information hierarchy preferences differ significantly between cultures and can impact user adoption and satisfaction.</p>

            <h3>Accessibility and Inclusivity</h3>
            <p>Global applications must be accessible to users with diverse abilities and technological literacy levels. Implementing comprehensive accessibility features, intuitive navigation, and progressive disclosure of complex functionality ensures broad usability across different user demographics and capabilities.</p>

            <h3>Local User Research and Testing</h3>
            <p>Understanding local user behavior requires market-specific user research, usability testing, and feedback collection. Cultural nuances, usage patterns, and feature preferences can only be discovered through direct engagement with target audiences in each market.</p>
        </section>

        <section>
            <h2>Development and Deployment Strategies</h2>

            <h3>Cross-Platform Development Considerations</h3>
            <p>Choosing between native development and cross-platform frameworks significantly impacts international scaling capabilities. While native development provides optimal performance and platform-specific features, cross-platform solutions like React Native, Flutter, or Xamarin can accelerate time-to-market across multiple platforms and markets.</p>

            <h3>Continuous Integration and Deployment</h3>
            <p>Global applications require sophisticated CI/CD pipelines that can handle multiple app store submissions, regional testing requirements, and staged rollouts. Automated testing across different devices, operating systems, and network conditions ensures quality while accelerating deployment cycles.</p>

            <h3>Feature Flag Management</h3>
            <p>Feature flags enable dynamic customization of application functionality based on user location, market requirements, or compliance needs. This approach allows for rapid experimentation, A/B testing, and market-specific feature rollouts without requiring separate application builds.</p>
        </section>

        <section>
            <h2>Analytics and Performance Monitoring</h2>

            <h3>Global Analytics Strategy</h3>
            <p>Understanding user behavior across different markets requires comprehensive analytics implementation that respects privacy regulations while providing actionable insights. Market-specific KPIs, user journey analysis, and performance metrics enable data-driven optimization for each target region.</p>

            <h3>Performance Monitoring and Optimization</h3>
            <p>Real-time performance monitoring across global infrastructure helps identify and resolve issues before they impact user experience. Application performance monitoring (APM) tools, crash reporting, and user experience analytics provide visibility into application health across diverse environments.</p>

            <h3>Feedback Collection and Iteration</h3>
            <p>Implementing culturally appropriate feedback collection mechanisms enables continuous improvement based on local user needs and preferences. App store reviews, in-app feedback, and user surveys should be analyzed within cultural context to extract meaningful insights.</p>
        </section>

        <section>
            <h2>Marketing and User Acquisition</h2>

            <h3>Localized Marketing Strategies</h3>
            <p>User acquisition strategies must be adapted to local marketing channels, cultural preferences, and competitive landscapes. Social media platforms, advertising networks, and partnership opportunities vary significantly across markets, requiring localized approaches to reach target audiences effectively.</p>

            <h3>App Store Optimization</h3>
            <p>App store optimization (ASO) for international markets requires understanding local search behavior, keyword preferences, and visual design preferences. Localized app store listings, screenshots, and promotional materials significantly impact discoverability and conversion rates.</p>

            <h3>Community Building and Support</h3>
            <p>Building local user communities and providing localized customer support enhances user engagement and retention. Multi-language support systems, regional community management, and culturally appropriate communication strategies foster user loyalty and organic growth.</p>
        </section>

        <section>
            <h2>Security and Risk Management</h2>

            <h3>Global Security Threats</h3>
            <p>International applications face diverse security threats that vary by region, including fraud patterns, cybersecurity risks, and regulatory compliance challenges. Implementing robust security measures, fraud detection systems, and incident response procedures protects both users and business operations.</p>

            <h3>Risk Mitigation Strategies</h3>
            <p>Political instability, economic fluctuations, and regulatory changes in different markets can impact application availability and business operations. Developing contingency plans, diversifying market exposure, and maintaining flexible infrastructure helps mitigate these risks.</p>
        </section>

        <section>
            <h2>Future Trends and Technologies</h2>

            <h3>Emerging Technologies</h3>
            <p>Technologies like 5G, edge computing, artificial intelligence, and augmented reality are creating new opportunities for mobile applications in international markets. Understanding regional technology adoption patterns and infrastructure development helps identify early opportunities for innovation.</p>

            <h3>Sustainability and Social Responsibility</h3>
            <p>Growing awareness of environmental and social impact is influencing user preferences globally. Implementing sustainable development practices, energy-efficient applications, and socially responsible features can differentiate applications in conscious consumer markets.</p>
        </section>

        <section>
            <h2>Case Studies and Success Stories</h2>

            <h3>Successful International Scaling Examples</h3>
            <p>Applications like WhatsApp, TikTok, and Spotify have demonstrated successful international scaling through different strategies. WhatsApp focused on simplicity and reliability across diverse network conditions, TikTok adapted content and features to local cultural preferences, while Spotify balanced global consistency with local music preferences and licensing requirements.</p>

            <h3>Lessons from Market Failures</h3>
            <p>Understanding why some applications failed in international markets provides valuable insights. Common failure factors include inadequate localization, poor network performance optimization, cultural insensitivity, regulatory non-compliance, and inappropriate monetization strategies for local economic conditions.</p>
        </section>

        <section>
            <h2>Best Practices and Recommendations</h2>

            <h3>Strategic Planning</h3>
            <p>Successful international expansion requires comprehensive market research, gradual rollout strategies, and long-term commitment to market development. Prioritizing markets based on opportunity size, competitive landscape, and organizational capabilities enables focused resource allocation and higher success probability.</p>

            <h3>Technical Implementation</h3>
            <p>Building scalable international applications requires early investment in proper architecture, internationalization infrastructure, and performance optimization. Technical debt accumulated during rapid initial development can significantly impact international scaling capabilities and should be addressed proactively.</p>

            <h3>Organizational Considerations</h3>
            <p>International scaling requires organizational capabilities including cross-cultural team management, localized customer support, and understanding of international business operations. Building these capabilities early enables more effective market entry and sustained success.</p>
        </section>

        <section>
            <h2>Conclusion</h2>
            <p>Building scalable mobile applications for international markets represents both a tremendous opportunity and a complex challenge that requires careful planning, technical expertise, and cultural sensitivity. Success in global markets depends on understanding diverse user needs, implementing robust technical architecture, and maintaining flexibility to adapt to local requirements while preserving core application value.</p>

            <p>The key to successful international mobile application development lies in balancing global consistency with local adaptation, investing in proper infrastructure and architecture from the beginning, and maintaining a long-term commitment to understanding and serving diverse global audiences. As mobile technology continues to evolve and global connectivity improves, the opportunities for international mobile applications will continue to expand, making these considerations increasingly important for sustainable business growth.</p>

            <p>Organizations that approach international mobile development with proper preparation, cultural sensitivity, and technical rigor will be best positioned to capture the enormous opportunities available in global mobile markets while building sustainable, scalable businesses that serve diverse user communities effectively.</p>
        </section>

        <section>
            <h2>Additional Resources</h2>
            <p>For developers and organizations looking to expand their mobile applications internationally, consider exploring the following areas for deeper learning:</p>
            
            <ul>
                <li>International mobile market research and analytics platforms</li>
                <li>Cloud infrastructure providers' global deployment guides</li>
                <li>Platform-specific internationalization documentation</li>
                <li>Regional app store optimization resources</li>
                <li>Cross-cultural user experience design principles</li>
                <li>International payment processing integration guides</li>
                <li>Global compliance and privacy regulation resources</li>
                <li>Mobile application performance monitoring tools</li>
                <li>Localization and translation service providers</li>
                <li>International mobile marketing and user acquisition strategies</li>
            </ul>
        </section>
    </main>

    <footer>
        <hr>
        <p><em>This article provides a comprehensive overview of building scalable mobile applications for international markets. For the most current information on specific technologies, regulations, and market conditions, always consult the latest industry resources and expert guidance.</em></p>
    </footer>
</body>
</html>

      `,
      author: 'Shamshur Rahman samin',
      authorImage: 'https://avatars.githubusercontent.com/u/109974472?v=4',
      publishDate: '2024-01-10',
      readTime: '12 min read',
      views: 980,
      category: 'Mobile Development',
      tags: ['Mobile Apps', 'Scalability', 'International'],
      featuredImage: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    }
  ];

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Post Not Found</h1>
            <Link to="/blog" className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <ArrowLeft className="mr-2" size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Blog
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-96 overflow-hidden">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Article Meta */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={post.authorImage} 
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{post.author}</div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {new Date(post.publishDate).toLocaleDateString()}
                    <Clock size={14} className="ml-3 mr-1" />
                    {post.readTime}
                    <Eye size={14} className="ml-3 mr-1" />
                    {post.views} views
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={sharePost}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          <div className="px-8 pb-8">
            <div className="flex items-center mb-4">
              <Tag size={20} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <MessageSquare size={24} className="text-primary-600 dark:text-primary-400 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h3>
          </div>
          
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>Comments feature coming soon!</p>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(relatedPost => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedPost.featuredImage} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-full text-sm font-medium">
                        {relatedPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
      </div>
    </div>
  );
};

export default BlogDetails;