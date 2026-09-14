import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('default')

  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('search') || ''
  const categoryQuery = searchParams.get('category') || ''
  const discountQuery = searchParams.get('discount') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          'https://dummyjson.com/products?limit=0'
        )

        const data = await response.json()

        setProducts(data.products || [])

        const uniqueCategories = [
          ...new Set(
            (data.products || []).map(
              (product) => product.category
            )
          ),
        ]

        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // =====================================================
    // DISCOUNT FILTER
    // /products?discount=15
    // Shows ONLY products with 15% or more discount.
    // =====================================================

    if (discountQuery) {
      result = result.filter(
        (product) =>
          Number(product.discountPercentage || 0) >= 15
      )
    }

    // CATEGORY FILTER
    if (categoryQuery) {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          categoryQuery.toLowerCase()
      )
    }

    // =====================================================
    // SEARCH FILTER
    // =====================================================

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()

      result = result.filter((product) => {
        const title =
          product.title?.toLowerCase() || ''

        const description =
          product.description?.toLowerCase() || ''

        const category =
          product.category?.toLowerCase() || ''

        const brand =
          product.brand?.toLowerCase() || ''

        const tags = Array.isArray(product.tags)
          ? product.tags.join(' ').toLowerCase()
          : ''

        // FIX:
        // Remove the standalone grocery product "Apple"
        // but keep Apple electronic products.
        if (
          query === 'apple' &&
          title === 'apple' &&
          category === 'groceries'
        ) {
          return false
        }

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          brand.includes(query) ||
          tags.includes(query)
        )
      })
    }

    // SORTING
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    if (sortBy === 'discount') {
      result.sort(
        (a, b) =>
          Number(b.discountPercentage || 0) -
          Number(a.discountPercentage || 0)
      )
    }

    return result
  }, [
    products,
    searchQuery,
    categoryQuery,
    discountQuery,
    sortBy,
  ])

  const clearFilters = () => {
    setSearchParams({})
  }

  const selectCategory = (category) => {
    const params = {}

    if (searchQuery) params.search = searchQuery
    if (discountQuery) params.discount = discountQuery

    params.category = category

    setSearchParams(params)
  }

  const clearCategory = () => {
    const params = {}

    if (searchQuery) params.search = searchQuery
    if (discountQuery) params.discount = discountQuery

    setSearchParams(params)
  }

  const formatCategory = (category) => {
    if (!category) return ''

    return category
      .split('-')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(' ')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '55px 28px 80px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: '30px',
            padding: '28px 30px',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 72%, rgba(168, 132, 69, 0.06) 100%)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px var(--shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-45px',
              right: '-45px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.07,
            }}
          />

          <p
            style={{
              margin: '0 0 7px',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
            }}
          >
            {discountQuery
              ? 'Limited Offers'
              : 'Shopora Collection'}
          </p>

          {discountQuery ? (
            <h1
              style={{
                margin: 0,
                fontSize: '46px',
                lineHeight: '1.05',
                fontWeight: '650',
                letterSpacing: '-1.8px',
                color: 'var(--text)',
              }}
            >
              Save{' '}
              <span
                style={{
                  color: 'var(--accent)',
                  fontWeight: '750',
                }}
              >
                15% & more
              </span>
            </h1>
          ) : (
            <h1
              style={{
                margin: 0,
                fontSize: '42px',
                lineHeight: '1.1',
                fontWeight: '600',
                letterSpacing: '-1.5px',
                color: 'var(--text)',
              }}
            >
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : categoryQuery
                ? formatCategory(categoryQuery)
                : 'Our Collection'}
            </h1>
          )}

          <p
            style={{
              margin: '12px 0 0',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            {discountQuery
              ? `Found ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? 's' : ''
                } with 15% or more discount.`
              : searchQuery
              ? `Found ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? 's' : ''
                }`
              : categoryQuery
              ? `Explore our ${formatCategory(
                  categoryQuery
                )} collection.`
              : 'Find something made for you.'}
          </p>
        </div>

        {/* FILTER CONTROLS */}
        {(searchQuery || categoryQuery || discountQuery) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '18px',
              marginBottom: '32px',
              padding: '14px 16px',
              background:
                'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 5px 20px var(--shadow)',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {discountQuery && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 13px',
                    borderRadius: '7px',
                    background:
                      'rgba(168, 132, 69, 0.12)',
                    border:
                      '1px solid rgba(168, 132, 69, 0.28)',
                    color: 'var(--accent)',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.4px',
                  }}
                >
                  ✦ SAVE 15%+
                </span>
              )}

              {searchQuery && (
                <span
                  style={{
                    padding: '8px 13px',
                    borderRadius: '7px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Search:{' '}
                  <strong style={{ color: 'var(--text)' }}>
                    {searchQuery}
                  </strong>
                </span>
              )}

              {categoryQuery && (
                <span
                  style={{
                    padding: '8px 13px',
                    borderRadius: '7px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Category:{' '}
                  <strong style={{ color: 'var(--text)' }}>
                    {formatCategory(categoryQuery)}
                  </strong>
                </span>
              )}

              <button
                onClick={clearFilters}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '8px 10px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    'var(--text-secondary)'
                }}
              >
                Clear filters
              </button>
            </div>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '13px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                }}
              >
                ⇅
              </span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  background: 'var(--surface-2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '10px 36px 10px 34px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  minWidth: '170px',
                }}
              >
                <option value="default">Sort by</option>
                <option value="discount">
                  Highest Discount
                </option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="rating">
                  Highest Rated
                </option>
              </select>

              <span
                style={{
                  position: 'absolute',
                  right: '13px',
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                }}
              >
                ▼
              </span>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {!searchQuery && !discountQuery && (
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={clearCategory}
                style={{
                  padding: '9px 16px',
                  borderRadius: '20px',
                  border: !categoryQuery
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border)',
                  background: !categoryQuery
                    ? 'var(--accent)'
                    : 'transparent',
                  color: !categoryQuery
                    ? 'var(--bg)'
                    : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    selectCategory(category)
                  }
                  style={{
                    padding: '9px 16px',
                    borderRadius: '20px',
                    border:
                      categoryQuery === category
                        ? '1px solid var(--accent)'
                        : '1px solid var(--border)',
                    background:
                      categoryQuery === category
                        ? 'var(--accent)'
                        : 'transparent',
                    color:
                      categoryQuery === category
                        ? 'var(--bg)'
                        : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {formatCategory(category)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div
            style={{
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              minHeight: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              background: 'var(--surface)',
              padding: '40px',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                marginBottom: '15px',
                opacity: 0.7,
                color: 'var(--accent)',
              }}
            >
              ⌕
            </div>

            <h2
              style={{
                margin: '0 0 10px',
                fontSize: '22px',
                fontWeight: '500',
                color: 'var(--text)',
              }}
            >
              No products found
            </h2>

            <p
              style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '14px',
                maxWidth: '450px',
              }}
            >
              We couldn't find anything matching your
              search or filters.
            </p>

            <button
              onClick={clearFilters}
              style={{
                marginTop: '22px',
                padding: '11px 20px',
                border: 'none',
                borderRadius: '6px',
                background: 'var(--accent)',
                color: 'var(--bg)',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View all products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '22px',
            }}
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <article
                  style={{
                    position: 'relative',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transition:
                      'transform 0.2s ease, border-color 0.2s ease',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-4px)'
                    e.currentTarget.style.borderColor =
                      'var(--border-strong)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(0)'
                    e.currentTarget.style.borderColor =
                      'var(--border)'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      height: '240px',
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '18px',
                      }}
                    />

                    {Number(
                      product.discountPercentage || 0
                    ) >= 15 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '6px 9px',
                          borderRadius: '5px',
                          background: 'var(--accent)',
                          color: 'var(--bg)',
                          fontSize: '11px',
                          fontWeight: '800',
                        }}
                      >
                        {Math.round(
                          Number(
                            product.discountPercentage
                          )
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '18px' }}>
                    <p
                      style={{
                        margin: '0 0 7px',
                        color: 'var(--accent)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {formatCategory(
                        product.category
                      )}
                    </p>

                    <h3
                      style={{
                        margin: '0 0 10px',
                        fontSize: '16px',
                        fontWeight: '500',
                        lineHeight: '1.4',
                        color: 'var(--text)',
                      }}
                    >
                      {product.title}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--accent)',
                          fontSize: '17px',
                          fontWeight: '600',
                        }}
                      >
                        ${product.price}
                      </span>

                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                        }}
                      >
                        ★{' '}
                        {Number(product.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Shop