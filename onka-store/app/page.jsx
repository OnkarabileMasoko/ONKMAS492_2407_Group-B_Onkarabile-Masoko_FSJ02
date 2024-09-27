"use client"; // Client component

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Hooks for handling router and query params
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import SortOptions from "./components/SortOptions";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Fetch products with query parameters
async function fetchProducts(page = 1, searchQuery = "", category = "") {
  const skip = (page - 1) * 20;
  const res = await fetch(
    `https://next-ecommerce-api.vercel.app/products?skip=${skip}&limit=20&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// Fetch categories
async function fetchCategories() {
  const res = await fetch('https://next-ecommerce-api.vercel.app/categories'); 
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialization based on query parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedSortOrder, setSelectedSortOrder] = useState(searchParams.get("sort") || "asc");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // Fetch products and categories on filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(page, searchQuery, selectedCategory),
          fetchCategories(),
        ]);

        // Sorting logic
        const sortedProducts = [...fetchedProducts].sort((a, b) => {
          if (selectedSortOrder === 'asc') {
            return a.price - b.price; // Ascending order
          } else if (selectedSortOrder === 'desc') {
            return b.price - a.price; // Descending order
          }
          return 0;
        });

        setProducts(sortedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, [page, searchQuery, selectedCategory, selectedSortOrder]);

  // URL synchronization with user actions
  useEffect(() => {
    const query = {
      page: page.toString(),  // Ensure page is a string
      search: searchQuery || undefined,  // Set to undefined if empty
      category: selectedCategory || undefined,  // Set to undefined if empty
      sort: selectedSortOrder || undefined,  // Set to undefined if empty
    };

    const cleanQuery = Object.fromEntries(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]) // Ensure values are strings
    );

    console.log("cleanQuery:", cleanQuery); // Log the cleanQuery for debugging

    // Ensure pathname is a string
    const pathname = "/products";

    // Push clean query into the URL without reloading
    router.push({
      pathname: pathname,
      query: cleanQuery,
    }, undefined, { shallow: true });  // Shallow routing to avoid full page reload
  }, [page, searchQuery, selectedCategory, selectedSortOrder]);

  // Handlers for user input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page when changing category
  };

  const handleSortOrderSelect = (sortOrder) => {
    setSelectedSortOrder(sortOrder);
    setPage(1); // Reset to first page when sorting
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">My products</h1>

            {/* Search Bar */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* Sort Options */}
            <SortOptions
              selectedSortOrder={selectedSortOrder}
              onSelectSortOrder={handleSortOrderSelect}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>

            {/* Pagination Component */}
            <Pagination 
              currentPage={page} 
              searchQuery={searchQuery} 
              selectedCategory={selectedCategory} 
              selectedSortOrder={selectedSortOrder} 
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
