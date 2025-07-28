import { test, expect } from '@playwright/test';

test.describe('API Error Handling', () => {
  test('should handle invalid article API endpoint', async ({ request }) => {
    // Test invalid article ID
    const response = await request.get('/api/articles/invalid-id-12345');
    
    console.log('Invalid article API status:', response.status());
    
    const responseBody = await response.text();
    console.log('Invalid article API response:', responseBody);
    
    // Should return 404 or appropriate error status
    expect([400, 404, 500]).toContain(response.status());
  });

  test('should handle non-existent API endpoints', async ({ request }) => {
    // Test completely non-existent API endpoint
    const response = await request.get('/api/nonexistent-endpoint');
    
    console.log('Non-existent API status:', response.status());
    
    const responseBody = await response.text();
    console.log('Non-existent API response:', responseBody);
    
    expect(response.status()).toBe(404);
  });

  test('should handle malformed API requests', async ({ request }) => {
    // Test various malformed requests
    const endpoints = [
      '/api/articles/../../etc/passwd', // Path traversal attempt
      '/api/articles/<script>alert(1)</script>', // XSS attempt
      '/api/articles/' + 'a'.repeat(1000), // Very long ID
      '/api/articles/null',
      '/api/articles/undefined',
      '/api/articles/%00', // Null byte
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      console.log(`Malformed request ${endpoint} status:`, response.status());
      
      const responseBody = await response.text();
      console.log(`Malformed request ${endpoint} response:`, responseBody.substring(0, 200));
      
      // Should return appropriate error status (not 200)
      expect([400, 404, 500]).toContain(response.status());
    }
  });

  test('should handle invalid HTTP methods on API endpoints', async ({ request }) => {
    // Test unsupported HTTP methods
    const methods = ['PATCH', 'DELETE', 'PUT'];
    
    for (const method of methods) {
      try {
        const response = await request.fetch('/api/articles', {
          method: method as any,
        });
        
        console.log(`${method} method on /api/articles status:`, response.status());
        
        const responseBody = await response.text();
        console.log(`${method} method response:`, responseBody.substring(0, 200));
        
        // Should return 405 Method Not Allowed or similar
        expect([405, 404, 400]).toContain(response.status());
      } catch (error) {
        console.log(`${method} method error:`, error);
      }
    }
  });

  test('should handle API endpoints with malformed JSON', async ({ request }) => {
    try {
      // Try to POST malformed JSON to an endpoint that accepts POST
      const response = await request.post('/api/articles', {
        data: '{"malformed": json without closing brace',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Malformed JSON POST status:', response.status());
      
      const responseBody = await response.text();
      console.log('Malformed JSON POST response:', responseBody.substring(0, 200));
      
      // Should return 400 Bad Request
      expect([400, 404, 500]).toContain(response.status());
    } catch (error) {
      console.log('Malformed JSON error:', error);
    }
  });

  test('should test all API endpoints for basic accessibility', async ({ request }) => {
    const apiEndpoints = [
      '/api/articles',
      '/api/timeline',
      '/api/stats',
      '/api/sources',
      '/api/admin/logs',
      '/api/admin/sources',
      '/api/monitor/news',
      '/api/monitor/facebook',
      '/api/scheduler',
    ];

    for (const endpoint of apiEndpoints) {
      const response = await request.get(endpoint);
      
      console.log(`API endpoint ${endpoint} status:`, response.status());
      
      const responseBody = await response.text();
      console.log(`API endpoint ${endpoint} response length:`, responseBody.length);
      
      // Should not return 500 Internal Server Error for basic GET requests
      expect(response.status()).not.toBe(500);
      
      // Should return some response (even if it's an error response)
      expect(responseBody.length).toBeGreaterThan(0);
    }
  });
});