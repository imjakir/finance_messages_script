import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
const { randomUUID } = require('crypto');

const config = {
  baseUrl: 'https://localhost:5001',
  username: 'arun@source.one',
  screenshotDir: './screenshots',
  authDir: './auth',
  authFile: './auth/LoginAuth.json',
  headless: false,
  timeout: 30000
};

// Test URL for order 4943 with the specific messageId you mentioned
const testUrls = [
  {
    "url": "https://localhost:5001/webchatv2/view/919614093333919824744899?messageId=01c83236-146b-4f8e-a5ab-47066cb98321",
    "Order_Number": "4943"
  },
  {
    "url": "https://localhost:5001/webchatv2/view/919614093333919824744899?messageId=19bdc721-74f6-41fc-bea3-9bd61d5ac676",
    "Order_Number": "4943"
  },
  {
    "url": "https://localhost:5001/webchatv2/view/919614093333919426646095?messageId=39d52655-e4ac-40db-b245-3a4b5bfcca70",
    "Order_Number": "4943"
  }
];

async function takeScreenshotWithDynamicWait(page: Page, url: string, filename: string): Promise<void> {
  console.log(`📸 Taking screenshot of: ${url}`);
  
  try {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    // Extract messageId from URL
    const urlParams = new URL(url);
    const messageId = urlParams.searchParams.get('messageId');
    
    if (messageId) {
      console.log(`🔍 Waiting for element with ID: ${messageId}`);
      
      // Wait for the specific element with the messageId to be visible
      try {
        // Try different possible selectors for the element
        const possibleSelectors = [
          `div[id="${messageId}"]`,
          `#${messageId}`,
          `[id="${messageId}"]`,
          `div[data-message-id="${messageId}"]`,
          `[data-message-id="${messageId}"]`,
          `div[data-id="${messageId}"]`,
          `[data-id="${messageId}"]`
        ];
        
        let elementFound = false;
        
        for (const selector of possibleSelectors) {
          try {
            console.log(`   🔎 Trying selector: ${selector}`);
            await page.waitForSelector(selector, { 
              state: 'visible', 
              timeout: 5000 // 5 seconds per selector
            });
            console.log(`   ✅ Element found with selector: ${selector}`);
            elementFound = true;
            break;
          } catch (selectorError) {
            console.log(`   ❌ Selector ${selector} not found`);
            // Continue to next selector
            continue;
          }
        }
        
        if (!elementFound) {
          console.warn(`⚠️ Element with messageId ${messageId} not found with any selector, proceeding with screenshot`);
          
          // Let's try to see what elements are actually on the page
          console.log(`🔍 Checking for any div elements with IDs...`);
          const divElements = await page.$$eval('div[id]', elements => 
            elements.map(el => el.id).slice(0, 10) // Get first 10 IDs
          );
          console.log(`Found div IDs: ${divElements.join(', ')}`);
        } else {
          // Additional wait for content to fully render
          console.log(`⏳ Waiting additional 3 seconds for content to render...`);
          await page.waitForTimeout(3000);
        }
        
      } catch (elementError) {
        console.warn(`⚠️ Error waiting for element with ID ${messageId}:`, elementError);
        // Continue with screenshot even if specific element isn't found
      }
    } else {
      console.warn(`⚠️ No messageId found in URL: ${url}`);
    }
    
    // Wait a bit more for any dynamic content to load
    console.log(`⏳ Final wait for dynamic content...`);
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(config.screenshotDir, filename);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
  } catch (error) {
    console.error(`❌ Failed to take screenshot of ${url}:`, error);
  }
}

async function testOrder4943Screenshots() {
  console.log('🧪 Testing screenshots for Order 4943...');
  
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
      ignoreHTTPSErrors: true,
      viewport: { width: 1920, height: 1080 }
    });
  } else {
    console.log('🔐 Performing fresh login...');
    context = await browser.newContext({ 
      ignoreHTTPSErrors: true,
      viewport: { width: 1920, height: 1080 }
    });
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
    await loginPage.close();
  }

  const page = await context.newPage();
  page.setDefaultTimeout(config.timeout);

  console.log(`📋 Processing ${testUrls.length} URLs for Order 4943...`);
  
  for (let i = 0; i < testUrls.length; i++) {
    const urlData = testUrls[i];
    const filename = `4943/test_${i + 1}_${randomUUID()}.png`;
    
    console.log(`\n🔢 Processing ${i + 1}/${testUrls.length}: Order ${urlData.Order_Number}`);
    console.log(`🔗 URL: ${urlData.url}`);
    
    // Extract messageId for logging
    const urlParams = new URL(urlData.url);
    const messageId = urlParams.searchParams.get('messageId');
    console.log(`🆔 MessageId: ${messageId}`);
    
    await takeScreenshotWithDynamicWait(page, urlData.url, filename);
    
    // Small delay between screenshots
    if (i < testUrls.length - 1) {
      console.log(`⏳ Waiting 2 seconds before next screenshot...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  await browser.close();
  console.log('🎉 Order 4943 test completed!');
}

testOrder4943Screenshots().catch(console.error); 