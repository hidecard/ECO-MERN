import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../lib/api';
import { toast } from 'react-toastify';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, token } = useCart();
  const productsPerPage = 12;

  const banners = [
    { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=2000', text: 'Summer Sale! Up to 50% Off' },
    { image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=2000', text: 'New Arrivals In Stock!' },
    { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2000', text: 'Free Shipping on Orders Over $50' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', 'http://localhost:5000/api/products');
        let data = await getProducts();
        data = data.map(product => ({
          ...product,
          averageRating: product.averageRating || Math.floor(Math.random() * 5 + 1), // Mock until backend updated
        }));
        console.log('Products data:', data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(stored);
  }, []);

  useEffect(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId?.name === selectedCategory;
      const matchesPrice =
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max));
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sort, priceRange, products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleAddToCart = async (productId, stock) => {
    if (!token) {
      toast.error('Please log in to add to cart');
      return;
    }
    if (stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    try {
      await addItem(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const categories = [...new Set(products.map(p => p.categoryId?.name || 'Uncategorized'))];
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-lg text-gray-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-400 text-white rounded-2xl p-8 md:p-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=2000')] opacity-20 bg-cover bg-center"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-fade-in">Welcome to YHA Shop</h1>
          <p className="text-lg md:text-xl mb-6">Discover top-quality products at unbeatable prices!</p>
          <Link
            to="/products"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 focus:ring-2 focus:ring-orange-400 transition-all"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="mb-12 relative h-48 rounded-2xl overflow-hidden">
        <img
          src={banners[bannerIndex].image}
          alt="Promotion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-white text-xl md:text-2xl font-semibold">{banners[bannerIndex].text}</p>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIndex(i)}
              className={`w-2 h-2 rounded-full ${i === bannerIndex ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      {products.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {products.slice(0, 5).map(product => (
              <div
                key={product._id}
                className="flex-none w-64 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
              >
                <img
                  src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg font-bold text-orange-600">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product._id, product.stock)}
                  disabled={product.stock === 0}
                  className={`w-full mt-2 px-4 py-2 rounded-lg text-sm ${
                    product.stock > 0
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recently Viewed</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {recentlyViewed.map(product => (
              <div
                key={product._id}
                className="flex-none w-64 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
              >
                <img
                  src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                <p className="text-lg font-bold text-orange-600">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product._id, product.stock)}
                  disabled={product.stock === 0}
                  className={`w-full mt-2 px-4 py-2 rounded-lg text-sm ${
                    product.stock > 0
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full p-4 pr-12 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            aria-label="Search products"
          />
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-orange-500"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-orange-500"
            aria-label="Sort products"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              placeholder="Min Price"
              className="p-3 rounded-lg border border-gray-200 w-24"
              min="0"
            />
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              placeholder="Max Price"
              className="p-3 rounded-lg border border-gray-200 w-24"
              min="0"
            />
          </div>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">No products found.</p>
          <Link to="/products" className="mt-4 inline-block text-orange-600 font-semibold hover:text-orange-700">
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={product.imageURLs?.[0] || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.categoryId?.name || 'Uncategorized'}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xl font-bold text-orange-600 mt-2">${product.price.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 transition-all"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={() => handleAddToCart(product._id, product.stock)}
                      disabled={product.stock === 0}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                        product.stock > 0
                          ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{quickViewProduct.name}</h3>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={quickViewProduct.imageURLs?.[0] || 'https://via.placeholder.com/300'}
              alt={quickViewProduct.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-2">{quickViewProduct.description || 'No description available.'}</p>
            <p className="text-xl font-bold text-orange-600 mb-2">${quickViewProduct.price.toFixed(2)}</p>
            <p className={`text-sm mb-4 ${quickViewProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {quickViewProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <button
              onClick={() => handleAddToCart(quickViewProduct._id, quickViewProduct.stock)}
              disabled={quickViewProduct.stock === 0}
              className={`w-full px-4 py-2 rounded-lg ${
                quickViewProduct.stock > 0
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {quickViewProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;