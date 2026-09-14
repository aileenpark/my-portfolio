const statusStyle = {
  minHeight: '100vh',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-4)',
  padding: 'var(--space-6)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-family-base)',
  fontSize: 'var(--font-size-body-sm)',
  textAlign: 'center',
}

export function RouteLoading() {
  return (
    <main style={statusStyle}>
      <p role="status" style={{ margin: 0 }}>Loading page…</p>
    </main>
  )
}

export function RouteLoadError() {
  return (
    <main style={statusStyle}>
      <p role="alert" style={{ margin: 0 }}>This page couldn’t be loaded. Please try again.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: 'var(--space-3) var(--space-6)',
          border: '1px solid var(--color-text)',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        Reload page
      </button>
    </main>
  )
}
