// write a playwright test to login to a website

import { test, expect } from '@playwright/test';

test('Login to website', async ({ page }: { page: any }) => {
  await page.goto('https://www.saucedemo.com/');

  // Enter username and password
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  
  // Click the login button
  await page.click('#login-button');

  // Wait for inventory list to load
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Add first item to cart
  await page.locator('.inventory_item').nth(0).locator('button').filter({ hasText: /add to cart/i }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Add second item to cart
  await page.locator('.inventory_item').nth(1).locator('button').filter({ hasText: /add to cart/i }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Add third item to cart
  await page.locator('.inventory_item').nth(2).locator('button').filter({ hasText: /add to cart/i }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

  // Verify shopping cart works
  await page.locator('a.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(3);

  // Keep browser open to inspect cart
  await page.pause();
});
