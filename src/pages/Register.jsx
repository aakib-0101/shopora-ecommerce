import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim().toLowerCase()
    const password = form.password
    const confirmPassword = form.confirmPassword

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const existingAccount = localStorage.getItem('shopora-account')

      if (existingAccount) {
        const account = JSON.parse(existingAccount)

        if (
          account?.email &&
          account.email.toLowerCase() === email
        ) {
          setError(
            'An account with this email already exists. Please sign in.'
          )
          setLoading(false)
          return
        }
      }

      const account = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password,
      }

      const user = {
        id: account.id,
        firstName,
        lastName,
        email,
      }

      localStorage.setItem(
        'shopora-account',
        JSON.stringify(account)
      )

      localStorage.setItem(
        'shopora-user',
        JSON.stringify(user)
      )

      window.dispatchEvent(new Event('userUpdated'))

      navigate('/')
    } catch (error) {
      console.error('Registration error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '47px',
    padding: '0 13px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--input-bg)',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '13px',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: 'var(--text)',
    fontSize: '12px',
    fontWeight: '600',
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
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.035,
          top: '-230px',
          right: '-130px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.025,
          bottom: '-190px',
          left: '-120px',
          pointerEvents: 'none',
        }}
      />

      <section
        style={{
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: '38px 36px',
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
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
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
              Join Shopora
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
              Create your account
            </h1>

            <p
              style={{
                margin: '10px 0 0',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              Start your shopping journey with Shopora.
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
            {/* Name */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '17px',
              }}
            >
              <div>
                <label htmlFor="firstName" style={labelStyle}>
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="lastName" style={labelStyle}>
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}

            <div style={{ marginBottom: '17px' }}>
              <label htmlFor="email" style={labelStyle}>
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

            <div style={{ marginBottom: '17px' }}>
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
                    ...labelStyle,
                    marginBottom: 0,
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
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                style={inputStyle}
              />
            </div>

            {/* Confirm Password */}

            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '7px',
                }}
              >
                <label
                  htmlFor="confirmPassword"
                  style={{
                    ...labelStyle,
                    marginBottom: 0,
                  }}
                >
                  Confirm Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
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
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword ? 'text' : 'password'
                }
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={inputStyle}
              />
            </div>

            {/* Submit */}

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '26px 0',
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
              Already a member?
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
            to="/login"
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
            Sign In
          </Link>
        </div>

        <p
          style={{
            margin: '18px 0 0',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '10px',
            lineHeight: '1.6',
            opacity: 0.75,
          }}
        >
          By creating an account, you agree to Shopora's terms and
          privacy policy.
        </p>
      </section>
    </main>
  )
}

export default Register