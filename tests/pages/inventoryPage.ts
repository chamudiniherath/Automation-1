// tests/pages/inventoryPage.ts
import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }

  async addItem(index: number) {
    await this.page.locator('.inventory_item').nth(index).locator('button').click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }
}
