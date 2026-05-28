export function getDeviceTier() {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1280) return "tablet";
  return "desktop";
}

export function isMobileDevice() {
  return getDeviceTier() === "mobile";
}

export function isTabletDevice() {
  return getDeviceTier() === "tablet";
}
