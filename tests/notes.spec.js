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
test('edits save explicitly and cancel leaves stored text unchanged', async ({ page }) => {
  await page.goto('/');
  await page.locator('#addTxt').fill('Original');
  await page.locator('#addBtn').click();
  await page.getByRole('button', { name: 'Edit note 1', exact: true }).click();
  await page.getByRole('textbox', { name: 'Edit text for note 1' }).fill('Saved edit');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.reload();
  await expect(page.locator('.card-text')).toHaveText('Saved edit');
  await page.getByRole('button', { name: 'Edit note 1', exact: true }).click();
  await page.getByRole('textbox', { name: 'Edit text for note 1' }).fill('Discard');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.card-text')).toHaveText('Saved edit');
});
