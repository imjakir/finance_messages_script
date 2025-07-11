import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const config = {
  baseUrl: 'https://localhost:5001',
  username: 'arun@source.one',
  screenshotDir: './screenshots',
  authDir: './auth',
  authFile: './auth/LoginAuth.json',
  headless: false,
  timeout: 30000
};

async function testSingleScreenshot() {
  console.log('🧪 Testing single screenshot...');
  
  const browser: Browser = await chromium.launch({
    headless: config.headless,
    args: ['--ignore-certificate-errors', '--ignore-ssl-errors', '--disable-web-security']
  });

  let context: BrowserContext;
  
  // Create directories
  if (!fs.existsSync(config.authDir)) {
    fs.mkdirSync(config.authDir, { recursive: true });
  }
  if (!fs.existsSync(config.screenshotDir)) {
    fs.mkdirSync(config.screenshotDir, { recursive: true });
  }

  // Check if we have stored authentication
  if (fs.existsSync(config.authFile)) {
    console.log('🔐 Using stored authentication...');
    context = await browser.newContext({
      storageState: config.authFile,
      ignoreHTTPSErrors: true
    });
  } else {
    console.log('🔐 Performing fresh login...');
    context = await browser.newContext({ ignoreHTTPSErrors: true });
    const loginPage = await context.newPage();
    
    await loginPage.goto(config.baseUrl);
    
    const inputField = loginPage.getByPlaceholder('User Email');
    await inputField.fill(config.username);
    await loginPage.getByRole('button', { name: 'Login', exact: true }).click();
    
    // Wait for successful login
    await loginPage.locator("//span[text()='Suppliers']/parent::a").waitFor({ state: 'visible' });
    
    // Store authentication
    await context.storageState({ path: config.authFile });
    console.log('✅ Login completed and stored!');
  }

  // Test screenshot with first URL
  const testUrl = 'https://localhost:5001/webchatv2/view/919614093333918299193817';
  const page = await context.newPage();
  
  // Extract last 10 digits for filename
  function extractLast10Digits(url: string): string {
    const matches = url.match(/\d/g);
    if (matches && matches.length >= 10) {
      const allDigits = matches.join('');
      return allDigits.slice(-10);
    }
    return matches ? matches.join('').padStart(10, '0') : '0000000000';
  }
  
  const last10Digits = extractLast10Digits(testUrl);
  console.log(`🔢 Extracted digits: ${last10Digits} from URL: ${testUrl}`);
  console.log(`📸 Taking test screenshot of: ${testUrl}`);
  
  try {
    await page.goto(testUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(config.screenshotDir, `test_${last10Digits}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`✅ Test screenshot saved: ${screenshotPath}`);
  } catch (error) {
    console.error(`❌ Failed to take test screenshot:`, error);
  }

  await browser.close();
  console.log('🎉 Test completed!');
}

testSingleScreenshot().catch(console.error); 