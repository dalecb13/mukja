# Fix unrs-resolver Postinstall Error

## Problem

When installing packages (like hcaptcha), you get:
```
Error: Cannot find module './constants'
from unrs-resolver postinstall script
```

## Root Cause

`unrs-resolver` is a native Node.js module that requires:
- Node.js 20 or higher
- Proper native bindings compilation
- The postinstall script sometimes fails due to build issues

## Solutions

### Solution 1: Skip Postinstall Scripts (Quick Fix)

Install with `--ignore-scripts`:

```bash
pnpm install --ignore-scripts
```

Then manually run postinstall for packages that need it (if any).

### Solution 2: Ensure Correct Node Version

Make sure you're using Node 20+:

```bash
# Check current version
node --version

# Should be v20.x.x or higher
# If not, switch using nvm:
nvm use 20
# or
nvm use 22
```

### Solution 3: Clean Install

Sometimes a clean reinstall fixes it:

```bash
# Remove all node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install
```

### Solution 4: Install hcaptcha Specifically

If you're installing `@hcaptcha/react-hcaptcha` or similar:

```bash
# Try installing with ignore-scripts first
pnpm add @hcaptcha/react-hcaptcha --ignore-scripts

# Or if that doesn't work, install the package that needs it
pnpm add <hcaptcha-package-name> --ignore-scripts
```

### Solution 5: Update pnpm

Sometimes an outdated pnpm version causes issues:

```bash
pnpm add -g pnpm@latest
```

### Solution 6: Use .npmrc to Skip Scripts Globally

Add to `.npmrc` at project root:

```
ignore-scripts=true
```

**Note:** This will skip ALL postinstall scripts, which might break other packages. Use with caution.

## Recommended Approach

1. **First, try Solution 1** (install with `--ignore-scripts`)
2. **If that works**, the package should still function - most packages don't need postinstall scripts to work
3. **If you need the postinstall**, try Solution 3 (clean install)

## For hcaptcha Specifically

If installing `@hcaptcha/react-hcaptcha`:

```bash
# This package doesn't typically need native bindings
pnpm add @hcaptcha/react-hcaptcha --ignore-scripts
```

The hcaptcha React component is pure JavaScript and doesn't need native compilation.






