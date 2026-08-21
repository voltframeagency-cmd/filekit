import re

with open("src/config/seo/toolFaqs.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
skip_howto = False

for line in lines:
    # Skip local category definitions inside if-blocks
    if re.match(r'^\s*const category\s*=', line):
        continue
    # Skip local howToSteps definitions inside if-blocks
    if re.match(r'^\s*const howToSteps\s*:\s*HowToStep\[\]\s*=', line):
        skip_howto = True
        continue
    if skip_howto:
        if re.match(r'^\s*\];\s*$', line):
            skip_howto = False
        continue
    out.append(line)

with open("src/config/seo/toolFaqs.ts", "w", encoding="utf-8") as f:
    f.writelines(out)

print("Successfully removed shadowed variables in toolFaqs.ts")
