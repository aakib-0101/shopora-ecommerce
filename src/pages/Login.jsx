import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const storedAccount = localStorage.getItem(
        'shopora-account'
      )

      if (!storedAccount) {
        setError(
          'No account found. Please create an account first.'
        )
        setLoading(false)
        return
      }

      const account = JSON.parse(storedAccount)

      if (!account?.email || !account?.password) {
        setError(
          'Your account information is incomplete. Please register again.'
        )
        setLoading(false)
        return
      }

      if (
        account.email.toLowerCase() !== email ||
        account.password !== password
      ) {
        setError('Incorrect email or password.')
        setLoading(false)
        return
      }

      const user = {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
      }

      localStorage.setItem(
        'shopora-user',
        JSON.stringify(user)
      )

      window.dispatchEvent(new Event('userUpdated'))

      navigate('/')
    } catch (error) {
      console.error('Login error:', error)

      setError(
        'Unable to sign in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 13px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--input-bg)',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '13px',
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '55px 24px 75px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.035,
          top: '-230px',
          left: '-170px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.025,
          bottom: '-200px',
          right: '-120px',
          pointerEvents: 'none',
        }}
      />

      <section
        style={{
          width: '100%',
          maxWidth: '430px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: '40px 36px',
            background:
              'linear-gradient(145deg, var(--surface), var(--surface-2))',
            border: '1px solid var(--border-strong)',
            borderRadius: '15px',
            boxShadow: '0 25px 70px var(--shadow)',
          }}
        >
          {/* Header */}

          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(168, 132, 69, 0.10)',
                border: '1px solid rgba(168, 132, 69, 0.28)',
                color: 'var(--accent)',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
            </div>

            <p
              style={{
                margin: '0 0 7px',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
              }}
            >
              Welcome Back
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                lineHeight: '1.15',
                fontWeight: '600',
                letterSpacing: '-1px',
              }}
            >
              Sign in to Shopora
            </h1>

            <p
              style={{
                margin: '10px 0 0',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              Access your account and continue shopping.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '20px',
                padding: '12px 13px',
                borderRadius: '8px',
                background: 'rgba(200, 79, 79, 0.08)',
                border: '1px solid rgba(200, 79, 79, 0.25)',
                color: 'var(--danger)',
                fontSize: '12px',
                lineHeight: '1.5',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}

            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: 'var(--text)',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            {/* Password */}

            <div style={{ marginBottom: '25px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '7px',
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    color: 'var(--text)',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                border: '1px solid var(--accent)',
                borderRadius: '8px',
                background: loading
                  ? 'var(--surface-2)'
                  : 'var(--accent)',
                color: loading
                  ? 'var(--text-secondary)'
                  : 'var(--bg)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '750',
                letterSpacing: '0.2px',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '28px 0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--border)',
              }}
            />

            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              New to Shopora?
            </span>

            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--border)',
              }}
            />
          </div>

          <Link
            to="/register"
            style={{
              width: '100%',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Create Account
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Login