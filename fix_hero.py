import re

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Remove calcWidthAndLeft and initial gsap.set
# Specifically, we find from `function calcWidthAndLeft` down to `gsap.set(container, { width: init.width...`
pattern1 = r'(\s*function calcWidthAndLeft\(progress\).*?\}\s*// Read initial static DOM position for pinpointing the "O" center\s*const svgRect = container\.getBoundingClientRect\(\);\s*// Set initial state: left:0 in CSS.*?visibility: \'visible\' \}\);\s*)const vp = window.innerWidth;'
replacement1 = '\n        // Read initial static DOM position for pinpointing the "O" center\n        const svgRect = container.getBoundingClientRect();\n\n        const vp = window.innerWidth;'

text = re.sub(pattern1, replacement1, text, flags=re.DOTALL)

# Also fix `init.width` uses right after:
text = text.replace('init.width * O_CENTER_X_RATIO', 'vp * O_CENTER_X_RATIO')
text = text.replace('init.width * (102.502 / 1920)', 'vp * (102.502 / 1920)')

# 2. In onUpdate: remove calcWidthAndLeft(self.progress), and replace `width` with `window.innerWidth` in Works block
# Wait, actually let's just do precise replacements.
onUpdate_old = """                onUpdate: (self) => {
                    const { width, x, y } = calcWidthAndLeft(self.progress);
                    gsap.set('#text-left', { x: -window.innerWidth * 0.6 * self.progress });
                    gsap.set('#text-right', { x: window.innerWidth * 0.6 * self.progress });
                    gsap.set(container, { width, x, y });
                    console.log(
                        '[ScrollTrigger] progress:', self.progress.toFixed(4),
                        '| width:', (width / window.innerWidth).toFixed(2) + '× vp',
                        '| O screen X:', (x + O_CENTER_X_RATIO * width).toFixed(1) + 'px',
                        '| y:', y.toFixed(1) + 'px'
                    );"""

onUpdate_new = """                onUpdate: (self) => {
                    gsap.set('#text-left', { x: -window.innerWidth * 0.6 * self.progress });
                    gsap.set('#text-right', { x: window.innerWidth * 0.6 * self.progress });
                    const width = window.innerWidth;
                    """
text = text.replace(onUpdate_old, onUpdate_new)

# 3. In onEnter
onEnter_old = """                onEnter: () => {
                    console.log('[ScrollTrigger] Hero → entered');
                    gsap.set(container, { visibility: 'visible' });
                },"""
onEnter_new = """                onEnter: () => {
                    console.log('[ScrollTrigger] Hero → entered');
                },"""
text = text.replace(onEnter_old, onEnter_new)

# 4. In onLeave
onLeave_old = """                onLeave: () => {
                    console.log('[ScrollTrigger] Hero → left (scrolled past)');
                    gsap.set(container, { visibility: 'hidden' });"""
onLeave_new = """                onLeave: () => {
                    console.log('[ScrollTrigger] Hero → left (scrolled past)');"""
text = text.replace(onLeave_old, onLeave_new)

# 5. In onEnterBack
onEnterBack_old = """                onEnterBack: () => {
                    console.log('[ScrollTrigger] Hero → entered back');
                    gsap.set(container, { visibility: 'visible' });"""
onEnterBack_new = """                onEnterBack: () => {
                    console.log('[ScrollTrigger] Hero → entered back');"""
text = text.replace(onEnterBack_old, onEnterBack_new)

# 6. In onLeaveBack
onLeaveBack_old = """                onLeaveBack: () => {
                    gsap.set('#text-left', { x: 0 });
                    gsap.set('#text-right', { x: 0 });
                    console.log('[ScrollTrigger] Hero → left back (back to top)');
                    const { width, x, y } = calcWidthAndLeft(0);
                    gsap.set(container, { width, x, y });
                },"""
onLeaveBack_new = """                onLeaveBack: () => {
                    gsap.set('#text-left', { x: 0 });
                    gsap.set('#text-right', { x: 0 });
                    console.log('[ScrollTrigger] Hero → left back (back to top)');
                },"""
text = text.replace(onLeaveBack_old, onLeaveBack_new)

with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Replacement Complete")
