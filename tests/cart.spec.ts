// tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { InventoryPage } from './pages/inventoryPage';

test('add items and verify cart', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.navigate();
  await login.login('standard_user', 'secret_sauce');

  await inventory.expectLoaded();
  await inventory.addItem(0);
  await inventory.addItem(1);
  await inventory.openCart();

  await expect(page.locator('.cart_item')).toHaveCount(2);
});
