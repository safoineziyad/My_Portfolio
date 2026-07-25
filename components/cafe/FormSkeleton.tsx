'use client';

export default function FormSkeleton() {
  return (
    <div className="cafe-form-container">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="form-group">
          <div
            style={{
              width: 100,
              height: 12,
              borderRadius: 6,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: '100%',
              height: 48,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
            }}
          />
        </div>
      ))}
      <div
        style={{
          width: '100%',
          height: 48,
          borderRadius: 50,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-shimmer 1.5s infinite',
          marginTop: 8,
        }}
      />
    </div>
  );
}
