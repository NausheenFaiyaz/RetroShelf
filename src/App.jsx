import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "https://api.freeapi.app/api/v1/public/randomproducts";

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function ratingValue(product) {
  const value =
    product?.rating ??
    product?.ratings ??
    product?.starRating ??
    product?.review?.rating ??
    product?.reviews?.rating;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toFixed(1) : "N/A";
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: { accept: "application/json" },
          signal: controller.signal,
        });

        const result = await response.json();
        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || "Failed to load products.");
        }

        const payload = result?.data ?? {};
        const items =
          payload?.data ??
          payload?.products ??
          payload?.items ??
          payload?.docs ??
          result?.products ??
          [];

        const normalized = Array.isArray(items)
          ? items
          : items && typeof items === "object"
            ? [items]
            : [];

        setProducts(normalized);
        const pages =
          payload?.totalPages ||
          payload?.pagination?.totalPages ||
          Math.max(
            1,
            Math.ceil((payload?.total || normalized.length || 1) / limit),
          );
        setTotalPages(pages);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(
            fetchError.message ||
              "Something went wrong while fetching products.",
          );
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [page, limit]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (!query) return true;

      const title = (product?.title || product?.name || "").toLowerCase();
      const brand = (product?.brand || "").toLowerCase();
      const category = (product?.category || "").toLowerCase();
      return (
        title.includes(query) ||
        brand.includes(query) ||
        category.includes(query)
      );
    });

    const sorted = [...filtered];

    if (sortBy === "priceLowToHigh") {
      sorted.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
    }

    if (sortBy === "priceHighToLow") {
      sorted.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
    }

    if (sortBy === "ratingHighToLow") {
      sorted.sort(
        (a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0),
      );
    }

    return sorted;
  }, [products, search, sortBy]);

  return (
    <div className="shop-page">
      <header className="top-shell">
        <p className="eyebrow">FreeAPI Product Listing</p>
        <div className="top-row">
          <h1>Retro Shelf</h1>
          <div className="input-wrapper">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="ratingHighToLow">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      {loading && <p className="status">Loading products...</p>}
      {!loading && error && <p className="status error">{error}</p>}
      {!loading && !error && filteredProducts.length === 0 && (
        <p className="status">No products found for this filter.</p>
      )}

      <main className="product-grid">
        {filteredProducts.map((product, index) => {
          const id = product?._id || product?.id || `product-${index}`;
          const title = product?.title || product?.name || "Untitled Product";
          const brand = product?.brand || "Unknown Brand";
          const category = product?.category || "Uncategorized";
          const description =
            product?.description || "No description available.";
          const price = money(product?.price);
          const discount = Number(product?.discountPercentage);
          const stock = product?.stock ?? "N/A";
          const rating = ratingValue(product);
          const image =
            product?.thumbnail ||
            product?.images?.[0] ||
            "https://via.placeholder.com/640x480.png?text=No+Image";

          return (
            <article key={id} className="product-card">
              <div className="image-wrap">
                <img src={image} alt={title} loading="lazy" />
              </div>

              <div className="card-content">
                <h2 title={title}>{title}</h2>
                <p className="brand">
                  {brand} · {category}
                </p>
                <p className="info-box">{description}</p>
                <p className="info-box">
                  Stock {stock} | Rating {rating}
                </p>

                <div className="meta-row">
                  <p>
                    <strong>{price}</strong>
                  </p>
                  {Number.isFinite(discount) && (
                    <p className="discount-tag">-{discount.toFixed(0)}% OFF</p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      <footer className="pager">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={loading || page <= 1}
        >
          Prev
        </button>
        <p>
          Page {page} of {Math.max(1, totalPages)}
        </p>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={loading || page >= totalPages}
        >
          Next
        </button>
      </footer>
    </div>
  );
}

export default App;
