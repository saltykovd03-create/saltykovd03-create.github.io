import asyncio
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1200,'height':630}, device_scale_factor=1)
        await pg.goto('http://127.0.0.1:8031/', wait_until='networkidle'); await pg.wait_for_timeout(4500)
        await pg.screenshot(path='og.png'); await b.close()
asyncio.run(run())
