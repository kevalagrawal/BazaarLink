# Tailwind CSS v4 Configuration Guide

## Overview
This project uses Tailwind CSS v4 for styling, which has been properly configured for global styling across the entire application.

## Configuration Files

### 1. `tailwind.config.js`
The main Tailwind configuration file that defines:
- Content paths for scanning
- Dark mode support
- Custom color extensions (orange palette)
- Custom font family (Inter)
- Custom spacing values
- Custom animations and keyframes

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ...],
      },
      // ... other extensions
    },
  },
  plugins: [],
}
```

### 2. `postcss.config.js`
PostCSS configuration for Tailwind CSS v4:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 3. `src/index.css`
Global CSS file with:
- Google Fonts import (Inter)
- Tailwind CSS imports
- CSS custom properties for theming
- Global reset styles
- Custom utility classes

## Key Features

### Dark Mode Support
The application supports dark mode using the `dark` class on the HTML element. The theme context automatically toggles this class.

### Custom Colors
- Extended orange color palette for brand consistency
- CSS custom properties for dynamic theming

### Typography
- Inter font family as the primary font
- Proper font smoothing and rendering

### Custom Utilities
- `.shadow-custom`: Custom shadow with CSS variables
- `.glass-effect`: Glass morphism effect with backdrop blur

## Usage Examples

### Basic Styling
```jsx
// Standard Tailwind classes work as expected
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </h1>
</div>
```

### Custom Orange Colors
```jsx
// Using the extended orange palette
<button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

### Dark Mode
```jsx
// Dark mode classes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content that adapts to theme
</div>
```

### Custom Utilities
```jsx
// Using custom utility classes
<div className="glass-effect p-6 rounded-lg">
  Glass effect content
</div>

<div className="shadow-custom p-6 rounded-lg">
  Custom shadow content
</div>
```

## Build Process

### Development
```bash
npm run dev
```
- Hot reload enabled
- Tailwind CSS processed in real-time
- Vite development server

### Production Build
```bash
npm run build
```
- Optimized CSS output
- Purged unused styles
- Minified for production

## Dependencies

### Required Packages
- `tailwindcss`: ^4.1.11
- `@tailwindcss/vite`: ^4.1.11
- `@tailwindcss/postcss`: Latest
- `autoprefixer`: ^10.4.21
- `postcss`: ^8.5.6

### Installation
```bash
npm install tailwindcss @tailwindcss/vite @tailwindcss/postcss autoprefixer postcss
```

## Best Practices

1. **Use Tailwind Classes Directly**: Prefer using Tailwind utility classes over custom CSS when possible.

2. **Dark Mode**: Always include dark mode variants for better user experience.

3. **Responsive Design**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:) for mobile-first design.

4. **Custom Colors**: Use the extended orange palette for brand consistency.

5. **Performance**: The build process automatically purges unused styles for optimal bundle size.

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed correctly
2. **Styles Not Loading**: Check that `src/index.css` is imported in `main.jsx`
3. **Dark Mode Not Working**: Verify the theme context is properly set up

### Debugging
- Check browser console for CSS errors
- Verify PostCSS configuration
- Ensure Tailwind classes are being processed

## Migration Notes

This configuration is specifically for Tailwind CSS v4, which has different syntax and requirements compared to v3:

- Uses `@import "tailwindcss/preflight"` instead of `@tailwind base`
- Uses `@import "tailwindcss/utilities"` instead of `@tailwind utilities`
- Requires `@tailwindcss/postcss` plugin
- Different approach to custom component classes

## Support

For issues related to:
- Tailwind CSS: Check the [official documentation](https://tailwindcss.com/docs)
- Vite integration: Check [Vite documentation](https://vitejs.dev/)
- PostCSS: Check [PostCSS documentation](https://postcss.org/) 