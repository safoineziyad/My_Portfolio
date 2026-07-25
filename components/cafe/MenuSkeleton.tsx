export default function MenuSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="menu-card"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div
            style={{
              width: '100%',
              height: 200,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
            }}
          />
          <div className="menu-card-body">
            <div
              style={{
                width: 80,
                height: 12,
                borderRadius: 6,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                marginBottom: 12,
              }}
            />
            <div
              style={{
                width: '60%',
                height: 24,
                borderRadius: 6,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                marginBottom: 12,
              }}
            />
            <div
              style={{
                width: '100%',
                height: 16,
                borderRadius: 6,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: '80%',
                height: 16,
                borderRadius: 6,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                marginBottom: 20,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 28,
                  borderRadius: 6,
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-shimmer 1.5s infinite',
                }}
              />
              <div
                style={{
                  width: 100,
                  height: 32,
                  borderRadius: 50,
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-shimmer 1.5s infinite',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
