// write a playwright test to login to a website

import { test, expect } from '@playwright/test';

test('Login to website', async ({ page }: { page: any }) => {
  await page.goto('https://www.saucedemo.com/');

  // Enter username and password
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  
  // Click the login button
  await page.click('#login-button');

  // Add first item to cart
  const firstItem = page.locator('.inventory_list .inventory_item').first();
  await firstItem.locator('button').click();

  // Verify cart shows 1 item
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Pause here to inspect the cart (remove for CI runs)
  await page.pause();

  // Verify that the user is logged in by checking for a specific element on the homepage
  await expect(page.locator('.inventory_list')).toBeVisible();
});
