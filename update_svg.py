import sys

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old1 = '<g id="hero/headline">\n                            <path id="Vector"'
new1 = '<g id="hero/headline">\n                            <g id="text-right">\n                                <path id="Vector"'
content = content.replace(old1, new1)

old2 = 'fill="#121212" />\n                            <path id="Vector_9"'
new2 = 'fill="#121212" />\n                            </g>\n                            <g id="text-center">\n                                <path id="Vector_9"'
content = content.replace(old2, new2)

old3 = 'fill="#121212" />\n                            <path id="Vector_10"'
new3 = 'fill="#121212" />\n                            </g>\n                            <g id="text-left">\n                                <path id="Vector_10"'
content = content.replace(old3, new3)

old4 = 'fill="#121212" />\n                        </g>\n                    </svg>'
new4 = 'fill="#121212" />\n                            </g>\n                        </g>\n                    </svg>'
content = content.replace(old4, new4)

# add extra indentation to the paths where needed
for i in range(1, 19):
    if i == 9 or i == 10 or i == 1:
        continue
    vecStr = f'\n                            <path id="Vector_{i}"'
    if i == 1: vecStr = '\n                            <path id="Vector"'
    content = content.replace(vecStr, f'\n                                <path id="Vector_{i}"')
content = content.replace('\n                            <path id="Vector"', '\n                                <path id="Vector"')

with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Success")
