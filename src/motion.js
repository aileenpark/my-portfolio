// Motion tokens — JS 상수 (GSAP용)
// DESIGN.md §1-4와 동기화. CSS 변수는 index.css의 --motion-* 참조.

export const MOTION = {
  instant: { duration: 0.1, ease: 'none' },
  fast:    { duration: 0.2, ease: 'power2.out' },     // hover, opacity
  base:    { duration: 0.4, ease: 'power2.inOut' },   // UI 트랜지션
  slow:    { duration: 1.0, ease: 'power2.inOut' },   // 스크롤 트리거, hero (0.8~1.2 범위)
};
