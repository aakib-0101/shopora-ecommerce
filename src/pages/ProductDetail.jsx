import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartToast, setCartToast] = useState(false)
  const [toastClosing, setToastClosing] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setSelectedImage(0)
    setQuantity(1)
    setCartToast(false)

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found')
        }

        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching product:', err)
        setError(true)
        setLoading(false)
      })
  }, [id])

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>
            Loading product...
          </p>
        </div>
      </div>
    )
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !product) {
    return (
      <div style={styles.page}>
        <div style={styles.errorContainer}>
          <div style={styles.errorNumber}>404</div>

          <h1 style={styles.errorTitle}>
            Product not found
          </h1>

          <p style={styles.errorText}>
            We couldn't find the product you're looking for.
          </p>

          <Link
            to="/products"
            style={styles.backButton}
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  /* =====================================================
     IMAGES
  ===================================================== */

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail]

  const currentImage =
    images[selectedImage] || product.thumbnail

  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  /* =====================================================
     PRICE
  ===================================================== */

  const discountPercentage =
    Number(product.discountPercentage || 0)

  const originalPrice =
    discountPercentage > 0
      ? product.price / (1 - discountPercentage / 100)
      : product.price

  /* =====================================================
     REVIEWS
  ===================================================== */

  const reviews = product.reviews || []

  const averageReviewRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviews.length
      : Number(product.rating || 0)

  /* =====================================================
     HELPERS
  ===================================================== */

  const renderStars = (rating, size = 18) => {
    const roundedRating = Math.round(
      Number(rating || 0)
    )

    return (
      <span
        style={{
          display: 'inline-flex',
          gap: '2px'
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color:
                star <= roundedRating
                  ? 'var(--accent)'
                  : 'var(--text-secondary)',
              fontSize: `${size}px`
            }}
          >
            ★
          </span>
        ))}
      </span>
    )
  }

  const formatDate = (date) => {
    if (!date) return ''

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  /* -----------------------------
     ADD TO CART
  ----------------------------- */
  const handleAddToCart = () => {
    if (!product) return

    try {
      const storedCart = localStorage.getItem('shopora-cart')
      const cart = storedCart ? JSON.parse(storedCart) : []
      const existingIndex = cart.findIndex(
        (item) => String(item.id) === String(product.id)
      )

      const stock = Number(product.stock || 0)
      const safeQuantity = stock > 0
        ? Math.min(quantity, stock)
        : quantity

      if (existingIndex >= 0) {
        const newQuantity = cart[existingIndex].quantity + safeQuantity

        cart[existingIndex] = {
          ...cart[existingIndex],
          quantity: stock > 0 ? Math.min(newQuantity, stock) : newQuantity,
        }
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          thumbnail: product.thumbnail,
          image: product.thumbnail,
          quantity: safeQuantity,
          brand: product.brand || '',
          category: product.category || '',
          discountPercentage: Number(product.discountPercentage || 0),
        })
      }

      localStorage.setItem('shopora-cart', JSON.stringify(cart))

      // Lets other Shopora components refresh immediately.
      window.dispatchEvent(new Event('cartUpdated'))

      setToastClosing(false)
      setToastKey((prev) => prev + 1)
      setCartToast(true)

      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = window.setTimeout(() => {
        setToastClosing(true)

        window.setTimeout(() => {
          setCartToast(false)
          setToastClosing(false)
        }, 350)
      }, 3200)

      return true
    } catch (error) {
      console.error('Error adding product to cart:', error)
      return false
    }
  }

  return (
    <div style={styles.page}>

      {/* Premium cart notification */}
      {cartToast && (
        <div
          key={toastKey}
          role="status"
          aria-live="polite"
          style={{
            ...styles.cartToast,
            animation: toastClosing
              ? 'shoporaToastOut 0.35s cubic-bezier(.4, 0, 1, 1) forwards'
              : 'shoporaToastIn 0.48s cubic-bezier(.22, 1, .36, 1) forwards'
          }}
        >
          <div style={styles.toastAccent} />

          <div style={styles.toastIcon}>
            <span>✓</span>
          </div>

          <div style={styles.toastContent}>
            <div style={styles.toastTitle}>Added to Cart</div>
            <div style={styles.toastProduct}>
              {product?.title}
            </div>
            <div style={styles.toastMeta}>
              {quantity} {quantity === 1 ? 'item' : 'items'} added
            </div>
          </div>

          <Link
            to="/cart"
            style={styles.toastCartLink}
            onClick={() => {
              window.clearTimeout(toastTimerRef.current)
              setCartToast(false)
              setToastClosing(false)
            }}
          >
            View Cart
          </Link>

          <button
            type="button"
            onClick={() => {
              window.clearTimeout(toastTimerRef.current)
              setToastClosing(true)
              window.setTimeout(() => {
                setCartToast(false)
                setToastClosing(false)
              }, 350)
            }}
            style={styles.toastClose}
            aria-label="Close notification"
          >
            ×
          </button>

          <div key={toastKey} style={styles.toastProgress} />
        </div>
      )}

      <style>{`
        @keyframes shoporaToastIn {
          from {
            opacity: 0;
            transform: translate3d(34px, 0, 0) scale(0.96);
          }
          60% {
            opacity: 1;
            transform: translate3d(-4px, 0, 0) scale(1.005);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes shoporaToastOut {
          from {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            opacity: 0;
            transform: translate3d(28px, 0, 0) scale(0.97);
          }
        }

        @keyframes shoporaToastProgress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>

      {/* =====================================================
          MAIN PRODUCT SECTION
      ===================================================== */}

      <main style={styles.container}>

        {/* Back */}
        <Link
          to="/products"
          style={styles.backLink}
        >
          ← Back to Shop
        </Link>

        <section style={styles.productSection}>

          {/* ================= IMAGE GALLERY ================= */}

          <div style={styles.gallery}>

            <div style={styles.mainImageWrapper}>

              <img
                src={currentImage}
                alt={product.title}
                style={styles.mainImage}
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    style={{
                      ...styles.imageArrow,
                      ...styles.leftArrow
                    }}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    style={{
                      ...styles.imageArrow,
                      ...styles.rightArrow
                    }}
                  >
                    ›
                  </button>

                  <div style={styles.imageCounter}>
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}

            </div>

            {/* Thumbnails */}

            {hasMultipleImages && (
              <div style={styles.thumbnailRow}>

                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    style={{
                      ...styles.thumbnailButton,
                      ...(selectedImage === index
                        ? styles.activeThumbnail
                        : {})
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      style={styles.thumbnailImage}
                    />
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* ================= PRODUCT SUMMARY ================= */}

          <div style={styles.productInfo}>

            <div style={styles.category}>
              {product.category
                ?.replace(/-/g, ' ')
                .toUpperCase()}
            </div>

            <h1 style={styles.title}>
              {product.title}
            </h1>


            {/* Rating */}

            <div style={styles.ratingRow}>

              <div style={styles.ratingBox}>
                <span>
                  {Number(product.rating || 0).toFixed(2)}
                </span>

                <span style={styles.smallStar}>
                  ★
                </span>
              </div>

              <span style={styles.reviewCount}>
                {reviews.length > 0
                  ? `${reviews.length} customer ${
                      reviews.length === 1
                        ? 'review'
                        : 'reviews'
                    }`
                  : 'No reviews'}
              </span>

            </div>


            <div style={styles.separator}></div>


            {/* Price */}

            <div style={styles.priceArea}>

              <div style={styles.currentPrice}>
                ${Number(product.price).toFixed(2)}
              </div>

              {discountPercentage > 0 && (
                <div style={styles.priceDetails}>

                  <span style={styles.originalPrice}>
                    ${originalPrice.toFixed(2)}
                  </span>

                  <span style={styles.discount}>
                    {discountPercentage.toFixed(2)}% OFF
                  </span>

                </div>
              )}

            </div>


            {/* Description */}

            <p style={styles.description}>
              {product.description}
            </p>


            {/* Availability */}

            <div style={styles.availabilityBox}>

              <div style={styles.availabilityRow}>

                <span style={styles.label}>
                  Availability
                </span>

                <span
                  style={{
                    ...styles.availabilityValue,
                    color:
                      product.stock > 0
                        ? 'var(--success)'
                        : 'var(--danger)'
                  }}
                >
                  {product.availabilityStatus ||
                    (product.stock > 0
                      ? 'In Stock'
                      : 'Out of Stock')}
                </span>

              </div>

              {product.stock !== undefined && (
                <div style={styles.stockText}>
                  {product.stock > 0
                    ? `${product.stock} items available`
                    : 'Currently unavailable'}
                </div>
              )}

            </div>


            {/* Quantity */}

            <div style={styles.purchaseRow}>

              <div style={styles.quantityBox}>

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  style={styles.quantityButton}
                >
                  −
                </button>

                <span style={styles.quantityValue}>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  style={styles.quantityButton}
                >
                  +
                </button>

              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={styles.addToCart}
                aria-label={`Add ${product.title} to cart`}
              >
                Add to Cart
              </button>

            </div>


            {/* Quick information */}

            <div style={styles.quickInfo}>

              {product.shippingInformation && (
                <div style={styles.quickInfoItem}>

                  <span style={styles.quickIcon}>
                    ✓
                  </span>

                  <div>
                    <strong style={styles.quickTitle}>
                      Shipping
                    </strong>

                    <span style={styles.quickText}>
                      {product.shippingInformation}
                    </span>
                  </div>

                </div>
              )}


              {product.returnPolicy && (
                <div style={styles.quickInfoItem}>

                  <span style={styles.quickIcon}>
                    ↩
                  </span>

                  <div>
                    <strong style={styles.quickTitle}>
                      Returns
                    </strong>

                    <span style={styles.quickText}>
                      {product.returnPolicy}
                    </span>
                  </div>

                </div>
              )}


              {product.warrantyInformation && (
                <div style={styles.quickInfoItem}>

                  <span style={styles.quickIcon}>
                    ◆
                  </span>

                  <div>
                    <strong style={styles.quickTitle}>
                      Warranty
                    </strong>

                    <span style={styles.quickText}>
                      {product.warrantyInformation}
                    </span>
                  </div>

                </div>
              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            MORE INFORMATION
        ===================================================== */}

        <section style={styles.detailSection}>

          <div style={styles.sectionHeading}>

            <span style={styles.sectionEyebrow}>
              PRODUCT INFORMATION
            </span>

            <h2 style={styles.sectionTitle}>
              More Information
            </h2>

            <p style={styles.sectionDescription}>
              Everything you need to know before making
              your purchase.
            </p>

          </div>


          <div style={styles.informationGrid}>

            {product.brand && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  Brand
                </span>

                <span style={styles.infoValue}>
                  {product.brand}
                </span>
              </div>
            )}


            {product.sku && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  SKU
                </span>

                <span style={styles.infoValue}>
                  {product.sku}
                </span>
              </div>
            )}


            {product.weight !== undefined && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  Weight
                </span>

                <span style={styles.infoValue}>
                  {product.weight}
                </span>
              </div>
            )}


            {product.dimensions && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  Dimensions
                </span>

                <span style={styles.infoValue}>
                  {product.dimensions.width} ×{' '}
                  {product.dimensions.height} ×{' '}
                  {product.dimensions.depth}
                </span>
              </div>
            )}


            {product.minimumOrderQuantity !== undefined && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  Minimum Order
                </span>

                <span style={styles.infoValue}>
                  {product.minimumOrderQuantity} units
                </span>
              </div>
            )}


            {product.availabilityStatus && (
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>
                  Availability
                </span>

                <span style={styles.infoValue}>
                  {product.availabilityStatus}
                </span>
              </div>
            )}

          </div>

        </section>


        {/* =====================================================
            PRODUCT DETAILS
        ===================================================== */}

        <section style={styles.detailSection}>

          <div style={styles.sectionHeading}>

            <span style={styles.sectionEyebrow}>
              SPECIFICATIONS
            </span>

            <h2 style={styles.sectionTitle}>
              Product Details
            </h2>

          </div>


          <div style={styles.detailsTable}>

            {product.brand && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Brand
                </span>

                <span style={styles.detailValue}>
                  {product.brand}
                </span>
              </div>
            )}


            {product.sku && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  SKU
                </span>

                <span style={styles.detailValue}>
                  {product.sku}
                </span>
              </div>
            )}


            {product.weight !== undefined && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Item Weight
                </span>

                <span style={styles.detailValue}>
                  {product.weight}
                </span>
              </div>
            )}


            {product.dimensions && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Dimensions
                </span>

                <span style={styles.detailValue}>
                  Width: {product.dimensions.width}
                  {'  '}
                  Height: {product.dimensions.height}
                  {'  '}
                  Depth: {product.dimensions.depth}
                </span>
              </div>
            )}


            {product.warrantyInformation && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Warranty
                </span>

                <span style={styles.detailValue}>
                  {product.warrantyInformation}
                </span>
              </div>
            )}


            {product.shippingInformation && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Shipping
                </span>

                <span style={styles.detailValue}>
                  {product.shippingInformation}
                </span>
              </div>
            )}


            {product.returnPolicy && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Return Policy
                </span>

                <span style={styles.detailValue}>
                  {product.returnPolicy}
                </span>
              </div>
            )}


            {product.minimumOrderQuantity !== undefined && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Minimum Order Quantity
                </span>

                <span style={styles.detailValue}>
                  {product.minimumOrderQuantity}
                </span>
              </div>
            )}


            {product.stock !== undefined && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Stock
                </span>

                <span style={styles.detailValue}>
                  {product.stock}
                </span>
              </div>
            )}


            {product.meta?.barcode && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>
                  Barcode
                </span>

                <span style={styles.detailValue}>
                  {product.meta.barcode}
                </span>
              </div>
            )}

          </div>

        </section>


        {/* =====================================================
            TAGS
        ===================================================== */}

        {product.tags && product.tags.length > 0 && (
          <section style={styles.detailSection}>

            <div style={styles.sectionHeading}>

              <span style={styles.sectionEyebrow}>
                CATEGORY
              </span>

              <h2 style={styles.sectionTitle}>
                Tags
              </h2>

            </div>


            <div style={styles.tagsContainer}>

              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={styles.tag}
                >
                  {tag}
                </span>
              ))}

            </div>

          </section>
        )}


        {/* =====================================================
            CUSTOMER REVIEWS
        ===================================================== */}

        <section style={styles.reviewSection}>

          <div style={styles.sectionHeading}>

            <span style={styles.sectionEyebrow}>
              CUSTOMER FEEDBACK
            </span>

            <h2 style={styles.sectionTitle}>
              Customer Reviews
            </h2>

          </div>


          {/* Review summary */}

          <div style={styles.reviewSummary}>

            <div style={styles.reviewScore}>

              <div style={styles.bigRating}>
                {Number(product.rating || 0).toFixed(1)}
              </div>

              <div>

                {renderStars(product.rating, 21)}

                <div style={styles.reviewSummaryText}>
                  Based on {reviews.length}{' '}
                  {reviews.length === 1
                    ? 'review'
                    : 'reviews'}
                </div>

              </div>

            </div>


            <div style={styles.reviewDivider}></div>


            <div style={styles.reviewAverage}>

              <span style={styles.averageLabel}>
                Review Average
              </span>

              <strong style={styles.averageValue}>
                {averageReviewRating.toFixed(1)} / 5
              </strong>

            </div>

          </div>


          {/* Individual reviews */}

          {reviews.length > 0 ? (
            <div style={styles.reviewsList}>

              {reviews.map((review, index) => (
                <article
                  key={`${review.reviewerName}-${index}`}
                  style={styles.reviewCard}
                >

                  <div style={styles.reviewTop}>

                    <div style={styles.reviewer}>

                      <div style={styles.avatar}>
                        {review.reviewerName
                          ?.charAt(0)
                          ?.toUpperCase() || 'U'}
                      </div>

                      <div>

                        <div style={styles.reviewerName}>
                          {review.reviewerName}
                        </div>

                        <div style={styles.verified}>
                          Verified customer
                        </div>

                      </div>

                    </div>


                    <div style={styles.reviewDate}>
                      {formatDate(review.date)}
                    </div>

                  </div>


                  <div style={styles.reviewRating}>
                    {renderStars(review.rating, 16)}
                  </div>


                  <p style={styles.reviewComment}>
                    {review.comment}
                  </p>

                </article>
              ))}

            </div>
          ) : (
            <div style={styles.noReviews}>
              No customer reviews available for this
              product yet.
            </div>
          )}

        </section>


        {/* =====================================================
            FULL DESCRIPTION
        ===================================================== */}

        <section style={styles.descriptionSection}>

          <div style={styles.sectionHeading}>

            <span style={styles.sectionEyebrow}>
              ABOUT THIS PRODUCT
            </span>

            <h2 style={styles.sectionTitle}>
              Description
            </h2>

          </div>

          <p style={styles.fullDescription}>
            {product.description}
          </p>

        </section>

      </main>

    </div>
  )
}


/* =============================================================
   STYLES
============================================================= */

const styles = {

  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily:
      'Georgia, "Times New Roman", serif'
  },

  container: {
    width: 'min(1320px, calc(100% - 48px))',
    margin: '0 auto',
    paddingTop: '140px',
    paddingBottom: '100px'
  },

  backLink: {
    display: 'inline-block',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '15px',
    marginBottom: '38px'
  },

  productSection: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1.08fr) minmax(420px, 0.92fr)',
    gap: '74px',
    alignItems: 'start'
  },

  /* ================= GALLERY ================= */

  gallery: {
    minWidth: 0
  },

  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '640px',
    background: 'var(--surface-2)',
    borderRadius: '18px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '34px',
    display: 'block'
  },

  imageArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '1px solid var(--border-strong)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '36px',
    lineHeight: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    boxShadow:
      '0 6px 20px var(--shadow)'
  },

  leftArrow: {
    left: '18px'
  },

  rightArrow: {
    right: '18px'
  },

  imageCounter: {
    position: 'absolute',
    bottom: '18px',
    right: '18px',
    background: 'var(--bg)',
    color: 'var(--text)',
    padding: '7px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    letterSpacing: '0.5px'
  },

  thumbnailRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },

  thumbnailButton: {
    width: '86px',
    height: '86px',
    flexShrink: 0,
    padding: '5px',
    borderRadius: '10px',
    border: '1px solid var(--border-strong)',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    overflow: 'hidden'
  },

  activeThumbnail: {
    border: '2px solid var(--accent)'
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block'
  },

  /* ================= PRODUCT INFO ================= */

  productInfo: {
    paddingTop: '28px'
  },

  category: {
    color: 'var(--accent)',
    fontSize: '13px',
    letterSpacing: '4px',
    fontWeight: '600',
    marginBottom: '18px'
  },

  title: {
    fontSize: '52px',
    lineHeight: '1.08',
    fontWeight: '500',
    margin: '0 0 22px',
    color: 'var(--text)',
    letterSpacing: '-1.5px'
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  ratingBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderRadius: '5px',
    padding: '5px 9px',
    fontSize: '14px',
    fontWeight: '700'
  },

  smallStar: {
    fontSize: '12px'
  },

  reviewCount: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },

  separator: {
    height: '1px',
    background: 'var(--border)',
    margin: '28px 0'
  },

  priceArea: {
    marginBottom: '22px'
  },

  currentPrice: {
    fontSize: '38px',
    color: 'var(--text)',
    fontWeight: '500',
    marginBottom: '8px'
  },

  priceDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  originalPrice: {
    color: 'var(--text-secondary)',
    textDecoration: 'line-through',
    fontSize: '17px'
  },

  discount: {
    color: 'var(--accent)',
    fontSize: '14px',
    fontWeight: '600'
  },

  description: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    lineHeight: '1.8',
    margin: '0 0 28px',
    maxWidth: '680px'
  },

  availabilityBox: {
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '18px 0',
    marginBottom: '24px'
  },

  availabilityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px'
  },

  label: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },

  availabilityValue: {
    fontSize: '14px',
    fontWeight: '600'
  },

  stockText: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginTop: '7px'
  },

  purchaseRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px'
  },

  quantityBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-strong)',
    borderRadius: '7px',
    height: '56px'
  },

  quantityButton: {
    width: '46px',
    height: '100%',
    border: 'none',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: '22px',
    cursor: 'pointer'
  },

  quantityValue: {
    minWidth: '35px',
    textAlign: 'center',
    color: 'var(--text)',
    fontSize: '15px'
  },

  addToCart: {
    flex: 1,
    minHeight: '56px',
    border: 'none',
    borderRadius: '7px',
    background: 'var(--accent)',
    color: 'var(--bg)',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.2px'
  },

  quickInfo: {
    display: 'grid',
    gap: '17px'
  },

  quickInfoItem: {
    display: 'flex',
    gap: '13px',
    alignItems: 'flex-start'
  },

  quickIcon: {
    width: '27px',
    height: '27px',
    border: '1px solid var(--border-strong)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
    fontSize: '11px',
    flexShrink: 0
  },

  quickTitle: {
    display: 'block',
    color: 'var(--text)',
    fontSize: '13px',
    marginBottom: '3px'
  },

  quickText: {
    display: 'block',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    lineHeight: '1.5'
  },

  /* ================= SECTIONS ================= */

  detailSection: {
    marginTop: '100px',
    paddingTop: '55px',
    borderTop: '1px solid var(--border)'
  },

  sectionHeading: {
    marginBottom: '34px'
  },

  sectionEyebrow: {
    display: 'block',
    color: 'var(--accent)',
    fontSize: '11px',
    letterSpacing: '3px',
    fontWeight: '600',
    marginBottom: '12px'
  },

  sectionTitle: {
    fontSize: '32px',
    fontWeight: '500',
    margin: 0,
    color: 'var(--text)'
  },

  sectionDescription: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginTop: '10px'
  },

  informationGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: '1px',
    background: 'var(--border)',
    border: '1px solid var(--border)'
  },

  infoCard: {
    background: 'var(--surface)',
    padding: '25px',
    minHeight: '92px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  infoLabel: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    marginBottom: '7px',
    textTransform: 'uppercase',
    letterSpacing: '1.2px'
  },

  infoValue: {
    color: 'var(--text)',
    fontSize: '15px',
    lineHeight: '1.5'
  },

  /* ================= DETAILS TABLE ================= */

  detailsTable: {
    borderTop: '1px solid var(--border)'
  },

  detailRow: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '30px',
    padding: '19px 0',
    borderBottom: '1px solid var(--border)'
  },

  detailKey: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },

  detailValue: {
    color: 'var(--text)',
    fontSize: '14px',
    lineHeight: '1.6'
  },

  /* ================= TAGS ================= */

  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '9px'
  },

  tag: {
    border: '1px solid var(--border-strong)',
    borderRadius: '20px',
    padding: '8px 14px',
    color: 'var(--text-secondary)',
    fontSize: '13px'
  },

  /* ================= REVIEWS ================= */

  reviewSection: {
    marginTop: '100px',
    paddingTop: '55px',
    borderTop: '1px solid var(--border)'
  },

  reviewSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '45px',
    padding: '30px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    marginBottom: '24px'
  },

  reviewScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },

  bigRating: {
    fontSize: '48px',
    color: 'var(--text)',
    fontWeight: '500'
  },

  reviewSummaryText: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    marginTop: '7px'
  },

  reviewDivider: {
    width: '1px',
    height: '60px',
    background: 'var(--border)'
  },

  reviewAverage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  },

  averageLabel: {
    color: 'var(--text-secondary)',
    fontSize: '12px'
  },

  averageValue: {
    color: 'var(--text)',
    fontSize: '18px'
  },

  reviewsList: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: '16px'
  },

  reviewCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '25px'
  },

  reviewTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    marginBottom: '17px'
  },

  reviewer: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px'
  },

  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '700'
  },

  reviewerName: {
    color: 'var(--text)',
    fontSize: '13px',
    fontWeight: '600'
  },

  verified: {
    color: 'var(--text-secondary)',
    fontSize: '10px',
    marginTop: '3px'
  },

  reviewDate: {
    color: 'var(--text-secondary)',
    fontSize: '11px',
    whiteSpace: 'nowrap'
  },

  reviewRating: {
    marginBottom: '13px'
  },

  reviewComment: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: '1.7',
    margin: 0
  },

  noReviews: {
    padding: '35px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px'
  },

  /* ================= DESCRIPTION ================= */

  descriptionSection: {
    marginTop: '100px',
    paddingTop: '55px',
    borderTop: '1px solid var(--border)'
  },

  fullDescription: {
    maxWidth: '900px',
    color: 'var(--text-secondary)',
    fontSize: '16px',
    lineHeight: '1.9',
    margin: 0
  },

  /* ================= CART TOAST ================= */

  cartToast: {
    position: 'fixed',
    right: '28px',
    bottom: '28px',
    zIndex: 9999,
    width: 'min(430px, calc(100vw - 36px))',
    minHeight: '88px',
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    padding: '16px 15px 17px 17px',
    overflow: 'hidden',
    borderRadius: '15px',
    background: 'color-mix(in srgb, var(--surface) 94%, var(--accent) 6%)',
    border: '1px solid var(--border-strong)',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.34), 0 4px 18px rgba(0, 0, 0, 0.14)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    willChange: 'transform, opacity'
  },

  toastAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'var(--accent)'
  },

  toastIcon: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(168, 132, 69, 0.13)',
    border: '1px solid rgba(168, 132, 69, 0.30)',
    color: 'var(--accent)',
    fontSize: '18px',
    fontWeight: '800',
    boxShadow: 'inset 0 0 0 4px rgba(168, 132, 69, 0.035)'
  },

  toastContent: {
    minWidth: 0,
    flex: 1,
    paddingRight: '2px'
  },

  toastTitle: {
    color: 'var(--text)',
    fontSize: '14px',
    fontWeight: '750',
    letterSpacing: '0.1px',
    marginBottom: '4px'
  },

  toastProduct: {
    color: 'var(--text-secondary)',
    fontSize: '11px',
    lineHeight: '1.35',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px'
  },

  toastMeta: {
    color: 'var(--accent)',
    fontSize: '10px',
    fontWeight: '650',
    marginTop: '4px',
    letterSpacing: '0.2px'
  },

  toastCartLink: {
    flexShrink: 0,
    color: 'var(--bg)',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '750',
    padding: '10px 13px',
    borderRadius: '8px',
    border: '1px solid var(--accent)',
    background: 'var(--accent)',
    boxShadow: '0 5px 15px rgba(168, 132, 69, 0.18)'
  },

  toastClose: {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    padding: 0,
    border: 0,
    borderRadius: '50%',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '20px',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  toastProgress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: '2px',
    width: '100%',
    transformOrigin: 'left center',
    background: 'var(--accent)',
    animation: 'shoporaToastProgress 3.2s linear forwards',
    opacity: 0.8
  },

  /* ================= LOADING ================= */

  loadingContainer: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px'
  },

  loader: {
    width: '38px',
    height: '38px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },

  /* ================= ERROR ================= */

  errorContainer: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '30px'
  },

  errorNumber: {
    color: 'var(--accent)',
    fontSize: '80px',
    fontWeight: '500'
  },

  errorTitle: {
    color: 'var(--text)',
    fontSize: '32px',
    fontWeight: '500',
    margin: '10px 0'
  },

  errorText: {
    color: 'var(--text-secondary)',
    marginBottom: '30px'
  },

  backButton: {
    display: 'inline-block',
    padding: '13px 24px',
    background: 'var(--accent)',
    color: 'var(--bg)',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px'
  }
}

export default ProductDetail