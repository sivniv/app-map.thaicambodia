import { test, expect } from '@playwright/test';

test.describe('Next.js Error Pages and Framework Behavior', () => {
  test('should check if custom error pages exist', async ({ page }) => {
    // Test for Next.js built-in error handling
    await page.goto('/nonexistent-page');
    
    const pageContent = await page.content();
    const title = await page.title();
    
    // Check if it's Next.js default 404 or custom
    const isNextJsDefault = pageContent.includes('This page could not be found') || 
                           pageContent.includes('404') ||
                           title.includes('404');
    
    console.log('Is using Next.js default 404:', isNextJsDefault);
    console.log('Page title:', title);
    
    await page.screenshot({ path: 'test-results/nextjs-404-analysis.png', fullPage: true });
    
    // Document what type of 404 page is being used
    if (isNextJsDefault) {
      console.log('Application is using Next.js default 404 page');
    } else {
      console.log('Application appears to have custom 404 handling');
    }
  });

  test('should test for custom error boundaries', async ({ page }) => {
    // Navigate to a potentially problematic URL that might trigger error boundaries
    const problemUrls = [
      '/article/',  // Empty article ID
      '/admin/',    // Trailing slash variations
      '//double-slash',
      '/article/%',
      '/article/null',
    ];

    for (const url of problemUrls) {
      try {
        console.log('Testing problematic URL:', url);
        
        const response = await page.goto(url);
        const status = response?.status();
        
        await page.screenshot({ 
          path: `test-results/error-boundary-${url.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          fullPage: true 
        });
        
        const pageContent = await page.textContent('body');
        const hasErrorBoundary = pageContent?.includes('Something went wrong') || 
                                pageContent?.includes('Error') ||
                                pageContent?.includes('error');
        
        console.log(`URL: ${url}, Status: ${status}, Has Error Content: ${hasErrorBoundary}`);
        
      } catch (error) {
        console.log(`Error testing URL ${url}:`, error);
      }
    }
  });

  test('should test static file handling', async ({ page }) => {
    // Test non-existent static files
    const response = await page.goto('/nonexistent-image.jpg');
    
    await page.screenshot({ path: 'test-results/static-file-404.png', fullPage: true });
    
    console.log('Static file 404 status:', response?.status());
    expect(response?.status()).toBe(404);
  });

  test('should test API route error handling consistency', async ({ request, page }) => {
    // Test if API errors are consistent with page errors
    const apiResponse = await request.get('/api/nonexistent');
    const apiStatus = apiResponse.status();
    const apiBody = await apiResponse.text();
    
    console.log('API 404 status:', apiStatus);
    console.log('API 404 body:', apiBody.substring(0, 200));
    
    // Now test page 404
    await page.goto('/nonexistent-page');
    const pageContent = await page.textContent('body');
    
    // Both should handle 404s, but may differ in format
    expect(apiStatus).toBe(404);
    expect(pageContent).toBeTruthy();
  });

  test('should check for development vs production error handling', async ({ page }) => {
    // This test helps identify if we're in development mode
    await page.goto('/nonexistent-page');
    
    const pageContent = await page.content();
    const isDevelopment = pageContent.includes('Development') || 
                         pageContent.includes('webpack') ||
                         pageContent.includes('Hot Reload') ||
                         process.env.NODE_ENV === 'development';
    
    console.log('Running in development mode:', isDevelopment);
    
    if (isDevelopment) {
      console.log('Note: Error pages may differ in production');
    }
    
    await page.screenshot({ path: 'test-results/environment-detection.png', fullPage: true });
  });

  test('should test server error simulation', async ({ page }) => {
    // Try to trigger server errors through various means
    const serverErrorTests = [
      '/api/articles?invalid=query&param=' + 'x'.repeat(10000), // Very long query
      '/api/timeline?' + 'param='.repeat(100), // Many parameters
    ];

    for (const url of serverErrorTests) {
      try {
        const response = await page.goto(url);
        const status = response?.status();
        
        console.log(`Server error test URL: ${url.substring(0, 100)}...`);
        console.log('Status:', status);
        
        if (status && status >= 500) {
          await page.screenshot({ 
            path: `test-results/server-error-${Date.now()}.png`,
            fullPage: true 
          });
          
          const pageContent = await page.textContent('body');
          console.log('Server error content:', pageContent?.substring(0, 300));
        }
      } catch (error) {
        console.log('Server error test failed:', error);
      }
    }
  });

  test('should analyze error page styling and accessibility', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Check if error page has proper styling
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
      };
    });
    
    console.log('Error page styling:', bodyStyles);
    
    // Check for accessibility features
    const hasHeadings = await page.locator('h1, h2, h3').count();
    const hasLandmarks = await page.locator('main, header, footer, nav').count();
    const hasAriaLabels = await page.locator('[aria-label]').count();
    
    console.log('Error page accessibility - Headings:', hasHeadings, 'Landmarks:', hasLandmarks, 'ARIA labels:', hasAriaLabels);
    
    await page.screenshot({ path: 'test-results/error-page-accessibility.png', fullPage: true });
  });
});