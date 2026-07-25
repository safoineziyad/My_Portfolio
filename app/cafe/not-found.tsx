import Link from 'next/link';

export default function CafeNotFound() {
  return (
    <section
      className="form-section"
      style={{
        marginTop: 80,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '8rem',
          fontWeight: 700,
          color: 'var(--terracotta)',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        404
      </h1>
      <h2
        className="section-title"
        style={{ fontSize: '2rem', marginBottom: '1rem' }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: 'var(--coffee)',
          fontSize: '1.1rem',
          marginBottom: '2.5rem',
          maxWidth: 400,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/cafe" className="cafe-btn">
          Back to Home
        </Link>
        <Link href="/cafe/menu" className="cafe-btn cafe-btn-outline">
          View Menu
        </Link>
      </div>
    </section>
  );
}
