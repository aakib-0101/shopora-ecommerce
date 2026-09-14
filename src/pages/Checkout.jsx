import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()

  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })

  const [errors, setErrors] = useState({})

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('shopora-cart')
      const parsedCart = storedCart
        ? JSON.parse(storedCart)
        : []

      setCart(Array.isArray(parsedCart) ? parsedCart : [])
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [])

  // =====================================================
  // CART TOTALS
  // =====================================================

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    )

    const originalTotal = cart.reduce(
      (total, item) => {
        const price = Number(item.price || 0)
        const discount = Number(
          item.discountPercentage || 0
        )

        const originalPrice =
          discount > 0
            ? price / (1 - discount / 100)
            : price

        return (
          total +
          originalPrice * Number(item.quantity || 0)
        )
      },
      0
    )

    const savings = Math.max(
      0,
      originalTotal - subtotal
    )

    const shipping =
      deliveryMethod === 'express'
        ? subtotal > 100
          ? 14.99
          : 19.99
        : subtotal > 100
        ? 0
        : 7.99

    const tax = subtotal * 0.08

    const total =
      subtotal + shipping + tax

    const itemCount = cart.reduce(
      (count, item) =>
        count + Number(item.quantity || 0),
      0
    )

    return {
      subtotal,
      originalTotal,
      savings,
      shipping,
      tax,
      total,
      itemCount,
    }
  }, [cart, deliveryMethod])

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target

    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {}

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email = 'Enter a valid email'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!form.pincode.trim()) {
      newErrors.pincode =
        'Postal code is required'
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number.trim()) {
        newErrors.number =
          'Card number is required'
      }

      if (!cardDetails.expiry.trim()) {
        newErrors.expiry =
          'Expiry date is required'
      }

      if (!cardDetails.cvv.trim()) {
        newErrors.cvv =
          'Security code is required'
      }

      if (!cardDetails.name.trim()) {
        newErrors.name =
          'Cardholder name is required'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    const order = {
      id: `SH-${Date.now()}`,
      items: cart,
      customer: form,
      deliveryMethod,
      paymentMethod,
      totals,
      createdAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(
        'shopora-last-order',
        JSON.stringify(order)
      )

      localStorage.removeItem('shopora-cart')

      window.dispatchEvent(
        new Event('cartUpdated')
      )

      setOrderPlaced(true)
    } catch (error) {
      console.error(
        'Error placing order:',
        error
      )
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}
        >
          Loading checkout...
        </div>
      </main>
    )
  }

  // =====================================================
  // ORDER SUCCESS
  // =====================================================

  if (orderPlaced) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'var(--bg)',
          color: 'var(--text)',
          padding: '70px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            padding: '55px 45px',
            background:
              'linear-gradient(145deg, var(--surface), var(--surface-2))',
            border:
              '1px solid var(--border-strong)',
            borderRadius: '18px',
            textAlign: 'center',
            boxShadow:
              '0 25px 70px var(--shadow)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'rgba(168, 132, 69, 0.12)',
              border:
                '1px solid rgba(168, 132, 69, 0.35)',
              color: 'var(--accent)',
              fontSize: '30px',
            }}
          >
            ✓
          </div>

          <p
            style={{
              margin: '0 0 8px',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Order Confirmed
          </p>

          <h1
            style={{
              margin: '0 0 14px',
              fontSize: '38px',
              fontWeight: '600',
              letterSpacing: '-1px',
            }}
          >
            Thank you for your order.
          </h1>

          <p
            style={{
              margin: '0 auto',
              maxWidth: '470px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          >
            Your order has been placed successfully.
            We've saved your order details and your
            items are now being prepared.
          </p>

          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--surface)',
              border:
                '1px solid var(--border)',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '12px',
              }}
            >
              Order Total
            </span>

            <div
              style={{
                marginTop: '4px',
                color: 'var(--accent)',
                fontSize: '25px',
                fontWeight: '700',
              }}
            >
              ${totals.total.toFixed(2)}
            </div>
          </div>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '28px',
              padding: '13px 24px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'var(--bg)',
          color: 'var(--text)',
          padding: '80px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              fontSize: '55px',
              color: 'var(--accent)',
              marginBottom: '18px',
            }}
          >
            ♡
          </div>

          <h1
            style={{
              margin: '0 0 12px',
              fontSize: '34px',
              fontWeight: '600',
            }}
          >
            Your cart is empty
          </h1>

          <p
            style={{
              margin: '0',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          >
            Add something you love to your cart before
            continuing to checkout.
          </p>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              marginTop: '25px',
              padding: '13px 24px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  // =====================================================
  // INPUT STYLE
  // =====================================================

  const inputStyle = (field) => ({
    width: '100%',
    height: '46px',
    padding: '0 13px',
    borderRadius: '8px',
    border: errors[field]
      ? '1px solid var(--danger)'
      : '1px solid var(--border)',
    background: 'var(--input-bg)',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '13px',
  })

  const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: 'var(--text)',
    fontSize: '12px',
    fontWeight: '600',
  }

  const errorStyle = {
    marginTop: '5px',
    color: 'var(--danger)',
    fontSize: '11px',
  }

  // =====================================================
  // CHECKOUT UI
  // =====================================================

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '50px 28px 80px',
      }}
    >
      <div
        style={{
          maxWidth: '1250px',
          margin: '0 auto',
        }}
      >
        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom: '35px',
          }}
        >
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
            Shopora
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: '42px',
              lineHeight: '1.1',
              fontWeight: '600',
              letterSpacing: '-1.5px',
            }}
          >
            Checkout
          </h1>

          <p
            style={{
              margin: '10px 0 0',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}
          >
            Complete your details to place your order.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(0, 1.45fr) minmax(340px, 0.75fr)',
              gap: '28px',
              alignItems: 'start',
            }}
          >
            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* CONTACT */}

              <section
                style={{
                  padding: '25px',
                  background: 'var(--surface)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    marginBottom: '22px',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '19px',
                      fontWeight: '600',
                    }}
                  >
                    Contact Information
                  </h2>

                  <p
                    style={{
                      margin: '6px 0 0',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                    }}
                  >
                    We'll use this information for
                    your order updates.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: '17px',
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      First Name
                    </label>

                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      style={inputStyle(
                        'firstName'
                      )}
                    />

                    {errors.firstName && (
                      <div style={errorStyle}>
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Last Name
                    </label>

                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      style={inputStyle(
                        'lastName'
                      )}
                    />

                    {errors.lastName && (
                      <div style={errorStyle}>
                        {errors.lastName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      style={inputStyle('email')}
                    />

                    {errors.email && (
                      <div style={errorStyle}>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      style={inputStyle('phone')}
                    />

                    {errors.phone && (
                      <div style={errorStyle}>
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SHIPPING ADDRESS */}

              <section
                style={{
                  padding: '25px',
                  background: 'var(--surface)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    marginBottom: '22px',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '19px',
                      fontWeight: '600',
                    }}
                  >
                    Shipping Address
                  </h2>

                  <p
                    style={{
                      margin: '6px 0 0',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                    }}
                  >
                    Where should we deliver your order?
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: '17px',
                  }}
                >
                  <div
                    style={{
                      gridColumn: '1 / -1',
                    }}
                  >
                    <label style={labelStyle}>
                      Street Address
                    </label>

                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      style={inputStyle(
                        'address'
                      )}
                    />

                    {errors.address && (
                      <div style={errorStyle}>
                        {errors.address}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      gridColumn: '1 / -1',
                    }}
                  >
                    <label style={labelStyle}>
                      Apartment, Suite, etc.{' '}
                      <span
                        style={{
                          color:
                            'var(--text-secondary)',
                          fontWeight: '400',
                        }}
                      >
                        (optional)
                      </span>
                    </label>

                    <input
                      name="apartment"
                      value={form.apartment}
                      onChange={handleChange}
                      placeholder="Apartment 4B"
                      style={inputStyle(
                        'apartment'
                      )}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      City
                    </label>

                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      style={inputStyle('city')}
                    />

                    {errors.city && (
                      <div style={errorStyle}>
                        {errors.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      State
                    </label>

                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      style={inputStyle('state')}
                    />

                    {errors.state && (
                      <div style={errorStyle}>
                        {errors.state}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Postal Code
                    </label>

                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      style={inputStyle(
                        'pincode'
                      )}
                    />

                    {errors.pincode && (
                      <div style={errorStyle}>
                        {errors.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* DELIVERY */}

              <section
                style={{
                  padding: '25px',
                  background: 'var(--surface)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <h2
                  style={{
                    margin: '0 0 18px',
                    fontSize: '19px',
                    fontWeight: '600',
                  }}
                >
                  Delivery Method
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                      gap: '15px',
                      padding: '15px',
                      borderRadius: '9px',
                      border:
                        deliveryMethod ===
                        'standard'
                          ? '1px solid var(--accent)'
                          : '1px solid var(--border)',
                      background:
                        deliveryMethod ===
                        'standard'
                          ? 'rgba(168, 132, 69, 0.06)'
                          : 'var(--surface-2)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={
                          deliveryMethod ===
                          'standard'
                        }
                        onChange={() =>
                          setDeliveryMethod(
                            'standard'
                          )
                        }
                      />

                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          Standard Delivery
                        </div>

                        <div
                          style={{
                            marginTop: '3px',
                            color:
                              'var(--text-secondary)',
                            fontSize: '11px',
                          }}
                        >
                          Arrives in 5–7 business
                          days
                        </div>
                      </div>
                    </div>

                    <strong
                      style={{
                        color: 'var(--accent)',
                        fontSize: '13px',
                      }}
                    >
                      {totals.subtotal > 100
                        ? 'FREE'
                        : '$7.99'}
                    </strong>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                      gap: '15px',
                      padding: '15px',
                      borderRadius: '9px',
                      border:
                        deliveryMethod ===
                        'express'
                          ? '1px solid var(--accent)'
                          : '1px solid var(--border)',
                      background:
                        deliveryMethod ===
                        'express'
                          ? 'rgba(168, 132, 69, 0.06)'
                          : 'var(--surface-2)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={
                          deliveryMethod ===
                          'express'
                        }
                        onChange={() =>
                          setDeliveryMethod(
                            'express'
                          )
                        }
                      />

                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          Express Delivery
                        </div>

                        <div
                          style={{
                            marginTop: '3px',
                            color:
                              'var(--text-secondary)',
                            fontSize: '11px',
                          }}
                        >
                          Arrives in 1–2 business
                          days
                        </div>
                      </div>
                    </div>

                    <strong
                      style={{
                        color: 'var(--accent)',
                        fontSize: '13px',
                      }}
                    >
                      {totals.subtotal > 100
                        ? '$14.99'
                        : '$19.99'}
                    </strong>
                  </label>
                </div>
              </section>

              {/* PAYMENT */}

              <section
                style={{
                  padding: '25px',
                  background: 'var(--surface)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '19px',
                      fontWeight: '600',
                    }}
                  >
                    Payment
                  </h2>

                  <p
                    style={{
                      margin: '6px 0 0',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                    }}
                  >
                    Choose your preferred payment
                    method.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('card')
                    }
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border:
                        paymentMethod === 'card'
                          ? '1px solid var(--accent)'
                          : '1px solid var(--border)',
                      background:
                        paymentMethod === 'card'
                          ? 'rgba(168, 132, 69, 0.08)'
                          : 'var(--surface-2)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Card
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('cod')
                    }
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border:
                        paymentMethod === 'cod'
                          ? '1px solid var(--accent)'
                          : '1px solid var(--border)',
                      background:
                        paymentMethod === 'cod'
                          ? 'rgba(168, 132, 69, 0.08)'
                          : 'var(--surface-2)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr',
                      gap: '17px',
                    }}
                  >
                    <div
                      style={{
                        gridColumn:
                          '1 / -1',
                      }}
                    >
                      <label style={labelStyle}>
                        Cardholder Name
                      </label>

                      <input
                        name="name"
                        value={cardDetails.name}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        style={inputStyle('name')}
                      />

                      {errors.name && (
                        <div style={errorStyle}>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        gridColumn:
                          '1 / -1',
                      }}
                    >
                      <label style={labelStyle}>
                        Card Number
                      </label>

                      <input
                        name="number"
                        value={cardDetails.number}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        style={inputStyle(
                          'number'
                        )}
                      />

                      {errors.number && (
                        <div style={errorStyle}>
                          {errors.number}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Expiry Date
                      </label>

                      <input
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder="MM / YY"
                        maxLength={7}
                        style={inputStyle(
                          'expiry'
                        )}
                      />

                      {errors.expiry && (
                        <div style={errorStyle}>
                          {errors.expiry}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Security Code
                      </label>

                      <input
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="CVV"
                        maxLength={4}
                        type="password"
                        style={inputStyle('cvv')}
                      />

                      {errors.cvv && (
                        <div style={errorStyle}>
                          {errors.cvv}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '9px',
                      background:
                        'var(--surface-2)',
                      border:
                        '1px solid var(--border)',
                      color:
                        'var(--text-secondary)',
                      fontSize: '12px',
                      lineHeight: '1.6',
                    }}
                  >
                    Pay with cash when your order is
                    delivered to your address.
                  </div>
                )}
              </section>
            </div>

            {/* =================================================
                RIGHT SIDE — ORDER SUMMARY
            ================================================= */}

            <aside
              style={{
                position: 'sticky',
                top: '25px',
                padding: '25px',
                background:
                  'linear-gradient(145deg, var(--surface), var(--surface-2))',
                border:
                  '1px solid var(--border-strong)',
                borderRadius: '13px',
                boxShadow:
                  '0 15px 45px var(--shadow)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 22px',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                Order Summary
              </h2>

              {/* ITEMS */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  maxHeight: '390px',
                  overflowY: 'auto',
                  paddingRight: '3px',
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '62px',
                        height: '62px',
                        flexShrink: 0,
                        borderRadius: '8px',
                        background:
                          'var(--surface-2)',
                        border:
                          '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={
                          item.thumbnail ||
                          item.image
                        }
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '5px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          color: 'var(--text)',
                          fontSize: '12px',
                          fontWeight: '600',
                          lineHeight: '1.4',
                          display:
                            '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          marginTop: '4px',
                          color:
                            'var(--text-secondary)',
                          fontSize: '11px',
                        }}
                      >
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div
                      style={{
                        color: 'var(--accent)',
                        fontSize: '13px',
                        fontWeight: '650',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      $
                      {(
                        Number(item.price || 0) *
                        Number(
                          item.quantity || 0
                        )
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  height: '1px',
                  background: 'var(--border)',
                  margin: '22px 0',
                }}
              />

              {/* TOTALS */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '11px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    color:
                      'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  <span>
                    Subtotal (
                    {totals.itemCount}{' '}
                    {totals.itemCount === 1
                      ? 'item'
                      : 'items'}
                    )
                  </span>

                  <span>
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {totals.savings > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      color: 'var(--success)',
                      fontSize: '13px',
                    }}
                  >
                    <span>Your savings</span>

                    <span>
                      -$
                      {totals.savings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    color:
                      'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  <span>Shipping</span>

                  <span>
                    {totals.shipping === 0
                      ? 'FREE'
                      : `$${totals.shipping.toFixed(
                          2
                        )}`}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    color:
                      'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  <span>Estimated Tax</span>

                  <span>
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: '1px',
                  background:
                    'var(--border-strong)',
                  margin: '20px 0',
                }}
              />

              {/* GRAND TOTAL */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'space-between',
                  gap: '15px',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Total
                </span>

                <span
                  style={{
                    color: 'var(--accent)',
                    fontSize: '25px',
                    fontWeight: '750',
                  }}
                >
                  ${totals.total.toFixed(2)}
                </span>
              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: '22px',
                  height: '50px',
                  border: '1px solid var(--accent)',
                  borderRadius: '8px',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '750',
                  letterSpacing: '0.2px',
                }}
              >
                Place Order
              </button>

              <Link
                to="/cart"
                style={{
                  display: 'block',
                  marginTop: '14px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '12px',
                }}
              >
                ← Return to Cart
              </Link>

              {/* TRUST */}

              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '18px',
                  borderTop:
                    '1px solid var(--border)',
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    color:
                      'var(--text-secondary)',
                    fontSize: '10px',
                    textAlign: 'center',
                  }}
                >
                  Secure<br />Checkout
                </span>

                <span
                  style={{
                    color:
                      'var(--text-secondary)',
                    fontSize: '10px',
                    textAlign: 'center',
                  }}
                >
                  Easy<br />Returns
                </span>

                <span
                  style={{
                    color:
                      'var(--text-secondary)',
                    fontSize: '10px',
                    textAlign: 'center',
                  }}
                >
                  Fast<br />Delivery
                </span>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Checkout