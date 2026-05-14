---
name: figma-section
description: Figma MCP로 특정 섹션·노드를 코드로 구현할 때 사용. URL/nodeId를 받아 get_design_context + screenshot으로 디자인을 가져오고, 프로젝트 스택과 design.md에 맞춰 재구성한다. 사용자가 "/figma-section", "이 피그마 구현해줘", Figma URL 첨부, "Hero 섹션 만들어줘" 등을 말할 때 실행.
---

# figma-section — Figma MCP × Claude Code 섹션 구현

> Figma MCP 출력은 **참고용 React+Tailwind 레퍼런스**다. 최종 코드가 아니다.
> 반드시 프로젝트 스택·design.md·기존 컴포넌트에 맞춰 **재구성**한다.

---

## 핵심 원칙

| 원칙 | 이유 |
|------|------|
| MCP 코드 ≠ 최종 코드 | `get_design_context`는 레퍼런스. 그대로 붙이면 디자인 시스템 깨짐 |
| Opus 4.7은 문자 그대로 실행 | 모호한 지시 = 조용한 실패 → XML로 명시 |
| design.md를 매 호출에 첨부 | one-shot은 page 2에서 드리프트 |
| 반성 단계(`<thinking>`) 강제 | "낙관적 체이닝" 방지 — MCP 출력 무비판 수용 차단 |

---

## 실행 순서

### Step 1 — 입력 파싱
사용자 입력에서 추출:
- **Figma URL** → `fileKey`, `nodeId` 분리
  - `figma.com/design/{fileKey}/.../?node-id=1-234` → nodeId의 `-`를 `:`로 변환 (`1:234`)
  - branch URL이면 `branchKey`를 fileKey로 사용
- **섹션 이름** (Hero, Pricing, Footer 등)
- **누락 시 질문**: URL이 없으면 먼저 요청

### Step 2 — Figma에서 디자인 가져오기
병렬 호출:
1. `mcp__figma__get_design_context` — 코드 + 스크린샷 + 힌트
2. `mcp__figma__get_screenshot` — 시각적 의도 확인용
3. (필요 시) `mcp__figma__get_code_connect_map` — 매핑된 컴포넌트 확인

### Step 3 — `<findings>` 보고
사용자에게 보고 (코드 생성 전에):

```xml
<findings>
- Code Connect 매핑: [있음/없음] — 있으면 매핑된 컴포넌트 우선
- 디자인 토큰: [CSS 변수로 잘 정의 / raw hex 섞임]
- 레이아웃: [auto-layout 잘 잡힘 / absolute positioning 섞임]
- 디자인 annotation: [있음 — 내용 / 없음]
- 모호한 부분: [상호작용·상태·반응형 명시 안 된 항목]
</findings>
```

### Step 4 — `<plan>` 작성 후 승인 대기
```xml
<plan>
- 파일 경로: src/components/sections/Hero.tsx
- 재사용할 기존 컴포넌트: Button (shadcn), Container
- 새로 만들 컴포넌트: HeroVisual
- 반응형: 375 → 768 → 1440
- design.md 토큰 매핑: ...
</plan>
```
**사용자 OK 받기 전에 코드 작성 금지.**

### Step 5 — 구현 + 검증
구현 완료 후 **반드시** `<assertions>` 블록으로 통과 여부를 체크리스트로 보고. 한 항목이라도 ❌면 그 자리에서 수정 후 재검증.

```xml
<assertions>
- [ ] design.md 토큰 외 raw hex/rgb 값 0개
- [ ] absolute positioning 0개 (전부 flex/grid로 재구성)
- [ ] MCP 출력 코드를 그대로 복사한 부분 0개 (전부 프로젝트 컨벤션으로 재작성)
- [ ] 외부 라이브러리 추가 0개 (있다면 사용자 승인 받았는가)
- [ ] 반응형 breakpoint 3개 모두 처리 (375 / 768 / 1440)
- [ ] 기존 컴포넌트(shadcn 등) 재사용 시도 후 신규 생성했는가
- [ ] Code Connect 매핑이 있었다면 매핑된 컴포넌트를 우선 사용했는가
</assertions>
```

이후 `<warnings>` 태그로 불확실성(디자인 모호, 상호작용 미정의 등) 명시.

---

## 프롬프트 빌드 템플릿 (내부 구조)

```xml
<context>
프로젝트: (CLAUDE.md / package.json에서 추출)
컴포넌트 경로: src/components/
디자인 시스템: 아래 design_system 참조
</context>

<design_system>
(프로젝트 루트의 design.md 내용 — 없으면 사용자에게 물어보고 만들기 제안)
</design_system>

<figma_source>
fileKey: {fileKey}
nodeId: {nodeId}
</figma_source>

<task>
{섹션명} 섹션을 구현.
</task>

<constraints>
- MCP 출력 코드를 그대로 붙이지 말 것 → 기존 컴포넌트 재사용
- absolute positioning은 flex/grid로 재구성
- design_system 토큰만 사용 (raw hex 금지)
- 반응형: 375 / 768 / 1440
- 외부 라이브러리 추가 금지 (필요 시 먼저 질문)
</constraints>

<output_format>
1. <findings>
2. <plan> (승인 대기)
3. (승인 후) 파일별 코드
4. <assertions> (체크리스트 7항목 통과 여부)
5. <warnings>
</output_format>

<task_restated>
다시: {섹션명}을 프로젝트 스택·design.md에 맞춰 구현. MCP는 참고.
</task_restated>
```

---

## ❌ 금지 패턴

- `"think step by step"` 추가 — Opus 4.7에선 토큰 낭비 + 출력 저하
- MCP 출력 코드를 한 번에 통째로 붙여넣기
- design.md 없이 진행 (없으면 먼저 만들 것을 제안)
- 사용자 승인 없이 plan 단계 건너뛰고 바로 구현
- 한 호출로 전체 페이지 구현 (섹션 단위로 끊기)

---

## URL 파싱 치트시트

| URL 패턴 | 추출 |
|---------|------|
| `figma.com/design/:fileKey/:name?node-id=:nodeId` | nodeId의 `-` → `:` |
| `figma.com/design/:fileKey/branch/:branchKey/:name` | `branchKey`를 fileKey로 |
| `figma.com/board/:fileKey/...` | FigJam → `get_figjam` 사용 |
| `figma.com/make/:makeFileKey/...` | `makeFileKey` 사용 |

---

## 출력 스타일

- 표·리스트 우선, 단락 텍스트 금지
- 한국어 (기술 용어 영문 OK), 친근한 존댓말
- 잡담·서두 생략, 결과부터
