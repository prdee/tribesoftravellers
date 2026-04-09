import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Calendar } from 'lucide-react';
import { blogPosts } from '../data/destinations';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Honeymoon', 'Destinations', 'Season', 'Hotels', 'Travelogues', 'Topical', 'Web Story'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-96">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
          alt="Blog"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-3xl w-full">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Where are you headed next?
            </h1>
            <p className="text-lg mb-8 text-gray-100">
              Explore destinations & get inspired for your next getaway
            </p>
            
            {/* Search */}
            <div className="flex max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Things to do, places to visit, tour packages..."
                className="flex-1 px-6 py-4 text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <select className="px-4 py-4 bg-gray-50 text-gray-700 border-l border-gray-200 focus:outline-none appearance-none">
                <option>In: Anywhere</option>
                <option>India</option>
                <option>International</option>
              </select>
              <button className="bg-teal hover:bg-teal-dark px-6 py-4 transition-colors">
                <Search className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto py-3 no-scrollbar">
            <Link to="/" className="flex items-center text-gray-500 hover:text-teal px-3 py-2 transition-colors">
              <div className="w-6 h-6 bg-teal rounded flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">T</span>
              </div>
            </Link>
            <Link to="/blog" className="text-tt-dark font-bold px-3 py-2">Blog</Link>
            {categories.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 whitespace-nowrap rounded-full text-sm transition-all border ${
                  activeCategory === cat 
                    ? 'bg-teal text-white border-teal font-bold shadow-sm' 
                    : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {filteredPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-teal font-bold uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-bold text-tt-dark mt-2 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-teal hover:text-teal-dark font-bold transition-colors"
                >
                  Read more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* More Posts */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPosts.slice(3).map((post) => (
            <article
              key={post.id}
              className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-1/3 relative overflow-hidden shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <span className="text-xs text-teal font-bold uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-bold text-tt-dark mt-2 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-400 font-medium mt-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg font-bold transition-all border ${
                  page === 1
                    ? 'bg-teal text-white border-teal shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-teal'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal font-bold transition-all">
              ...
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-teal-50 mb-8 text-lg">
            Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto bg-white rounded-lg p-1 shadow-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button className="bg-coral hover:bg-coral-dark px-6 py-3 rounded-md text-white font-bold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;