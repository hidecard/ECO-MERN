function Home() {
    const products = [
      { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/150' },
      { id: 2, name: 'Product 2', price: 39.99, image: 'https://via.placeholder.com/150' },
      { id: 3, name: 'Product 3', price: 19.99, image: 'https://via.placeholder.com/150' },
      { id: 4, name: 'Product 4', price: 49.99, image: 'https://via.placeholder.com/150' },
    ];
  
    return (
      <div className="container mx-auto p-4">
        {/* Hero Section */}
        <div className="bg-blue-100 rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ECO PJ</h1>
          <p className="text-lg mb-4">Discover the best products at unbeatable prices!</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Shop Now
          </button>
        </div>
  
        {/* Product Grid */}
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Home;