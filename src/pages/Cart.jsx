import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const CART_KEY = 'shopora-cart'

const Cart = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [cart, setCart] = useState([])
  const [updatingId, setUpdatingId] = useState(null)

  /* -----------------------------
     LOAD CART
  ----------------------------- */
  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem(CART_KEY)

      if (!storedCart) {
        setCart([])
        return
      }

      const parsedCart = JSON.parse(storedCart)

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart)
      } else {
        setCart([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart([])
    }
  }

  useEffect(() => {
    loadCart()

    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('storage', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleCartUpdate)
    }
  }, [])

  /* -----------------------------
     SAVE CART
  ----------------------------- */
  const saveCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem(CART_KEY, JSON.stringify(newCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  /* -----------------------------
     UPDATE QUANTITY
  ----------------------------- */
  const updateQuantity = (id, change) => {
    setUpdatingId(id)

    const newCart = cart
      .map((item) => {
        if (String(item.id) !== String(id)) {
          return item
        }

        const currentQuantity = Number(item.quantity || 1)
        const newQuantity = currentQuantity + change

        if (newQuantity <= 0) {
          return null
        }

        return {
          ...item,
          quantity: newQuantity,
        }
      })
      .filter(Boolean)

    saveCart(newCart)

    setTimeout(() => {
      setUpdatingId(null)
    }, 150)
  }

  /* -----------------------------
     REMOVE PRODUCT
  ----------------------------- */
  const removeItem = (id) => {
    const newCart = cart.filter(
      (item) => String(item.id) !== String(id)
    )

    saveCart(newCart)
  }

  /* -----------------------------
     CLEAR CART
  ----------------------------- */
  const clearCart = () => {
    saveCart([])
  }

  /* -----------------------------
     CART TOTALS
  ----------------------------- */
  const totals = useMemo(() => {
    let subtotal = 0
    let originalTotal = 0
    let itemCount = 0

    cart.forEach((item) => {
      const quantity = Number(item.quantity || 1)
      const price = Number(item.price || 0)
      const discount = Number(item.discountPercentage || 0)

      const originalPrice =
        discount > 0
          ? price / (1 - discount / 100)
          : price

      subtotal += price * quantity
      originalTotal += originalPrice * quantity
      itemCount += quantity
    })

    const savings = Math.max(originalTotal - subtotal, 0)

    return {
      subtotal,
      originalTotal,
      savings,
      itemCount,
    }
  }, [cart])

  /* -----------------------------
     CHECKOUT
  ----------------------------- */
  const handleCheckout = () => {
    if (cart.length === 0) return

    navigate('/checkout')
  }

  /* -----------------------------
     FORMAT PRICE
  ----------------------------- */
  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`
  }

  /* -----------------------------
     EMPTY CART
  ----------------------------- */
  if (cart.length === 0) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 72px)',
          padding: '70px 24px',
          background: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '70px 30px',
            borderRadius: '18px',
            background:
              'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
            border: '1px solid var(--border)',
            boxShadow: '0 18px 50px var(--shadow)',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(168, 132, 69, 0.10)',
              border: '1px solid rgba(168, 132, 69, 0.25)',
              color: 'var(--accent)',
              fontSize: '32px',
            }}
          >
            🛍
          </div>

          <h1
            style={{
              margin: '0 0 12px',
              fontSize: '38px',
              fontWeight: '650',
              letterSpacing: '-1.2px',
            }}
          >
            Your cart is empty
          </h1>

          <p
            style={{
              margin: '0 auto 30px',
              maxWidth: '500px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              fontSize: '15px',
            }}
          >
            Looks like you haven't added anything to your cart yet.
            Explore our collection and find something you love.
          </p>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 24px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              letterSpacing: '0.2px',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 72px)',
        padding: '42px 24px 70px',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: '28px',
            padding: '28px 30px',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 72%, rgba(168, 132, 69, 0.06) 100%)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px var(--shadow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 8px',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                Your Selection
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: '42px',
                  lineHeight: 1.05,
                  fontWeight: '650',
                  letterSpacing: '-1.5px',
                }}
              >
                Shopping Cart
              </h1>

              <p
                style={{
                  margin: '10px 0 0',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                {totals.itemCount}{' '}
                {totals.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              style={{
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1fr) 360px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* PRODUCTS */}
          <section>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {cart.map((item) => {
                const quantity = Number(item.quantity || 1)
                const price = Number(item.price || 0)
                const discount = Number(
                  item.discountPercentage || 0
                )

                return (
                  <article
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '110px minmax(0, 1fr) auto',
                      gap: '20px',
                      alignItems: 'center',
                      padding: '18px',
                      borderRadius: '14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 6px 22px var(--shadow)',
                    }}
                  >
                    {/* IMAGE */}
                    <Link
                      to={`/product/${item.id}`}
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'block',
                        background:
                          theme === 'light'
                            ? '#f4f0e7'
                            : '#2a2824',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </Link>

                    {/* INFO */}
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <Link
                        to={`/product/${item.id}`}
                        style={{
                          color: 'var(--text)',
                          textDecoration: 'none',
                        }}
                      >
                        <h2
                          style={{
                            margin: '0 0 7px',
                            fontSize: '17px',
                            lineHeight: 1.35,
                            fontWeight: '650',
                          }}
                        >
                          {item.title}
                        </h2>
                      </Link>

                      {item.brand && (
                        <p
                          style={{
                            margin: '0 0 10px',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                          }}
                        >
                          {item.brand}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <strong
                          style={{
                            fontSize: '17px',
                            color: 'var(--accent)',
                          }}
                        >
                          {formatPrice(price)}
                        </strong>

                        {discount > 0 && (
                          <span
                            style={{
                              padding: '4px 7px',
                              borderRadius: '5px',
                              background:
                                'rgba(168, 132, 69, 0.10)',
                              color: 'var(--accent)',
                              fontSize: '10px',
                              fontWeight: '700',
                              letterSpacing: '0.4px',
                            }}
                          >
                            {Math.round(discount)}% OFF
                          </span>
                        )}
                      </div>

                      {/* QUANTITY */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '16px',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                          }}
                        >
                          Quantity
                        </span>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--border)',
                            borderRadius: '7px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, -1)
                            }
                            disabled={updatingId === item.id}
                            style={{
                              width: '32px',
                              height: '30px',
                              border: 0,
                              borderRight:
                                '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--text)',
                              cursor: 'pointer',
                              fontSize: '17px',
                            }}
                          >
                            −
                          </button>

                          <span
                            style={{
                              minWidth: '36px',
                              textAlign: 'center',
                              fontSize: '13px',
                              fontWeight: '650',
                            }}
                          >
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, 1)
                            }
                            disabled={updatingId === item.id}
                            style={{
                              width: '32px',
                              height: '30px',
                              border: 0,
                              borderLeft:
                                '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--text)',
                              cursor: 'pointer',
                              fontSize: '17px',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div
                      style={{
                        textAlign: 'right',
                        alignSelf: 'stretch',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        gap: '15px',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '16px',
                        }}
                      >
                        {formatPrice(price * quantity)}
                      </strong>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          border: 0,
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '5px 0',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* SUMMARY */}
          <aside
            style={{
              position: 'sticky',
              top: '92px',
              padding: '24px',
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 32px var(--shadow)',
            }}
          >
            <h2
              style={{
                margin: '0 0 22px',
                fontSize: '21px',
                fontWeight: '650',
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '20px',
                  fontSize: '14px',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Items
                </span>

                <span>{totals.itemCount}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '20px',
                  fontSize: '14px',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Subtotal
                </span>

                <span>{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.savings > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px',
                    fontSize: '14px',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--success)',
                    }}
                  >
                    You save
                  </span>

                  <span
                    style={{
                      color: 'var(--success)',
                      fontWeight: '650',
                    }}
                  >
                    −{formatPrice(totals.savings)}
                  </span>
                </div>
              )}

              <div
                style={{
                  height: '1px',
                  background: 'var(--border)',
                  margin: '5px 0',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '650',
                  }}
                >
                  Total
                </span>

                <strong
                  style={{
                    fontSize: '26px',
                    color: 'var(--accent)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {formatPrice(totals.subtotal)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              style={{
                width: '100%',
                height: '50px',
                marginTop: '24px',
                border: 0,
                borderRadius: '8px',
                background: 'var(--accent)',
                color: 'var(--bg)',
                cursor: 'pointer',
                fontWeight: '750',
                fontSize: '14px',
                letterSpacing: '0.2px',
              }}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '46px',
                marginTop: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '650',
              }}
            >
              Continue Shopping
            </Link>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <p
                style={{
                  margin: '0 0 7px',
                  fontSize: '12px',
                  fontWeight: '650',
                }}
              >
                Secure Checkout
              </p>

              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  lineHeight: 1.6,
                }}
              >
                Your order information is handled securely.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Cart