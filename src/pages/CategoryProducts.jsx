import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const CategoryProducts = () => {
  const { category } = useParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch(`https://dummyjson.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching category products:', error)
        setProducts([])
        setLoading(false)
      })
  }, [category])

  const formattedCategory = category
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '120px 6% 60px'
      }}
    >

      {/* Header */}
      <div
        style={{
          marginBottom: '45px'
        }}
      >
        <p
          style={{
            color: 'var(--accent)',
            fontSize: '13px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          Collection
        </p>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: '500',
            margin: 0,
            textTransform: 'capitalize',
            color: 'var(--text)'
          }}
        >
          {formattedCategory}
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            marginTop: '12px',
            fontSize: '16px'
          }}
        >
          Explore our {formattedCategory} collection.
        </p>
      </div>


      {/* Loading */}
      {loading && (
        <p
          style={{
            color: 'var(--text-secondary)'
          }}
        >
          Loading products...
        </p>
      )}


      {/* No Products */}
      {!loading && products.length === 0 && (
        <div
          style={{
            padding: '40px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            No products found in this category.
          </p>
        </div>
      )}


      {/* Products */}
      {!loading && products.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '28px'
          }}
        >
          {products.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition:
                    'transform 0.3s ease, border-color 0.3s ease',
                  height: '100%'
                }}

                onMouseEnter={e => {
                  e.currentTarget.style.transform =
                    'translateY(-5px)'

                  e.currentTarget.style.borderColor =
                    'var(--border-strong)'
                }}

                onMouseLeave={e => {
                  e.currentTarget.style.transform =
                    'translateY(0)'

                  e.currentTarget.style.borderColor =
                    'var(--border)'
                }}
              >

                {/* Image */}
                <div
                  style={{
                    height: '280px',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '20px'
                    }}
                  />
                </div>


                {/* Details */}
                <div
                  style={{
                    padding: '20px'
                  }}
                >
                  <p
                    style={{
                      color: 'var(--accent)',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      margin: '0 0 8px'
                    }}
                  >
                    {formattedCategory}
                  </p>

                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: '500',
                      margin: '0 0 10px',
                      color: 'var(--text)',
                      lineHeight: '1.4'
                    }}
                  >
                    {product.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <p
                      style={{
                        color: 'var(--accent)',
                        fontSize: '18px',
                        margin: 0,
                        fontWeight: '500'
                      }}
                    >
                      ${product.price}
                    </p>

                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '13px'
                      }}
                    >
                      ★ {product.rating}
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}

export default CategoryProducts