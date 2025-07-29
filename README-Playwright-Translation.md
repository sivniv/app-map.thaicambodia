# Playwright Translation Automation

This project includes Playwright scripts to automate translation testing and changes for the Thailand-Cambodia Conflict Monitor application.

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Start Development Server
```bash
npm run dev
# Server will run on http://localhost:3001
```

### 3. Run Translation Automation

#### Option A: Interactive Script (Recommended)
```bash
# Translate to Thai
npm run translate th

# Translate to Khmer
npm run translate km

# Translate to Chinese
npm run translate zh

# Translate to Korean  
npm run translate ko

# Translate to French
npm run translate fr

# Back to English
npm run translate en
```

#### Option B: Direct Node Script
```bash
# Basic usage
node scripts/translate-page.js th

# With custom URL
node scripts/translate-page.js thai http://localhost:3001/admin

# Full language names work too
node scripts/translate-page.js khmer
node scripts/translate-page.js chinese
node scripts/translate-page.js korean
node scripts/translate-page.js french
```

### 4. Run Translation Tests
```bash
# Run all translation tests
npm run test:translation

# Run in UI mode for debugging
npm run test:ui

# View test report
npm run test:report
```

## Features

### Automated Translation Script (`scripts/translate-page.js`)
- ✅ **Full Page Translation**: Translates entire page content using Google Translate
- ✅ **Multiple Languages**: Supports Thai, Khmer, Chinese, Korean, French
- ✅ **Screenshots**: Automatically captures screenshots of translated pages
- ✅ **Loading Detection**: Waits for translation to complete
- ✅ **Error Handling**: Graceful error handling and reporting
- ✅ **Interactive Mode**: Keeps browser open for manual inspection

### Translation Tests (`tests/translation.spec.ts`)
- ✅ **Language Switching Tests**: Verifies all languages work correctly
- ✅ **Loading Indicator Tests**: Ensures translation loading is shown
- ✅ **Content Verification**: Confirms translation actually occurs
- ✅ **Cross-browser Support**: Tests on Chrome, Firefox, Safari

## Script Options

### Language Codes
- `en` or `english` - English
- `th` or `thai` - Thai (ไทย)
- `km` or `khmer` - Khmer (ខ្មែរ)
- `zh` or `chinese` - Chinese (中文)
- `ko` or `korean` - Korean (한국어)
- `fr` or `french` - French (Français)

### Usage Examples

```bash
# Basic translation to Thai
npm run translate th

# Translate admin page to Chinese
node scripts/translate-page.js chinese http://localhost:3001/admin

# Get help
node scripts/translate-page.js --help

# Test specific language
npm run test:translation -- --grep "Thai Translation"
```

## How It Works

1. **Page Load**: Playwright navigates to the specified URL
2. **Language Selection**: Finds and clicks the language selector dropdown
3. **Language Switch**: Selects the target language option
4. **Translation Wait**: Waits for Google Translate to process the page
5. **Verification**: Captures screenshot and sample text
6. **Inspection**: Keeps browser open for manual verification (optional)

## Files Structure

```
├── scripts/
│   └── translate-page.js          # Main translation automation script
├── tests/
│   └── translation.spec.ts        # Playwright test suite
├── screenshots/                   # Auto-generated screenshots
├── playwright.config.ts           # Playwright configuration
└── README-Playwright-Translation.md
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Make sure dev server is running on port 3001
2. **Translation Delays**: Google Translate may take 3-5 seconds to complete
3. **Element Not Found**: Ensure the application is fully loaded before testing

### Debug Mode

Run tests in UI mode to see what's happening:
```bash
npm run test:ui
```

### Custom Timeouts

For slower connections, modify timeouts in the script:
```javascript
await page.waitForTimeout(8000); // Increase translation wait time
```

## Integration with CI/CD

Add to your CI pipeline:
```yaml
- name: Test Translations
  run: |
    npm run dev &
    sleep 10
    npm run test:translation
```

## Screenshots

All translation screenshots are automatically saved to `./screenshots/` with timestamps:
- `translated-th-1640995200000.png`
- `translated-km-1640995300000.png`
- etc.

## Advanced Usage

### Custom Translation Function

```javascript
const { chromium } = require('playwright');

async function customTranslate(language, url, options = {}) {
  const browser = await chromium.launch(options);
  const page = await browser.newPage();
  
  await page.goto(url);
  await page.click('[data-testid="language-selector"]');
  await page.click(`[data-testid="language-option-${language}"]`);
  await page.waitForTimeout(5000);
  
  const content = await page.textContent('body');
  await browser.close();
  
  return content;
}
```

This automation ensures your translation system works correctly across all supported languages!