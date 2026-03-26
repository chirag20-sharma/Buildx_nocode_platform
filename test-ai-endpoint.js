// Test AI Endpoint - Run after starting backend server
// Usage: node test-ai-endpoint.js

const testAI = async () => {
  try {
    // First login to get token
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: 'chirag@test.com',
        password: '123456'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('Login:', loginData.success ? '✅ Success' : '❌ Failed');
    
    if (!loginData.success) {
      console.log('Please signup first or check credentials');
      return;
    }
    
    const token = loginData.payload.token;
    
    // Test AI generation
    const aiRes = await fetch('http://localhost:5000/api/v1/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        prompt: 'Create a hero section with button and image',
        websiteType: 'Landing Page'
      })
    });
    
    const aiData = await aiRes.json();
    console.log('AI Generation:', aiData.success ? '✅ Success' : '❌ Failed');
    
    if (aiData.success) {
      console.log(`Generated ${aiData.payload.components.length} components:`);
      aiData.payload.components.forEach(comp => {
        console.log(`  - ${comp.type}: ${comp.properties.text || comp.properties.content || 'component'}`);
      });
      console.log(`Suggestion: ${aiData.payload.suggestion}`);
    } else {
      console.log('Error:', aiData.message);
    }
    
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('Make sure backend server is running on http://localhost:5000');
  }
};

testAI();