import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const Home = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'https://dummyjson.com/products?limit=0'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()

        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // =========================================================
  // FEATURED BRANDS
  // =========================================================

  const featuredBrands = useMemo(() => {
    const brandMap = {}

    products.forEach((product) => {
      const brand = product.brand?.trim()

      if (!brand) return

      if (!brandMap[brand]) {
        brandMap[brand] = []
      }

      brandMap[brand].push(product)
    })

    return Object.entries(brandMap)
      .filter(([, brandProducts]) => brandProducts.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([brand, brandProducts]) => ({
        brand,
        products: brandProducts,
      }))
  }, [products])

  // =========================================================
  // HERO SHOWCASE PRODUCTS
  // =========================================================

  const showcaseSlides = useMemo(() => {
    if (!products.length) return []

    const findProducts = (terms, categories = []) => {
      const matches = products.filter((product) => {
        const searchableText = [
          product.title,
          product.description,
          product.category,
          product.brand,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return terms.some((term) =>
          searchableText.includes(term.toLowerCase())
        )
      })

      if (matches.length > 0) {
        return matches
      }

      return products.filter((product) =>
        categories.includes(product.category)
      )
    }

    const sneakers = findProducts(
      [
        'sneaker',
        'sneakers',
        'running shoes',
        'sports shoes',
        'shoes',
      ],
      ['mens-shoes', 'womens-shoes']
    )

    const perfumes = findProducts(
      [
        'perfume',
        'fragrance',
        'parfum',
        'cologne',
      ],
      ['fragrances']
    )

    const laptops = findProducts(
      [
        'laptop',
        'macbook',
        'notebook',
        'computer',
      ],
      ['laptops']
    )

    return [
      {
        id: 'sneakers',
        title: 'Sneakers',
        eyebrow: 'Step into something better',
        description:
          'Discover styles made for movement, comfort and everyday confidence.',
        image:
          sneakers[0]?.images?.[0] ||
          sneakers[0]?.thumbnail ||
          '',
        link: '/products/mens-shoes',
      },

      {
        id: 'perfume',
        title: 'Perfume',
        eyebrow: 'Find your signature',
        description:
          'Explore fragrances designed to leave a lasting impression.',
        image:
          perfumes[0]?.images?.[0] ||
          perfumes[0]?.thumbnail ||
          '',
        link: '/products/fragrances',
      },

      {
        id: 'laptops',
        title: 'Laptops',
        eyebrow: 'Power your everyday',
        description:
          'Modern technology for work, creativity and everything in between.',
        image:
          laptops[0]?.images?.[0] ||
          laptops[0]?.thumbnail ||
          '',
        link: '/products/laptops',
      },
    ].filter((slide) => slide.image)
  }, [products])

  // =========================================================
  // AUTOMATIC SLIDER
  // =========================================================

  useEffect(() => {
    if (showcaseSlides.length <= 1) return

    const interval = setInterval(() => {
      setActiveSlide(
        (current) =>
          (current + 1) % showcaseSlides.length
      )
    }, 4500)

    return () => clearInterval(interval)
  }, [showcaseSlides.length])

  // =========================================================
  // KEEP ACTIVE SLIDE VALID
  // =========================================================

  useEffect(() => {
    if (
      showcaseSlides.length > 0 &&
      activeSlide >= showcaseSlides.length
    ) {
      setActiveSlide(0)
    }
  }, [activeSlide, showcaseSlides.length])

  // =========================================================
  // BRAND CLICK
  // =========================================================

  const handleBrandClick = (brand) => {
    navigate(
      `/products?search=${encodeURIComponent(brand)}`
    )
  }

  // =========================================================
  // PRICE FORMAT
  // =========================================================

  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`
  }

  const currentSlide = showcaseSlides[activeSlide]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        overflow: 'hidden',
      }}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '58px 28px 70px',
        }}
      >
        <div
          className="shopora-hero"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.02fr) minmax(430px, 0.98fr)',
            gap: '58px',
            alignItems: 'center',
          }}
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: '31px',
                  height: '1px',
                  background: 'var(--accent)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />

              <span>Shopora Collection</span>
            </div>

            <h1
              style={{
                margin: 0,
                maxWidth: '700px',
                fontSize: 'clamp(50px, 6vw, 80px)',
                lineHeight: 0.98,
                letterSpacing: '-4px',
                fontWeight: 700,
              }}
            >
              Discover
              <br />
              something
              <br />

              <span
                style={{
                  color: 'var(--accent)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                }}
              >
                worth having.
              </span>
            </h1>

            <p
              style={{
                maxWidth: '650px',
                margin: '30px 0 0',
                color: 'var(--text-secondary)',
                fontSize: '17px',
                lineHeight: 1.7,
              }}
            >
              Explore our curated collection of products,
              selected for quality, style and everyday living.
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginTop: '34px',
              }}
            >
              <Link
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50px',
                  padding: '0 27px',
                  borderRadius: '8px',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Explore Collection
              </Link>

            </div>

            {/* SMALL INFO */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '18px',
                marginTop: '43px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
              }}
            >
              <span>Curated products</span>

              <span
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  flexShrink: 0,
                }}
              />

              <span>Secure shopping</span>

              <span
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  flexShrink: 0,
                }}
              />

              <span>24/7 support</span>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — PRODUCT SHOWCASE
          ================================================= */}

          <div
            className="shopora-showcase"
            style={{
              width: '100%',
              minWidth: 0,
            }}
          >
            {currentSlide ? (
              <Link
                to={currentSlide.link}
                style={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {/* OUTER FRAME */}

                <div
                  style={{
                    width: '100%',
                    height: '590px',
                    padding: '10px',
                    border:
                      '1px solid var(--border-strong)',
                    borderRadius: '19px',
                    background: 'var(--surface)',
                  }}
                >
                  {/* INNER FRAME */}

                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      border:
                        '1px solid var(--border)',
                      borderRadius: '12px',
                      background: 'var(--surface)',
                    }}
                  >
                    {/* =================================================
                        IMAGE AREA
                    ================================================= */}

                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '390px',
                        flexShrink: 0,
                        overflow: 'hidden',
                        background:
                          theme === 'dark'
                            ? '#191816'
                            : '#f1efea',
                        borderBottom:
                          '1px solid var(--border)',
                      }}
                    >
                      <img
                        key={currentSlide.id}
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          display: 'block',
                          padding: '20px',
                          animation:
                            'shoporaProductImage 0.7s ease',
                        }}
                      />

                      {/* SUBTLE IMAGE VIGNETTE */}

                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          background:
                            theme === 'dark'
                              ? 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)'
                              : 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 100%)',
                        }}
                      />

                      {/* FEATURED BADGE */}

                      <div
                        style={{
                          position: 'absolute',
                          top: '20px',
                          left: '20px',
                          zIndex: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          padding: '8px 13px',
                          border:
                            theme === 'dark'
                              ? '1px solid rgba(255,255,255,0.28)'
                              : '1px solid rgba(23,22,20,0.16)',
                          borderRadius: '999px',
                          background:
                            theme === 'dark'
                              ? 'rgba(24,23,21,0.82)'
                              : 'rgba(255,255,255,0.90)',
                          backdropFilter: 'blur(7px)',
                          color:
                            theme === 'dark'
                              ? '#ffffff'
                              : '#171614',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background:
                              theme === 'dark'
                                ? '#d8b979'
                                : '#8d6a2e',
                          }}
                        />

                        Featured
                      </div>

                      {/* SLIDE INDICATORS */}

                      {showcaseSlides.length > 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '27px',
                            right: '22px',
                            zIndex: 5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                          }}
                        >
                          {showcaseSlides.map(
                            (slide, index) => (
                              <button
                                key={slide.id}
                                type="button"
                                aria-label={`Show ${slide.title}`}
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  setActiveSlide(index)
                                }}
                                style={{
                                  width:
                                    index === activeSlide
                                      ? '28px'
                                      : '7px',
                                  height: '4px',
                                  padding: 0,
                                  border: 0,
                                  borderRadius: '999px',
                                  background:
                                    index === activeSlide
                                      ? theme === 'dark'
                                        ? '#d8b979'
                                        : '#8d6a2e'
                                      : theme === 'dark'
                                        ? 'rgba(255,255,255,0.5)'
                                        : 'rgba(23,22,20,0.28)',
                                  cursor: 'pointer',
                                  transition:
                                    'all 0.3s ease',
                                }}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        TEXT AREA
                    ================================================= */}

                    <div
                      style={{
                        flex: 1,
                        minHeight: 0,
                        padding: '23px 26px 24px',
                        background: 'var(--surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      {/* EYEBROW */}

                      <div
                        style={{
                          marginBottom: '7px',
                          color:
                            theme === 'dark'
                              ? '#d8b979'
                              : '#8d6a2e',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '1.6px',
                          lineHeight: 1.3,
                          textTransform: 'uppercase',
                        }}
                      >
                        {currentSlide.eyebrow}
                      </div>

                      {/* TITLE */}

                      <h2
                        style={{
                          margin: 0,
                          color: 'var(--text)',
                          fontSize: '36px',
                          lineHeight: 1,
                          letterSpacing: '-1.4px',
                          fontWeight: 700,
                        }}
                      >
                        {currentSlide.title}
                      </h2>

                      {/* DESCRIPTION */}

                      <p
                        style={{
                          margin: '9px 0 0',
                          maxWidth: '520px',
                          color: 'var(--text-secondary)',
                          fontSize: '12.5px',
                          lineHeight: 1.5,
                        }}
                      >
                        {currentSlide.description}
                      </p>

                      {/* EXPLORE LINK */}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          marginTop: '12px',
                          color: 'var(--text)',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        Explore {currentSlide.title}

                        <span
                          style={{
                            color:
                              theme === 'dark'
                                ? '#d8b979'
                                : '#8d6a2e',
                            fontSize: '18px',
                            lineHeight: 1,
                          }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '590px',
                  padding: '10px',
                  border:
                    '1px solid var(--border-strong)',
                  borderRadius: '19px',
                  background: 'var(--surface)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border:
                      '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  Loading collection...
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          15%+ DISCOUNT SLIDING BAR
      ===================================================== */}

      <section
        className="shopora-discount-section"
        style={{
          position: 'relative',
          width: '100%',
          height: '58px',
          overflow: 'hidden',
          borderTop:
            '1px solid var(--border-strong)',
          borderBottom:
            '1px solid var(--border-strong)',
          background: 'var(--surface)',
        }}
      >
        <Link
          to="/products?discount=15"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <div
            className="shopora-discount-track"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: 'max-content',
              animation:
                'shoporaDiscountTicker 24s linear infinite',
            }}
          >
            {/* FIRST SET */}

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={`first-${item}`}
                  className="shopora-discount-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '23px',
                    height: '100%',
                    padding: '0 38px',
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1,
                    color: 'var(--text)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontSize: '15px',
                      lineHeight: 1,
                    }}
                  >
                    ✦
                  </span>

                  <span>
                    Selected products are now
                  </span>

                  <strong
                    style={{
                      color: 'var(--accent)',
                      fontWeight: 800,
                    }}
                  >
                    15%+ OFF
                  </strong>

                  <span
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Discover the offers →
                  </span>
                </div>
              )
            )}

            {/* SECOND IDENTICAL SET
                Needed for seamless infinite scrolling */}

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={`second-${item}`}
                  className="shopora-discount-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '23px',
                    height: '100%',
                    padding: '0 38px',
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1,
                    color: 'var(--text)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontSize: '15px',
                      lineHeight: 1,
                    }}
                  >
                    ✦
                  </span>

                  <span>
                    Selected products are now
                  </span>

                  <strong
                    style={{
                      color: 'var(--accent)',
                      fontWeight: 800,
                    }}
                  >
                    15%+ OFF
                  </strong>

                  <span
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Discover the offers →
                  </span>
                </div>
              )
            )}
          </div>
        </Link>
      </section>

      {/* =====================================================
          FEATURED BRANDS
      ===================================================== */}

      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '90px 28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '30px',
            marginBottom: '38px',
          }}
        >
          <div>
            <div
              style={{
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Featured Brands
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(30px, 4vw, 46px)',
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
              }}
            >
              Shop by brand.
            </h2>

            <p
              style={{
                margin: '14px 0 0',
                maxWidth: '620px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                fontSize: '15px',
              }}
            >
              Explore collections from brands with
              multiple products available in our store.
            </p>
          </div>

          <Link
            to="/products"
            style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            View all products →
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading brands...
          </div>
        ) : featuredBrands.length === 0 ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            No featured brands available.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {featuredBrands.map(
              ({ brand, products: brandProducts }) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() =>
                    handleBrandClick(brand)
                  }
                  style={{
                    overflow: 'hidden',
                    textAlign: 'left',
                    border:
                      '1px solid var(--border)',
                    borderRadius: '14px',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    padding: 0,
                    cursor: 'pointer',
                    transition:
                      'transform 0.25s ease, border-color 0.25s ease',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform =
                      'translateY(-5px)'

                    event.currentTarget.style.borderColor =
                      'var(--border-strong)'
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform =
                      'translateY(0)'

                    event.currentTarget.style.borderColor =
                      'var(--border)'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(3, 1fr)',
                      gap: '1px',
                      height: '220px',
                      background: 'var(--border)',
                    }}
                  >
                    {brandProducts
                      .slice(0, 3)
                      .map((product) => (
                        <div
                          key={product.id}
                          style={{
                            overflow: 'hidden',
                            background:
                              theme === 'dark'
                                ? '#181715'
                                : '#f5f3ef',
                          }}
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>
                      ))}
                  </div>

                  <div
                    style={{
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                          'space-between',
                        gap: '15px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '22px',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {brand}
                      </h3>

                      <span
                        style={{
                          color: 'var(--accent)',
                          fontSize: '20px',
                        }}
                      >
                        →
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '10px 0 0',
                        color:
                          'var(--text-secondary)',
                        fontSize: '13px',
                        lineHeight: 1.5,
                      }}
                    >
                      {brandProducts.length}{' '}
                      {brandProducts.length === 1
                        ? 'product'
                        : 'products'}{' '}
                      available
                    </p>
                  </div>
                </button>
              )
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '85px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              maxWidth: '700px',
            }}
          >
            <div
              style={{
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Need help?
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(30px, 4vw, 48px)',
                letterSpacing: '-1.5px',
              }}
            >
              We're here for you.
            </h2>

            <p
              style={{
                margin: '16px 0 0',
                color: 'var(--text-secondary)',
                fontSize: '15px',
                lineHeight: 1.7,
                maxWidth: '580px',
              }}
            >
              Have a question about a product, your
              order, or anything else? Get in touch
              with our team.
            </p>
          </div>

          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50px',
              padding: '0 28px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Contact Us →
          </Link>
        </div>
      </section>

      {/* =====================================================
          ANIMATIONS + RESPONSIVE
      ===================================================== */}

      <style>
        {`
          @keyframes shoporaProductImage {
            from {
              opacity: 0;
              transform: scale(1.025);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes shoporaDiscountTicker {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          .shopora-discount-track:hover {
            animation-play-state: paused;
          }

          @media (max-width: 1050px) {
            .shopora-hero {
              grid-template-columns: 1fr !important;
              gap: 55px !important;
            }

            .shopora-showcase {
              max-width: 720px;
              margin: 0 auto;
            }
          }

          @media (max-width: 600px) {
            .shopora-hero {
              gap: 40px !important;
            }

            .shopora-showcase {
              width: 100%;
            }

            .shopora-showcase > a > div {
              height: 540px !important;
            }

            .shopora-showcase > a > div > div {
              height: 100% !important;
            }

            .shopora-showcase img {
              padding: 12px !important;
            }

            .shopora-discount-section {
              height: 54px !important;
            }

            .shopora-discount-item {
              padding-left: 25px !important;
              padding-right: 25px !important;
              gap: 16px !important;
              font-size: 12px !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .shopora-discount-track {
              animation: none !important;
            }

            .shopora-showcase img {
              animation: none !important;
            }
          }
        `}
      </style>
    </main>
  )
}

export default Home