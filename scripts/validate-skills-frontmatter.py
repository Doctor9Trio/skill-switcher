"""
Validate and audit YAML frontmatter across all installed Antigravity & Agent skills.
Usage: python scripts/validate-skills-frontmatter.py
"""
import os
import sys
import yaml

TARGET_DIRS = [
    os.path.expanduser(r"~/.gemini/config/skills"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".agents", "skills")
]

def audit():
    total_scanned = 0
    errors = []

    for base in TARGET_DIRS:
        if not os.path.isdir(base):
            continue
        for root, dirs, files in os.walk(base):
            if "SKILL.md" in files:
                total_scanned += 1
                p = os.path.join(root, "SKILL.md")
                rel = os.path.relpath(p, base)
                try:
                    with open(p, "rb") as f:
                        raw = f.read()
                    if raw.startswith(b"\xef\xbb\xbf"):
                        errors.append((rel, "UTF-8 BOM header detected"))
                        continue
                    text = raw.decode("utf-8", errors="replace")
                    if not text.startswith("---"):
                        errors.append((rel, "Missing opening '---' frontmatter boundary"))
                        continue
                    parts = text.split("---", 2)
                    if len(parts) < 3:
                        errors.append((rel, "Missing closing '---' frontmatter boundary"))
                        continue
                    parsed = yaml.safe_load(parts[1])
                    if not isinstance(parsed, dict):
                        errors.append((rel, "Frontmatter is not a key-value mapping"))
                    elif not parsed.get("name"):
                        errors.append((rel, "Frontmatter missing required 'name' field"))
                except Exception as e:
                    errors.append((rel, str(e).split("\n")[0]))

    print(f"Scanned {total_scanned} skills across target directories.")
    if errors:
        print(f"Found {len(errors)} issues:")
        for file, err in errors:
            print(f"  - {file}: {err}")
        sys.exit(1)
    else:
        print("All skills passed frontmatter validation! (0 errors)")
        sys.exit(0)

if __name__ == "__main__":
    audit()

