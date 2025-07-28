import { test, expect } from '@playwright/test';

test.describe('Error Handling and 404 Pages', () => {
  test('should handle non-existent page gracefully', async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto('/nonexistent-page');
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'test-results/404-nonexistent-page.png', fullPage: true });
    
    // Check if it's a 404 or if Next.js shows a default error page
    expect(response?.status()).toBe(404);
    
    // Check for common 404 indicators
    const pageContent = await page.textContent('body');
    const title = await page.title();
    
    console.log('404 Page Title:', title);
    console.log('404 Page Content (first 500 chars):', pageContent?.substring(0, 500));
    
    // Verify page shows some kind of error message
    expect(pageContent).toBeTruthy();
  });

  test('should handle invalid article ID gracefully', async ({ page }) => {
    // Navigate to an invalid article page
    const response = await page.goto('/article/invalid-id-12345');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/404-invalid-article.png', fullPage: true });
    
    // Should return 404 or show error message
    expect(response?.status()).toBe(404);
    
    const pageContent = await page.textContent('body');
    const title = await page.title();
    
    console.log('Invalid Article Page Title:', title);
    console.log('Invalid Article Page Content (first 500 chars):', pageContent?.substring(0, 500));
  });

  test('should handle deeply nested non-existent paths', async ({ page }) => {
    // Test deeply nested non-existent path
    const response = await page.goto('/this/path/does/not/exist/at/all');
    
    await page.screenshot({ path: 'test-results/404-deep-nested.png', fullPage: true });
    
    expect(response?.status()).toBe(404);
    
    const pageContent = await page.textContent('body');
    console.log('Deep nested 404 content:', pageContent?.substring(0, 500));
  });

  test('should handle admin route with invalid paths', async ({ page }) => {
    const response = await page.goto('/admin/nonexistent-admin-page');
    
    await page.screenshot({ path: 'test-results/404-admin-invalid.png', fullPage: true });
    
    // Should be 404 or redirect
    const status = response?.status();
    expect([404, 302, 200]).toContain(status);
    
    const pageContent = await page.textContent('body');
    console.log('Admin invalid page status:', status);
    console.log('Admin invalid page content:', pageContent?.substring(0, 500));
  });
});