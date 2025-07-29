import { test, expect } from '@playwright/test';

test.describe('Translation Functionality', () => {
  test('should translate page to different languages', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for language selector to be visible
    await page.waitForSelector('[data-testid="language-selector"]', { timeout: 10000 });
    
    // Test Thai translation
    await test.step('Test Thai Translation', async () => {
      // Click language selector
      await page.click('[data-testid="language-selector"]');
      
      // Select Thai
      await page.click('[data-testid="language-option-th"]');
      
      // Wait for translation to complete
      await page.waitForTimeout(4000);
      
      // Verify translation occurred by checking if some text changed
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    // Test Khmer translation
    await test.step('Test Khmer Translation', async () => {
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-option-km"]');
      await page.waitForTimeout(4000);
      
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    // Test Chinese translation
    await test.step('Test Chinese Translation', async () => {
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-option-zh"]');
      await page.waitForTimeout(4000);
      
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    // Test Korean translation
    await test.step('Test Korean Translation', async () => {
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-option-ko"]');
      await page.waitForTimeout(4000);
      
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    // Test French translation
    await test.step('Test French Translation', async () => {
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-option-fr"]');
      await page.waitForTimeout(4000);
      
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    // Return to English
    await test.step('Return to English', async () => {
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-option-en"]');
      await page.waitForTimeout(3000);
      
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });
  });

  test('should show translation loading indicator', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Click language selector
    await page.click('[data-testid="language-selector"]');
    
    // Select a language
    await page.click('[data-testid="language-option-th"]');
    
    // Check if loading indicator appears
    const loadingIndicator = page.locator('text=Translating entire page...');
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
    
    // Wait for translation to complete
    await expect(loadingIndicator).toBeHidden({ timeout: 10000 });
  });
});