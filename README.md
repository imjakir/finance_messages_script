# Screenshot Automation with Playwright

This project automates taking screenshots of web pages that require login authentication using Playwright and TypeScript.

## Features

- 🔐 Automatic login handling
- 📸 Batch screenshot capture from CSV file
- 🛡️ SSL certificate error handling for localhost
- 📁 Organized screenshot storage
- ⚙️ Configurable settings

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

3. **Update configuration:**
   Edit the `config` object in `screenshot.ts` to match your setup:
   - `username`: Your login username (currently set to `@source.one`)
   - `loginUrl`: The login page URL
   - `headless`: Set to `true` for headless mode, `false` to see the browser

## Usage

1. **Update URLs:**
   Edit `urls.csv` with your target URLs (one per line, with header row)

2. **Run the script:**
   ```bash
   npm run screenshot
   ```

3. **Screenshots will be saved in the `./screenshots` directory**

## Configuration Options

In `screenshot.ts`, you can modify:

- `baseUrl`: Base URL of your application
- `loginUrl`: Login page URL with redirect
- `username`: Login username
- `screenshotDir`: Directory to save screenshots
- `headless`: Run in headless mode (true/false)
- `timeout`: Page timeout in milliseconds

## How it works

1. **Initialize Browser:** Launches Chromium with SSL error ignoring
2. **Login:** Navigates to login page, fills username, clicks LOGIN button
3. **Process URLs:** Reads URLs from CSV file
4. **Take Screenshots:** Navigates to each URL and captures full-page screenshot
5. **Cleanup:** Closes browser and saves all screenshots

## Troubleshooting

- **SSL Errors:** The script includes flags to ignore SSL certificate errors for localhost
- **Login Issues:** If login requires additional steps, you may need to modify the login logic
- **Timeout Issues:** Increase the `timeout` value in config if pages load slowly
- **Manual Login:** Set `headless: false` to see the browser and handle login manually if needed

## File Structure

```
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright configuration
├── screenshot.ts         # Main automation script
├── urls.csv             # URLs to screenshot
├── screenshots/         # Generated screenshots (created automatically)
└── README.md           # This file
```

## Example CSV Format

```csv
url
https://localhost:5001/webchatv2/view/919614093333918299193817
https://localhost:5001/webchatv2/view/919614093333919913992840
```

## Notes

- Screenshots are saved with timestamp to avoid conflicts
- The script waits for network idle before taking screenshots
- Full-page screenshots are captured by default
- Browser runs in non-headless mode by default for debugging 