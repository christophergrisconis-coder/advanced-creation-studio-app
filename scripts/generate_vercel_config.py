#!/usr/bin/env python3
"""
Generate vercel.json for the Advanced Creation Studio Expo app.

This repo is an Expo (React Native + expo-router) project. The web build is
produced by `npx expo export --platform web`, which writes static output to
dist/ (app.json sets web.output to "static").

Key rules enforced here:
- NO "framework" field in vercel.json ("expo" is not a valid Vercel preset
  value and we do not want Vercel's automatic framework detection to take
  over; the dashboard preset should stay on "Other").
- The build command is the plain Expo static export, nothing else. There is
  intentionally no `npm run build` script in package.json.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

EXPECTED_FILES = ("package.json", "app.json", "tsconfig.json")
EXPECTED_DIRS = ("src", "src/app", "assets")
EXPECTED_ROUTES = ("_layout.tsx", "index.tsx")

BUILD_COMMAND = "npx expo export --platform web"
OUTPUT_DIRECTORY = "dist"


def find_project_root(start: Path) -> Path:
    """Walk up from start until we find app.json or hit filesystem root."""
    current = start.resolve()
    while True:
        if (current / "app.json").is_file():
            return current
        parent = current.parent
        if parent == current:
            break
        current = parent
    return start.resolve()


def build_vercel_config() -> dict:
    return {
        "$schema": "https://openapi.vercel.sh/vercel.json",
        "buildCommand": BUILD_COMMAND,
        "outputDirectory": OUTPUT_DIRECTORY,
        "cleanUrls": True,
        "trailingSlash": False,
    }


def validate_structure(project_root: Path) -> list[str]:
    issues: list[str] = []

    for expected in EXPECTED_FILES:
        if not (project_root / expected).is_file():
            issues.append(f"Expected file missing: {expected}")

    for dirname in EXPECTED_DIRS:
        if not (project_root / dirname).is_dir():
            issues.append(f"Expected directory missing: {dirname}/")

    routes_dir = project_root / "src" / "app"
    if routes_dir.is_dir():
        for route in EXPECTED_ROUTES:
            if not (routes_dir / route).is_file():
                issues.append(f"Expected route missing: src/app/{route}")

    package_json = project_root / "package.json"
    if package_json.is_file():
        try:
            pkg = json.loads(package_json.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            issues.append("package.json is not valid JSON")
        else:
            deps = pkg.get("dependencies", {})
            if "expo" not in deps:
                issues.append("package.json has no 'expo' dependency")
            if "build" in pkg.get("scripts", {}):
                issues.append(
                    "package.json defines a 'build' script; the Vercel build "
                    f"command is expected to be just: {BUILD_COMMAND}"
                )

    app_json = project_root / "app.json"
    if app_json.is_file():
        try:
            app_cfg = json.loads(app_json.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            issues.append("app.json is not valid JSON")
        else:
            web_output = app_cfg.get("expo", {}).get("web", {}).get("output")
            if web_output != "static":
                issues.append(
                    f"app.json expo.web.output is {web_output!r}; expected "
                    "'static' for a static export to dist/"
                )

    return issues


def print_deploy_instructions(project_root: Path) -> None:
    print()
    print("Deploy notes")
    print("=" * 60)
    print()
    print("1) Vercel CLI (from project root)")
    print(f"   cd {project_root}")
    print("   npx vercel            # preview")
    print("   npx vercel --prod     # production")
    print()
    print("2) GitHub integration")
    print("   - Import the repo at https://vercel.com/new")
    print("   - Framework Preset: Other (do NOT pick a framework preset)")
    print(f"   - Build Command: {BUILD_COMMAND}")
    print(f"   - Output Directory: {OUTPUT_DIRECTORY}")
    print()
    print("Caveats")
    print("-" * 60)
    print('- vercel.json must NOT contain a "framework" field.')
    print("- Do not add a 'build' script to package.json for Vercel's sake;")
    print("  the buildCommand above is the whole web build.")
    print("- vercel.json must be committed; .vercel/ should stay gitignored.")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate vercel.json for the Expo app (no framework field)."
    )
    parser.add_argument(
        "--project-dir",
        type=Path,
        default=None,
        help="Project root (default: parent of scripts/ or cwd)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print config without writing vercel.json",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit with error if validation finds issues",
    )
    args = parser.parse_args()

    if args.project_dir:
        project_root = args.project_dir.resolve()
    else:
        script_dir = Path(__file__).resolve().parent
        project_root = find_project_root(script_dir.parent)

    if not project_root.is_dir():
        print(f"Error: project directory not found: {project_root}", file=sys.stderr)
        return 1

    config = build_vercel_config()
    issues = validate_structure(project_root)

    print(f"Project: {project_root}")

    if issues:
        print("\nValidation notes:")
        for issue in issues:
            print(f"  - {issue}")
        if args.strict:
            return 1

    config_json = json.dumps(config, indent=2) + "\n"
    config_path = project_root / "vercel.json"

    print("\nGenerated vercel.json:")
    print("-" * 60)
    print(config_json, end="")

    if args.dry_run:
        print(f"\n(dry run - not writing {config_path})")
    else:
        config_path.write_text(config_json, encoding="utf-8")
        print(f"\nWrote {config_path}")

    print_deploy_instructions(project_root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
