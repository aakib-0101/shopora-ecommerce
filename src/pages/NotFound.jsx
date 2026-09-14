import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Detail */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.035,
          top: '-180px',
          right: '-120px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.025,
          bottom: '-150px',
          left: '-100px',
          pointerEvents: 'none',
        }}
      />

      <section
        style={{
          width: '100%',
          maxWidth: '650px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 404 */}
        <div
          style={{
            fontSize: 'clamp(100px, 18vw, 170px)',
            lineHeight: 0.9,
            fontWeight: '700',
            letterSpacing: '-9px',
            color: 'var(--accent)',
            opacity: 0.9,
            marginBottom: '28px',
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* Small Label */}
        <p
          style={{
            margin: '0 0 10px',
            color: 'var(--accent)',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Page Not Found
        </p>

        {/* Heading */}
        <h1
          style={{
            margin: '0 0 15px',
            fontSize: 'clamp(30px, 5vw, 42px)',
            lineHeight: '1.15',
            fontWeight: '600',
            letterSpacing: '-1.4px',
            color: 'var(--text)',
          }}
        >
          Looks like you took a wrong turn.
        </h1>

        {/* Description */}
        <p
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: '1.7',
          }}
        >
          The page you're looking for doesn't exist,
          may have moved, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '30px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '145px',
              height: '46px',
              padding: '0 20px',
              borderRadius: '8px',
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              color: 'var(--bg)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
              transition:
                'transform 0.2s ease, opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-2px)'
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0)'
              e.currentTarget.style.opacity = '1'
            }}
          >
            Back to Home
          </Link>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '145px',
              height: '46px',
              padding: '0 20px',
              borderRadius: '8px',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              transition:
                'transform 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-2px)'
              e.currentTarget.style.borderColor =
                'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0)'
              e.currentTarget.style.borderColor =
                'var(--border-strong)'
            }}
          >
            Browse Products
          </Link>
        </div>

        {/* Bottom Detail */}
        <div
          style={{
            width: '70px',
            height: '1px',
            background: 'var(--accent)',
            opacity: 0.45,
            margin: '38px auto 0',
          }}
        />

        <p
          style={{
            margin: '16px 0 0',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            letterSpacing: '0.4px',
            opacity: 0.75,
          }}
        >
          Shopora · Curated for everyday living
        </p>
      </section>
    </main>
  )
}

export default NotFound