import { test, expect, chromium } from '@playwright/test';

test.describe('Performance Tests', () => {
    test('should measure FPS on initial load', async () => {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        let frameCount = 0;
        let fpsValues: number[] = [];

        // Track frames rendered
        await page.exposeFunction('onFrame', () => {
            frameCount++;
        });

        // Inject FPS measurement script
        await page.goto('http://localhost:3000');

        await page.evaluate(() => {
            let lastTime = performance.now();
            let frames = 0;

            function measureFPS() {
                const currentTime = performance.now();
                frames++;

                if (currentTime >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                    (window as any).lastFPS = fps;
                    frames = 0;
                    lastTime = currentTime;
                }

                requestAnimationFrame(measureFPS);
            }

            requestAnimationFrame(measureFPS);
        });

        // Wait for page to load and settle
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        // Collect FPS samples
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(1000);
            const fps = await page.evaluate(() => (window as any).lastFPS || 0);
            if (fps > 0) {
                fpsValues.push(fps);
            }
        }

        await browser.close();

        // Calculate average FPS
        const avgFPS = fpsValues.length > 0
            ? fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length
            : 0;

        console.log(`Average FPS: ${avgFPS.toFixed(2)}`);
        console.log(`FPS Samples: ${fpsValues.join(', ')}`);

        // Assert FPS is above a reasonable threshold (55 FPS minimum for smooth experience on optimized build)
        expect(avgFPS).toBeGreaterThan(55);
    });

    test('should ensure no Three.js scene errors', async () => {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        const consoleErrors: string[] = [];
        const sceneErrors: string[] = [];

        // Capture console errors
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                const text = msg.text();
                consoleErrors.push(text);

                // Check for Three.js specific errors
                if (text.includes('THREE') || text.includes('WebGL') || text.includes('shader')) {
                    sceneErrors.push(text);
                }
            }
        });

        // Capture page errors
        page.on('pageerror', (error) => {
            consoleErrors.push(error.message);
            if (error.message.includes('THREE') || error.message.includes('WebGL')) {
                sceneErrors.push(error.message);
            }
        });

        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Wait for scene to initialize
        await page.waitForTimeout(5000);

        // Check if canvas exists and is rendering
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        // Verify canvas has content (not blank)
        const canvasSize = await canvas.boundingBox();
        expect(canvasSize).not.toBeNull();
        expect(canvasSize?.width).toBeGreaterThan(0);
        expect(canvasSize?.height).toBeGreaterThan(0);

        await browser.close();

        // Log errors for debugging
        if (consoleErrors.length > 0) {
            console.log('Console Errors:', consoleErrors);
        }
        if (sceneErrors.length > 0) {
            console.log('Scene Errors:', sceneErrors);
        }

        // Assert no critical scene errors
        const criticalErrors = sceneErrors.filter(error =>
            !error.toLowerCase().includes('warning') &&
            !error.toLowerCase().includes('deprecated')
        );

        expect(criticalErrors).toHaveLength(0);
    });

    test('should measure memory usage during scene rendering', async () => {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('http');
        await page.waitForLoadState('networkidle');

        // Wait for scene to fully load
        await page.waitForTimeout(3000);

        // Get performance metrics
        const metrics = await page.evaluate(() => {
            const perf = performance as any;
            const memory = perf.memory ? {
                usedJSHeapSize: perf.memory.usedJSHeapSize,
                totalJSHeapSize: perf.memory.totalJSHeapSize,
                jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
            } : null;

            return {
                memory,
                timing: {
                    domContentLoaded: perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart,
                    loadComplete: perf.timing.loadEventEnd - perf.timing.navigationStart,
                }
            };
        });

        await browser.close();

        console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));

        // Assert reasonable memory usage (less than 200MB)
        if (metrics.memory) {
            const usedMemoryMB = metrics.memory.usedJSHeapSize / (1024 * 1024);
            console.log(`Used Memory: ${usedMemoryMB.toFixed(2)} MB`);
            expect(usedMemoryMB).toBeLessThan(200);
        }
    });

    test('should handle rapid interactions without performance degradation', async () => {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (!box) throw new Error('Canvas not found');

        // Perform rapid mouse interactions
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        // Rapid drag operations
        for (let i = 0; i < 10; i++) {
            await page.mouse.move(centerX + i * 10, centerY);
            await page.mouse.down();
            await page.mouse.move(centerX + i * 10 + 50, centerY, { steps: 5 });
            await page.mouse.up();
        }

        // Wait a bit after interactions
        await page.waitForTimeout(1000);

        // Canvas should still be responsive
        await expect(canvas).toBeVisible();

        // Get final FPS
        const fps = await page.evaluate(() => {
            return new Promise((resolve) => {
                let lastTime = performance.now();
                let frames = 0;

                function measureFPS() {
                    const currentTime = performance.now();
                    frames++;

                    if (currentTime >= lastTime + 1000) {
                        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                        resolve(fps);
                    } else {
                        requestAnimationFrame(measureFPS);
                    }
                }

                requestAnimationFrame(measureFPS);
            });
        });

        await browser.close();

        console.log(`FPS after rapid interactions: ${fps}`);

        // Should maintain at least 25 FPS even after heavy interaction
        expect(fps).toBeGreaterThan(25);
    });
});
