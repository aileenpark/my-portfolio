export function getDeviceTier(width = window.innerWidth) {
  if (width <= 480) return "mobile";
  if (width <= 1280) return "tablet";
  return "desktop";
}

export function getGlassCubeTier(width = window.innerWidth) {
  if (width <= 480) return "mobile";
  if (width < 1440) return "tablet";
  return "desktop";
}

export function isMobileDevice() {
  return getDeviceTier() === "mobile";
}

export function isTabletDevice() {
  return getDeviceTier() === "tablet";
}
