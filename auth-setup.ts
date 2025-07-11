import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  const authFile = './auth/LoginAuth.json';
  const authDir = './auth';
  
  // Create auth directory
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Skip if auth file already exists and is recent (less than 1 hour old)
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (stats.mtime > oneHourAgo) {
      console.log('🔐 Using existing valid authentication...');
      return;
    }
  }

  console.log('🔐 Setting up fresh authentication...');
  
  const browser = await chromium.launch({
    headless: false, // Show browser for login
    args: ['--ignore-certificate-errors', '--ignore-ssl-errors', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://localhost:5001', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Fill login form
    const inputField = page.getByPlaceholder('User Email');
    await inputField.fill('arun@source.one');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    
    // Wait for successful login
    await page.locator("//span[text()='Suppliers']/parent::a").waitFor({ 
      state: 'visible',
      timeout: 30000 
    });
    
    // Store authentication state
    await context.storageState({ path: authFile });
    console.log('✅ Authentication setup completed and saved!');
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 