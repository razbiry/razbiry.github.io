import express from "express";
import { chromium } from "playwright";

const app = express();

// Endpoint: /scrape?url=TARGET_URL
app.get("/scrape", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required on Render free tier
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const html = await page.content();
    await browser.close();
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error scraping page");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
