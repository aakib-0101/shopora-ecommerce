import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const { theme, toggleTheme } = useTheme()

  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('shopora-user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error('Error reading user:', error)
      return null
    }
  })

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('shopora-user')
        setUser(storedUser ? JSON.parse(storedUser) : null)
      } catch (error) {
        console.error('Error reading user:', error)
        setUser(null)
      }
    }

    window.addEventListener('userUpdated', loadUser)
    window.addEventListener('storage', loadUser)

    return () => {
      window.removeEventListener('userUpdated', loadUser)
      window.removeEventListener('storage', loadUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('shopora-user')

    setUser(null)

    window.dispatchEvent(new Event('userUpdated'))

    navigate('/')
  }

  // --------------------------------------------------
  // SEARCH PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    const searchProducts = async () => {
      const query = search.trim()

      if (!query) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)

      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            query
          )}&limit=8`
        )

        const data = await response.json()

        setResults(data.products || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchProducts, 300)

    return () => clearTimeout(timer)
  }, [search])

  // --------------------------------------------------
  // CLOSE SEARCH DROPDOWN ON OUTSIDE CLICK
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // --------------------------------------------------
  // SEARCH SUBMIT
  // --------------------------------------------------

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const query = search.trim()

    if (!query) return

    setShowResults(false)

    navigate(`/products?search=${encodeURIComponent(query)}`)
  }

  // --------------------------------------------------
  // PRODUCT CLICK
  // --------------------------------------------------

  const handleProductClick = (id) => {
    setSearch('')
    setShowResults(false)

    navigate(`/product/${id}`)
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 4px 20px var(--shadow)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 28px',
          minHeight: '76px',
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {/* Premium Shopping Bag SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 10a4 4 0 0 1-8 0" />
            <path d="M3.1 6.03h17.8" />
            <path d="M3.4 5.47A2 2 0 0 0 3 6.67V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.67a2 2 0 0 0-.4-1.2l-2-2.67A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8Z" />
          </svg>

          <span
            style={{
              fontSize: '25px',
              fontWeight: '700',
              letterSpacing: '1px',
            }}
          >
            Shopora
          </span>
        </Link>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div
          ref={searchRef}
          style={{
            flex: 1,
            maxWidth: '620px',
            position: 'relative',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                height: '44px',
                overflow: 'hidden',
              }}
            >
              {/* SEARCH ICON */}
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '21px',
                  paddingLeft: '15px',
                  lineHeight: 1,
                }}
              >
                ⌕
              </span>

              {/* SEARCH INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => {
                  if (search.trim()) {
                    setShowResults(true)
                  }
                }}
                placeholder="Search products, brands, categories..."
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text)',
                  padding: '0 12px',
                  fontSize: '14px',
                }}
              />

              {/* LOADING */}
              {loading && (
                <span
                  style={{
                    color: 'var(--accent)',
                    fontSize: '12px',
                    paddingRight: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Searching...
                </span>
              )}

              {/* SEARCH BUTTON */}
              <button
                type="submit"
                style={{
                  height: '100%',
                  padding: '0 18px',
                  border: 'none',
                  borderLeft: '1px solid var(--border)',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* ==================================================
              SEARCH RESULTS DROPDOWN
          ================================================== */}

          {showResults && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 15px 40px var(--shadow)',
              }}
            >
              {results.length > 0 ? (
                <>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'var(--surface-2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'transparent'
                      }}
                    >
                      {/* PRODUCT IMAGE */}
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          background:
                            theme === 'dark'
                              ? '#f5f0e8'
                              : '#eeeae2',
                        }}
                      />

                      {/* PRODUCT INFO */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: 'var(--text)',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {product.title}
                        </div>

                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {product.category}
                        </div>
                      </div>

                      {/* PRICE */}
                      <div
                        style={{
                          color: 'var(--accent)',
                          fontSize: '14px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ${product.price}
                      </div>
                    </div>
                  ))}

                  {/* VIEW ALL */}
                  <button
                    onClick={handleSearchSubmit}
                    style={{
                      width: '100%',
                      padding: '13px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    View all results →
                  </button>
                </>
              ) : (
                !loading && (
                  <div
                    style={{
                      padding: '22px',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                    }}
                  >
                    No products found for "{search}"
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
            flexShrink: 0,
          }}
        >
          <Link
            to="/products"
            style={{
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Shop
          </Link>

          <Link
            to="/cart"
            style={{
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Cart
          </Link>

          <Link
            to="/profile"
            style={{
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Profile
          </Link>

          {/* ==================================================
              AUTH
          ================================================== */}

          {!user ? (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '9px 16px',
                  border: '1px solid var(--accent)',
                  borderRadius: '6px',
                }}
              >
                Login
              </Link>

              {/* CREATE ACCOUNT */}
              <Link
                to="/register"
                style={{
                  color: 'var(--bg)',
                  background: 'var(--accent)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 16px',
                  borderRadius: '6px',
                }}
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              {/* LOGGED-IN USER */}
              <Link
                to="/profile"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {user.firstName || user.email}
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  color: 'var(--accent)',
                  background: 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '9px 16px',
                  border: '1px solid var(--accent)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          )}

          {/* ==================================================
              THEME TOGGLE
          ================================================== */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-2)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '17px',
              padding: 0,
            }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar