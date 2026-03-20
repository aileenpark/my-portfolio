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
    
    // Override console.log to capture GSAP logs
    await page.evaluate(() => {
      window.capturedLogs = [];
      const origLog = console.log;
      console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[ScrollTrigger] progress')) {
          window.capturedLogs.push(args.join(' '));
        }
        origLog.apply(console, args);
      };
    });
    
    console.log("Scrolling to bottom...");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Get logs and styles
    const data = await page.evaluate(() => {
      const works = document.querySelector('#works-section');
      const heroWrapper = document.querySelector('.hero-wrapper');
      
      const res = {
        logs: window.capturedLogs.slice(-5), // Last 5 logs
        worksStyles: works ? works.getAttribute('style') : null,
        worksComputedZ: works ? window.getComputedStyle(works).zIndex : null,
        heroZ: heroWrapper ? window.getComputedStyle(heroWrapper).zIndex : null,
        heroPosition: heroWrapper ? window.getComputedStyle(heroWrapper).position : null,
        worksPosition: works ? window.getComputedStyle(works).position : null,
      };
      return res;
    });
    
    console.log(JSON.stringify(data, null, 2));
    await browser.disconnect();
  } catch (err) {
    console.error("Puppeteer error:", err.message);
  }
})();
