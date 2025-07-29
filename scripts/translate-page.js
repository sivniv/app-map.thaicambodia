const { chromium } = require('playwright');

/**
 * Playwright script to programmatically change page translation
 * Usage: node scripts/translate-page.js [language] [url]
 * Example: node scripts/translate-page.js th http://localhost:3001
 */

async function translatePage() {
  const args = process.argv.slice(2);
  const targetLanguage = args[0] || 'th'; // Default to Thai
  const url = args[1] || 'http://localhost:3001'; // Default URL
  
  console.log(`🔄 Starting translation to ${targetLanguage} for ${url}`);
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless mode
    slowMo: 1000 // Slow down actions for better visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to page
    console.log('📄 Navigating to page...');
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    // Wait for the language selector
    console.log('🔍 Waiting for language selector...');
    await page.waitForSelector('[data-testid="language-selector"]', { timeout: 10000 });
    
    // Click language selector to open dropdown
    console.log('🖱️  Opening language selector...');
    await page.click('[data-testid="language-selector"]');
    
    // Wait for dropdown options to appear
    await page.waitForTimeout(500);
    
    // Select target language
    const languageOption = `[data-testid="language-option-${targetLanguage}"]`;
    console.log(`🌐 Selecting language: ${targetLanguage}`);
    
    // Check if the language option exists
    const optionExists = await page.locator(languageOption).count() > 0;
    if (!optionExists) {
      console.error(`❌ Language option '${targetLanguage}' not found`);
      console.log('Available languages: en, th, km, zh, ko, fr');
      return;
    }
    
    await page.click(languageOption);
    
    // Wait for translation to start
    console.log('⏳ Waiting for translation to start...');
    try {
      await page.waitForSelector('text=Translating entire page...', { timeout: 5000 });
      console.log('✨ Translation started...');
    } catch (e) {
      console.log('ℹ️  Translation may have started without loading indicator');
    }
    
    // Wait for translation to complete (wait for loading indicator to disappear)
    console.log('⏳ Waiting for translation to complete...');
    await page.waitForTimeout(5000); // Give translation time to complete
    
    try {
      await page.waitForSelector('text=Translating entire page...', { 
        state: 'hidden', 
        timeout: 10000 
      });
      console.log('✅ Translation completed!');
    } catch (e) {
      console.log('ℹ️  Translation appears to be complete');
    }
    
    // Take a screenshot of the translated page
    const screenshotPath = `./screenshots/translated-${targetLanguage}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    
    // Get some sample text to verify translation
    console.log('📝 Sample translated content:');
    try {
      const title = await page.textContent('h1, h2, .text-2xl');
      console.log(`Title: ${title?.substring(0, 100)}...`);
      
      const summary = await page.textContent('p');
      console.log(`Sample text: ${summary?.substring(0, 100)}...`);
    } catch (e) {
      console.log('Could not extract sample text');
    }
    
    // Keep browser open for inspection (remove this for automated scripts)
    console.log('🔍 Page ready for inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(30000); // Wait 30 seconds for manual inspection
    
  } catch (error) {
    console.error('❌ Error during translation:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Browser closed');
  }
}

// Language mapping for user convenience
const languageMap = {
  'thai': 'th',
  'khmer': 'km',
  'chinese': 'zh',
  'korean': 'ko',
  'french': 'fr',
  'english': 'en'
};

// Process command line arguments
const args = process.argv.slice(2);
if (args.length > 0 && languageMap[args[0].toLowerCase()]) {
  args[0] = languageMap[args[0].toLowerCase()];
}

// Show usage if help requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Translation Automation Script

Usage: node scripts/translate-page.js [language] [url]

Languages:
  en, english  - English (default)
  th, thai     - Thai
  km, khmer    - Khmer (Cambodian)
  zh, chinese  - Chinese
  ko, korean   - Korean
  fr, french   - French

Examples:
  node scripts/translate-page.js th
  node scripts/translate-page.js thai http://localhost:3001
  node scripts/translate-page.js chinese http://localhost:3001/admin
  `);
  process.exit(0);
}

// Run the translation
translatePage().catch(console.error);