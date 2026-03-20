const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('localhost:5173'));
    
    if (!page) {
      console.log("Could not find localhost:5173 page");
      process.exit(1);
    }
    
    const oRect = await page.evaluate(() => {
        // Find the "O" path in the hero headline SVG
        const svg = document.querySelector('.hero-headline svg');
        if (!svg) return null;
        
        // Let's just get the bounding rect of the whole SVG first since
        // the mask is relative to the SVG container. 
        // The O is at roughly x: 1006.352, y: 51.251 in SVG viewBox 0 0 1920 102.502
        return svg.getBoundingClientRect();
    });
    
    console.log("SVG Rect:", oRect);
    
    await browser.disconnect();
  } catch (err) {
    console.error("Puppeteer error:", err.message);
  }
})();
