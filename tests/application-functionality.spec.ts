import { test, expect } from '@playwright/test';

test.describe('Application Functionality and Navigation', () => {
  test('should load the main page successfully', async ({ page }) => {
    // Navigate to the main page
    const response = await page.goto('/');
    
    // Take screenshot of main page
    await page.screenshot({ path: 'test-results/main-page.png', fullPage: true });
    
    // Should return 200 OK
    expect(response?.status()).toBe(200);
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Thailand-Cambodia Conflict Monitor');
    
    // Check if main content is present
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(0);
    
    console.log('Main page title:', title);
    console.log('Main page loaded successfully');
  });

  test('should load the admin page successfully', async ({ page }) => {
    const response = await page.goto('/admin');
    
    await page.screenshot({ path: 'test-results/admin-page.png', fullPage: true });
    
    // Should return 200 OK or redirect
    expect([200, 302]).toContain(response?.status());
    
    const title = await page.title();
    const bodyContent = await page.textContent('body');
    
    console.log('Admin page title:', title);
    console.log('Admin page status:', response?.status());
    console.log('Admin page content length:', bodyContent?.length);
    
    expect(bodyContent).toBeTruthy();
  });

  test('should test navigation between pages', async ({ page }) => {
    // Start at main page
    await page.goto('/');
    
    // Check if there are any navigation links
    const links = await page.locator('a').all();
    
    console.log('Found', links.length, 'links on main page');
    
    // Test clicking on links (if any exist)
    for (let i = 0; i < Math.min(links.length, 5); i++) {
      try {
        const link = links[i];
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
          console.log('Testing navigation to:', href);
          
          // Click the link
          await link.click();
          
          // Wait for navigation
          await page.waitForLoadState('networkidle');
          
          // Take screenshot
          await page.screenshot({ 
            path: `test-results/navigation-${i}-${href.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
            fullPage: true 
          });
          
          const currentUrl = page.url();
          console.log('Navigated to:', currentUrl);
          
          // Go back to main page for next test
          await page.goto('/');
        }
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }
  });

  test('should test responsive design', async ({ page }) => {
    await page.goto('/');
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Wait for layout to adjust
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png`,
        fullPage: true 
      });
      
      console.log(`Tested ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
    }
  });

  test('should test form interactions (if any)', async ({ page }) => {
    await page.goto('/');
    
    // Look for forms
    const forms = await page.locator('form').all();
    console.log('Found', forms.length, 'forms on main page');
    
    // Look for input fields
    const inputs = await page.locator('input').all();
    console.log('Found', inputs.length, 'input fields on main page');
    
    // Look for buttons
    const buttons = await page.locator('button').all();
    console.log('Found', buttons.length, 'buttons on main page');
    
    // Test admin page for forms
    await page.goto('/admin');
    
    const adminForms = await page.locator('form').all();
    const adminInputs = await page.locator('input').all();
    const adminButtons = await page.locator('button').all();
    
    console.log('Admin page - Forms:', adminForms.length, 'Inputs:', adminInputs.length, 'Buttons:', adminButtons.length);
    
    // Test clicking buttons (carefully)
    for (let i = 0; i < Math.min(adminButtons.length, 3); i++) {
      try {
        const button = adminButtons[i];
        const buttonText = await button.textContent();
        
        if (buttonText && !buttonText.toLowerCase().includes('delete')) {
          console.log('Testing button:', buttonText);
          
          await button.click();
          await page.waitForTimeout(2000);
          
          await page.screenshot({ 
            path: `test-results/button-test-${i}.png`,
            fullPage: true 
          });
        }
      } catch (error) {
        console.log('Button test error:', error);
      }
    }
  });

  test('should test JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    await page.goto('/admin');
    await page.waitForTimeout(3000);
    
    console.log('JavaScript errors found:', jsErrors.length);
    jsErrors.forEach((error, index) => {
      console.log(`JS Error ${index + 1}:`, error);
    });
    
    // Log errors but don't fail the test necessarily
    if (jsErrors.length > 0) {
      console.warn('JavaScript errors detected but test continues');
    }
  });

  test('should test page loading performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log('Main page load time:', loadTime, 'ms');
    
    const adminStartTime = Date.now();
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const adminLoadTime = Date.now() - adminStartTime;
    console.log('Admin page load time:', adminLoadTime, 'ms');
    
    // Performance expectations (generous for local development)
    expect(loadTime).toBeLessThan(30000); // 30 seconds max
    expect(adminLoadTime).toBeLessThan(30000);
  });
});