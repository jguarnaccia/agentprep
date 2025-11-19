# 🎨 Mantine UI Setup Instructions

## Step 1: Install Dependencies

Run this command in your project root:

```bash
npm install @mantine/core @mantine/hooks @mantine/notifications framer-motion
```

## Step 2: Install PostCSS Plugin (Required for Mantine)

```bash
npm install --save-dev postcss-preset-mantine postcss-simple-vars
```

## Step 3: Update postcss.config.mjs

Replace the contents of `postcss.config.mjs` with:

```javascript
export default {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

## Step 4: After Installation

Once you've run the install commands:
1. Run `npm run dev` to start the dev server
2. The new UI will be live with:
   - Modern dark theme
   - Sidebar navigation
   - Beautiful components
   - Smooth animations
   - Professional layouts

## What's Included

✅ Mantine Core - Complete UI component library
✅ Mantine Hooks - Useful React hooks
✅ Mantine Notifications - Toast notifications system
✅ Framer Motion - Animation library
✅ All templates and layouts ready to use

## Troubleshooting

If you see styling issues:
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall: `npm install`
3. Restart dev server: `npm run dev`

---

Ready to proceed? Run the install command above, then I'll update all your files!
