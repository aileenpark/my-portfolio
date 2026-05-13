<!--
  DESIGN.md — 나윤 포트폴리오 디자인 시스템
  사용법: AI 프롬프트에 <design_system>...</design_system>로 감싸 첨부.
  Skills(motion, copywriting 등)는 .claude/skills/에 별도 분리.
  Figma 원본: KnPVaFnebeGU96Cdrl9fij / Components 페이지 45:1869
-->

# DESIGN.md

## 0. Philosophy (DNA)

### 한 줄 정체성
**"Editorial typography × WebGL surface"** — 종이의 위계감 위에 인터랙티브 표면을 얹는다.

### 3대 원칙
| 원칙 | 의미 | 의사결정 기준 |
|------|------|--------------|
| **불편·모호 ❌ > 못생김 ❌** | 사용자가 헷갈리느니 거친 게 낫다 | 두 옵션 중 명료한 쪽 |
| **위계가 색보다 먼저** | 타이포 크기·여백으로 정보 위계 → 색은 강조용 | 색 추가 전 타입스케일로 해결 시도 |
| **표면의 깊이** | 평면 디자인 + 3D/모션 서피스 1곳 | 한 페이지당 모션 hero 1개, 나머지는 정적 |

### 톤 레퍼런스
- **Editorial**: Pentagram, Are.na, Read.cv
- **Surface**: Apple product pages, Linear, Vercel

---

## 1. Foundations (포터블 — 매체 무관)

### 1-1. Color

**Semantic role 우선. Hex는 매체 따라 변환.**

**Light mode only.** 다크 모드 미지원.

| Role | CSS Variable | Value | 용도 |
|------|-------------|-------|------|
| Surface / Primary | `--color-surface` | `#FFFFFF` | 페이지 배경 |
| Surface / Inverted | `--color-surface-inverted` | `#121212` | filled-primary chip, dark hero |
| Surface / Disabled | `--color-surface-disabled` | `#DADADA` | filled-secondary chip, 비활성 표면 |
| Text / Primary | `--color-text` | `#121212` | 본문·제목 |
| Text / Muted | `--color-text-muted` | `#444444` | 보조 텍스트, section-label, side-nav |
| Text / Subtle | `--color-text-subtle` | `#777777` | outlined-secondary chip, 더 흐린 보조 |
| Text / Inverse | `--color-text-inverse` | `#FFFFFF` | 반전 배경 위 |
| Accent | `--color-accent` | (세션 중 결정) | 강조 (한 페이지당 1곳 이내) |

### 1-2. Typography

**의도 우선**: Inter = UI / 정보, Merriweather = 표제 / 정체성, Space Grotesk = 레이블 / 분류.

#### Type Scale (Inter — base)

| Token | Size | Weight | LH | Tracking | 용도 |
|-------|------|--------|----|----------|------|
| `--text-headline-lg` | 36 | 600 | 1.4 | -0.5% | 페이지 제목 |
| `--text-headline-md` | 32 | 600 | 1.4 | -0.5% | 섹션 제목 |
| `--text-headline-sm` | 28 | 500 | 1.4 | -0.5% | 서브 섹션 |
| `--text-title-lg` | 28 | 400 | 1.4 | 0 | 카드 제목 |
| `--text-title-md` | 20 | 500 | 1.4 | 0 | 네비, 강조 텍스트 |
| `--text-title-sm` | 18 | 600 | 1.5 | 0 | 리스트 헤딩 |
| `--text-body-lg` | 18 | 500 | 1.5 | 0 | 강조 본문 |
| `--text-body-md` | 18 | 400 | 1.55 | 0 | 본문 |
| `--text-body-sm` | 16 | 500 | 1.5 | 0 | 작은 본문, chip |
| `--text-caption-lg` | 16 | 400 | 1.55 | 0 | 캡션 |
| `--text-caption-md` | 14 | 500 | 1.55 | 0 | 메타 |
| `--text-caption-sm` | 14 | 400i | 1.4 | 0 | 인용·italic |

#### Display Scale (Merriweather)

| 용도 | Size | Weight | LH |
|------|------|--------|-----|
| Hero headline | 48 | 600 | 1.4 |
| Editorial pullquote | 36 | 700 | 1.55 |
| Section opener | 32 | 600 | 1.4 |
| Sub display | 28 | 600 | 1.4 |

