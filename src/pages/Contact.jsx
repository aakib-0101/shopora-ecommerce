import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const Contact = () => {
  const { theme } = useTheme()

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setSubmitted(true)

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 76px)',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '70px 28px 90px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          style={{
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 58px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <span
              style={{
                width: '30px',
                height: '1px',
                background: 'var(--accent)',
                display: 'inline-block',
              }}
            />

            Get In Touch

            <span
              style={{
                width: '30px',
                height: '1px',
                background: 'var(--accent)',
                display: 'inline-block',
              }}
            />
          </div>

          <h1
            style={{
              margin: '0 0 18px',
              fontSize: 'clamp(42px, 6vw, 68px)',
              lineHeight: '0.98',
              letterSpacing: '-2.5px',
              fontWeight: '700',
            }}
          >
            We'd love to
            <span
              style={{
                display: 'block',
                color: 'var(--accent)',
                fontStyle: 'italic',
              }}
            >
              hear from you.
            </span>
          </h1>

          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: '16px',
              lineHeight: '1.8',
            }}
          >
            Have a question about an order, a product, or anything
            else? Send us a message and our team will get back to you.
          </p>
        </section>

        {/* ==================================================
            MAIN CONTACT AREA
        ================================================== */}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr',
            gap: '28px',
            alignItems: 'stretch',
          }}
        >
          {/* ==================================================
              CONTACT INFORMATION
          ================================================== */}

          <div
            style={{
              background:
                'linear-gradient(145deg, var(--surface) 0%, var(--surface-2) 100%)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 35px var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Contact Information
            </div>

            <h2
              style={{
                margin: '0 0 16px',
                fontSize: '30px',
                lineHeight: '1.15',
                letterSpacing: '-0.8px',
              }}
            >
              Let's start a
              <br />
              conversation.
            </h2>

            <p
              style={{
                margin: '0 0 34px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.8',
              }}
            >
              Our support team is here to help with orders,
              products, payments, returns, and anything else you
              may need.
            </p>

            {/* EMAIL */}

            <a
              href="mailto:support@shopora.com"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                textDecoration: 'none',
                color: 'inherit',
                padding: '18px 0',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(168, 132, 69, 0.10)',
                  border: '1px solid rgba(168, 132, 69, 0.22)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '19px',
                  flexShrink: 0,
                }}
              >
                @
              </div>

              <div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '5px',
                  }}
                >
                  Email
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  support@shopora.com
                </div>
              </div>
            </a>

            {/* PHONE */}

            <a
              href="tel:+919999999999"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                textDecoration: 'none',
                color: 'inherit',
                padding: '18px 0',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(168, 132, 69, 0.10)',
                  border: '1px solid rgba(168, 132, 69, 0.22)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                ☎
              </div>

              <div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '5px',
                  }}
                >
                  Phone
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  +91 99999 99999
                </div>
              </div>
            </a>

            {/* HOURS */}

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '18px 0',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(168, 132, 69, 0.10)',
                  border: '1px solid rgba(168, 132, 69, 0.22)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                ◷
              </div>

              <div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '5px',
                  }}
                >
                  Support Hours
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    lineHeight: '1.6',
                  }}
                >
                  Monday – Saturday
                  <br />
                  9:00 AM – 7:00 PM
                </div>
              </div>
            </div>

            {/* BOTTOM NOTE */}

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '28px',
              }}
            >
              <div
                style={{
                  padding: '18px',
                  borderRadius: '10px',
                  background:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.035)'
                      : 'rgba(0,0,0,0.025)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    color: 'var(--accent)',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '7px',
                  }}
                >
                  Usually replies within 24 hours
                </div>

                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    lineHeight: '1.6',
                  }}
                >
                  For faster assistance with an existing order,
                  please include your order details in your message.
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              CONTACT FORM
          ================================================== */}

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 35px var(--shadow)',
            }}
          >
            {submitted ? (
              <div
                style={{
                  minHeight: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '30px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 22px',
                      borderRadius: '50%',
                      border:
                        '1px solid rgba(168, 132, 69, 0.35)',
                      background: 'rgba(168, 132, 69, 0.10)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}
                  >
                    ✓
                  </div>

                  <h2
                    style={{
                      margin: '0 0 12px',
                      fontSize: '30px',
                      letterSpacing: '-0.7px',
                    }}
                  >
                    Message received.
                  </h2>

                  <p
                    style={{
                      margin: '0 auto 26px',
                      maxWidth: '420px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      lineHeight: '1.8',
                    }}
                  >
                    Thank you for reaching out to Shopora. Our team
                    will review your message and get back to you
                    shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      border: '1px solid var(--accent)',
                      background: 'transparent',
                      color: 'var(--accent)',
                      borderRadius: '7px',
                      padding: '11px 20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    color: 'var(--accent)',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Send a Message
                </div>

                <h2
                  style={{
                    margin: '0 0 28px',
                    fontSize: '30px',
                    letterSpacing: '-0.8px',
                  }}
                >
                  How can we help?
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* NAME + EMAIL */}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '18px',
                      marginBottom: '18px',
                    }}
                  >
                    <div>
                      <label
                        htmlFor="name"
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Your Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 13px',
                          borderRadius: '7px',
                          border: '1px solid var(--border-strong)',
                          outline: 'none',
                          background: 'var(--input-bg)',
                          color: 'var(--text)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 13px',
                          borderRadius: '7px',
                          border: '1px solid var(--border-strong)',
                          outline: 'none',
                          background: 'var(--input-bg)',
                          color: 'var(--text)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}

                  <div style={{ marginBottom: '18px' }}>
                    <label
                      htmlFor="subject"
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                      required
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 13px',
                        borderRadius: '7px',
                        border: '1px solid var(--border-strong)',
                        outline: 'none',
                        background: 'var(--input-bg)',
                        color: 'var(--text)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  {/* MESSAGE */}

                  <div style={{ marginBottom: '24px' }}>
                    <label
                      htmlFor="message"
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      rows={7}
                      style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '7px',
                        border: '1px solid var(--border-strong)',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '150px',
                        background: 'var(--input-bg)',
                        color: 'var(--text)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                      }}
                    />
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      height: '48px',
                      border: 'none',
                      borderRadius: '7px',
                      background: 'var(--accent)',
                      color: 'var(--bg)',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      letterSpacing: '0.1px',
                    }}
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </section>

        {/* ==================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <div
          style={{
            marginTop: '34px',
            textAlign: 'center',
          }}
        >
          <Link
            to="/products"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* ==================================================
          RESPONSIVE STYLES
      ================================================== */}

      <style>
        {`
          @media (max-width: 850px) {
            main {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }

            main > div > section:nth-of-type(2) {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            main {
              padding-top: 45px !important;
              padding-bottom: 60px !important;
            }

            main > div > section:first-of-type {
              margin-bottom: 38px !important;
            }

            main > div > section:first-of-type h1 {
              font-size: 43px !important;
            }

            main > div > section:nth-of-type(2) > div {
              padding: 25px !important;
            }

            form > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </main>
  )
}

export default Contact