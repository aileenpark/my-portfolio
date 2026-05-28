export default function WebglFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        color: "#333",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          background: "#f8f9fa",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #e9ecef",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            fontSize: "1.25rem",
            color: "#111",
          }}
        >
          WebGL Not Supported
        </h2>
        <p style={{ margin: "0 0 1rem 0", lineHeight: 1.5, color: "#555" }}>
          This portfolio uses WebGL.
          <br />
          <br />
          Your browser may have hardware acceleration disabled or may not
          support WebGL.
        </p>
        <p style={{ margin: 0, fontWeight: 500, color: "#333" }}>
          Please enable hardware acceleration or open this site in another
          browser.
        </p>
      </div>
    </div>
  );
}
