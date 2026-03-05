---
trigger: always_on
---

# Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.
Merge with project-specific instructions as needed.

Tradeoff:
These guidelines bias toward caution over speed.
For trivial tasks, use judgment.

---

## 1. Think Before Coding

Don't assume.
Don't hide confusion.
Surface tradeoffs.

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them.
- If a simpler approach exists, say so and push back if needed.
- If something is unclear, stop and ask before coding.

---

## 2. Simplicity First

Write the minimum code that solves the problem.
Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No unrequested flexibility or configurability.
- No error handling for impossible scenarios.
- If 200 lines can be 50, rewrite it.

Ask:
"Would a senior engineer say this is overcomplicated?"
If yes, simplify.

---

## 3. Surgical Changes

Touch only what you must.
Clean up only your own mess.

When editing existing code:
- Don’t improve adjacent code or formatting.
- Don’t refactor what isn’t broken.
- Match existing style.
- If you see unrelated dead code, mention it — don’t delete it.

If your changes create orphans:
- Remove unused imports/variables/functions you introduced.
- Don’t remove pre-existing dead code unless asked.

Every changed line must trace directly to the user’s request.

---

## 4. Goal-Driven Execution

Define clear success criteria.
Loop until verified.

Transform vague tasks into verifiable goals:
- “Add validation” → write failing tests, then make them pass
- “Fix a bug” → reproduce with a test, then fix it
- “Refactor X” → ensure tests pass before and after

For multi-step tasks, state a brief plan:
1. Step → verify
2. Step → verify
3. Step → verify

---

## 5. Answer Style
- 모든 대답과 주석은 '한국어'로 작성할 것.
- 새로운 라이브러리나 패키지를 설치할 때는 반드시 미리 허락을 구할 것.
- 코드를 수정할 때는 기존의 코드 스타일을 무조건 유지할 것.