#### Label (Space Grotesk)

| 용도 | Size | Weight | Tracking | Case |
|------|------|--------|----------|------|
| `project-meta__label` | 18 | 700 | 0.9px | UPPER |
| `section-label` | 20 | 700 | 0.8px | UPPER |

### 1-3. Spacing & Layout (포터블)

**4px base unit + clamp() 기반 — 매체 무관.**

| Token | Value | 용도 |
|-------|-------|------|
| `--space-1` | `4px` | hairline |
| `--space-2` | `8px` | 컴포넌트 내부 gap |
| `--space-3` | `12px` | |
| `--space-4` | `16px` | 컴포넌트 padding |
| `--space-6` | `24px` | 컴포넌트 사이 |
| `--space-8` | `32px` | 그룹 사이 |
| `--space-12` | `48px` | 섹션 내부 |
| `--space-20` | `80px` | 섹션 사이 |
| `--space-32` | `128px` | 큰 섹션 분리 |

**Container:**
```css
--content-max: 1216px;
--page-gutter: clamp(24px, 5vw, 352px);  /* mobile → web 자동 */
```

**Breakpoints:**
- `mobile`: `< 768px`
- `tablet`: `768px – 1280px`
- `desktop`: `> 1280px`

### 1-4. Motion ⭐

**현재 코드에서 추출한 실제 값 + 시스템화.**

| Token | Duration | Ease | 용도 |
|-------|----------|------|------|
| `--motion-instant` | 100ms | `linear` | 즉각 피드백 (focus ring) |
| `--motion-fast` | 200ms | `ease` | hover, opacity |
| `--motion-base` | 400ms | `power2.inOut` | UI 트랜지션 |
| `--motion-slow` | 800-1200ms | `power2.inOut` | 스크롤 트리거, hero |
| `--motion-ambient` | ∞ | sine | 3D 배경 idle |

```js
// GSAP 표준값
export const MOTION = {
  fast:    { duration: 0.2, ease: 'power2.out' },
  base:    { duration: 0.4, ease: 'power2.inOut' },
  slow:    { duration: 1.0, ease: 'power2.inOut' },  // 0.8~1.2 범위
};
```

**규칙:**
- UI 마이크로 인터랙션 → `fast`
- 페이지 내 컴포넌트 등장 → `base`
- 스크롤 트리거 / hero 변환 → `slow`
- `prefers-reduced-motion: reduce` 반드시 존중

### 1-5. Effects ⭐

| Token | Value | 용도 |
|-------|-------|------|
| `--shadow-flat` | none | 기본 (편평한 종이) |
| `--shadow-elevated` | `0 4px 24px rgba(0,0,0,0.08)` | 카드, 모달 |
| `--shadow-overlay` | `0 16px 48px rgba(0,0,0,0.16)` | 떠 있는 패널 |
| `--radius-sm` | `8px` | 카드, 이미지 |
| `--radius-md` | `20px` | chip |
| `--radius-pill` | `40px` | nav link, 큰 버튼 |
| `--radius-full` | `9999px` | 원형 |
| `--blur-surface` | `blur(20px)` | 글래스모피즘 (절제) |

**3D 표면 (Three.js):**
- HDRI: Polyhaven (저채도 환경)
- 표면: matte → satin (광택 절제)
- 한 페이지당 hero WebGL 1곳

---

## 2. Components (web 구현)

> **Semantic intent** 우선 기술. Figma node ID는 §4 부록 참조.

### 2-1. `category-chip`
**의도**: 프로젝트 분류 태그. 정보 위계의 최소 단위.

| 항목 | 값 |
|-----|-----|
| height | 32px (`--space-8`) |
| padding | 5px 16px |
| radius | `--radius-md` |
| font | `--text-body-sm` |

| Variant | bg | text | border |
|---------|-----|------|--------|
| filled / Primary | `--color-surface-inverted` | `--color-text-inverse` | — |
| outlined / Primary | transparent | `--color-text` | 1px `--color-text` |
| filled / Secondary | `--color-surface-disabled` | `--color-text-inverse` | — |
| outlined / Secondary | transparent | `--color-text-subtle` | 1px `--color-text-subtle` |

