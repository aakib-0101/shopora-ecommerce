import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(
          'shopora-user'
        )

        setUser(
          storedUser
            ? JSON.parse(storedUser)
            : null
        )
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      }
    }

    loadUser()

    window.addEventListener(
      'userUpdated',
      loadUser
    )

    window.addEventListener(
      'storage',
      loadUser
    )

    return () => {
      window.removeEventListener(
        'userUpdated',
        loadUser
      )

      window.removeEventListener(
        'storage',
        loadUser
      )
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('shopora-user')

    window.dispatchEvent(
      new Event('userUpdated')
    )

    navigate('/')
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'var(--bg)',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 24px',
        }}
      >
        <section
          style={{
            width: '100%',
            maxWidth: '450px',
            textAlign: 'center',
            padding: '45px 35px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '15px',
            boxShadow: '0 20px 60px var(--shadow)',
          }}
        >
          <div
            style={{
              width: '58px',
              height: '58px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(168, 132, 69, 0.10)',
              border: '1px solid rgba(168, 132, 69, 0.25)',
              color: 'var(--accent)',
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
            </svg>
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '28px',
              fontWeight: '600',
              letterSpacing: '-0.8px',
            }}
          >
            You're not signed in
          </h1>

          <p
            style={{
              margin: '0 0 25px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: '1.6',
            }}
          >
            Sign in to view your Shopora profile.
          </p>

          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '150px',
              height: '45px',
              padding: '0 20px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '750',
            }}
          >
            Sign In
          </Link>
        </section>
      </main>
    )
  }

  const fullName = `${user.firstName || ''} ${
    user.lastName || ''
  }`.trim()

  const initials =
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
      .toUpperCase()

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '55px 24px 80px',
      }}
    >
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Header */}

        <div
          style={{
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              margin: '0 0 8px',
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
            }}
          >
            My Account
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
            Profile
          </h1>
        </div>

        {/* Profile Card */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '230px 1fr',
            background:
              'linear-gradient(145deg, var(--surface), var(--surface-2))',
            border: '1px solid var(--border)',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px var(--shadow)',
          }}
        >
          {/* Left */}

          <div
            style={{
              padding: '40px 25px',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(168, 132, 69, 0.12)',
                border: '1px solid rgba(168, 132, 69, 0.30)',
                color: 'var(--accent)',
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '18px',
              }}
            >
              {initials || 'U'}
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '650',
              }}
            >
              {fullName || 'Shopora User'}
            </h2>

            <p
              style={{
                margin: '7px 0 0',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                wordBreak: 'break-word',
              }}
            >
              {user.email}
            </p>
          </div>

          {/* Right */}

          <div
            style={{
              padding: '35px',
            }}
          >
            <div
              style={{
                marginBottom: '25px',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontWeight: '650',
                }}
              >
                First Name
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '550',
                }}
              >
                {user.firstName}
              </p>
            </div>

            <div
              style={{
                marginBottom: '25px',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontWeight: '650',
                }}
              >
                Last Name
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '550',
                }}
              >
                {user.lastName}
              </p>
            </div>

            <div
              style={{
                marginBottom: '30px',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontWeight: '650',
                }}
              >
                Email Address
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '550',
                  wordBreak: 'break-word',
                }}
              >
                {user.email}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/products"
                style={{
                  height: '44px',
                  padding: '0 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  color: 'var(--bg)',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '750',
                }}
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  height: '44px',
                  padding: '0 18px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Profile