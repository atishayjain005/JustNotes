const { test, expect } = require('@playwright/test');
test('legacy notes render as text and additions survive reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('notes', JSON.stringify(['<img src=x onerror=alert(1)>'])));
  await page.reload();
  await expect(page.locator('.card-text')).toHaveText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#notes img')).toHaveCount(0);
  await page.locator('#addTxt').fill('Second note');
  await page.locator('#addBtn').click();
  await page.reload();
  await expect(page.locator('.noteCard')).toHaveCount(2);
});
test('malformed storage is preserved and blank notes are rejected', async ({ page }) => {
  await page.goto('/');
  await page.locator('#addBtn').click();
  await expect(page.locator('.noteCard')).toHaveCount(0);
  await page.evaluate(() => localStorage.setItem('notes', 'broken'));
  await page.reload();
  await expect(page.getByRole('status')).toContainText('could not be read');
  await page.locator('#addTxt').fill('Keep this draft');
  await page.locator('#addBtn').click();
  await expect(page.locator('#addTxt')).toHaveValue('Keep this draft');
  expect(await page.evaluate(() => localStorage.getItem('notes'))).toBe('broken');
});