### 2-2. `header-nav__link`
**의도**: 글로벌 네비 — 페이지 간 이동의 명료한 anchor.

| 항목 | 값 |
|-----|-----|
| padding | 12px 20px |
| radius | `--radius-pill` |
| font | `--text-title-md` |
| color | `--color-text` |
| hover | bg `--color-text` + text `--color-text-inverse`, `--motion-fast` |

### 2-3. `side-nav__link`
**의도**: 페이지 내 섹션 이동 — 위계가 색보다 먼저.

| 항목 | 값 |
|-----|-----|
| width | 310px |
| gap | `--space-2` |
| font | `--text-title-sm` (Semi Bold) |
| color | `--color-text-muted` |
| indicator | 6×6, `--radius-sm`(1px), `--color-text-muted` |

States: `active` (indicator 표시), `default` (indicator 숨김 또는 투명도 0.3).

### 2-4. `project-meta__item`
**의도**: 프로젝트 메타데이터 (Role, Tools 등) — 레이블·값 페어.

| 항목 | 값 |
|-----|-----|
| width | 277px |
| direction | column, gap `--space-2` |
| label | Space Grotesk Bold 18, `--color-text-muted`, tracking 0.9px, UPPER |
| value | Inter Regular 16, `--color-text`, LH 1.5 |

### 2-5. `section-label`
**의도**: 페이지 내 콘텐츠 섹션 도입부 — 작은 헤딩.

| 항목 | 값 |
|-----|-----|
| layout | row, gap `10px`, items center |
| accent-bar | 6px wide, full height, `--color-text-muted` |
| label | Space Grotesk Bold 20, `--color-text-muted`, tracking 0.8px, UPPER, LH 1.3 |

### 2-6. `logo`
**의도**: 브랜드 마크 — 헤더 좌측 고정.

| 항목 | 값 |
|-----|-----|
| size | 100 × 100px (실사용 36 × 36px) |
| asset | SVG (`logo.svg`) |
| variants | `theme=dark` (light bg용), `theme=light` (dark bg용) |
| 색상 | SVG fill이 `currentColor` 또는 semantic 토큰 참조 |

---

## 3. Adaptation Rules (Remix — 매체 간 이식)

같은 DNA를 다른 매체로 옮길 때.

| 매체 | 변환 규칙 |
|------|----------|
| **Mobile (< 768px)** | Headline -1 step / `--page-gutter` clamp 하단값 / hero WebGL → 정적 이미지 폴백 |
| **LinkedIn 카드 (1080×1080)** | Merriweather 그대로 / 컬러 inverted / 모션 ❌ → 정적 |
| **슬라이드 (16:9)** | Display 한 줄 + caption / 그리드 8col / accent 1곳 |
| **Notion 페이지** | Inter only (Merriweather/Space Grotesk ❌) / 시스템 색 우선 |

---

## 4. AI Usage

### 4-1. 프롬프트 첨부 (Opus 4.7)

```xml
<design_system>
  (DESIGN.md 0~3장 내용 — 4장 부록은 제외)
</design_system>

<task>
  Suno 프로젝트 상세 페이지 hero 섹션 구현
</task>

<constraints>
  - Foundations 토큰만 사용. 임의 hex/duration ❌
  - prefers-reduced-motion 존중
</constraints>
```

### 4-2. Skills (toppings) 분리

다음은 DESIGN.md가 아닌 `.claude/skills/`로:
- `nayun-motion/` — GSAP 마이크로 인터랙션 패턴
- `nayun-3d-surface/` — Three.js fluid sim, HDRI 셋업
- `nayun-copywriting/` — 카피 톤·길이 가이드

DESIGN.md = **DNA (base)**, Skills = **재료 (toppings)**.

---

## 5. 부록 — Figma Node ID

| 컴포넌트 | Node ID |
|---------|---------|
| Components 페이지 | `45:1869` |
| Typography 섹션 | `48:128` |
| project-header | `45:1872` |
| hero-section | `45:1885` |
| project-meta | `45:1887` |
| side-nav | `45:1900` |
| category-chip (variants) | `49:1502` |
| header-nav__link | `45:1946` |
| side-nav__link (active) | `45:1955` |
| project-meta__item | `46:44` |
| section-label | `121:322` |
| section-label · accent-bar | `121:319` |
| logo | `46:106` |
