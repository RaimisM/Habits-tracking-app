import { test, expect } from '@playwright/test';

test('Add a new habit and check it appears in the list', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: /Add Habit/i }).click();
  await page.getByPlaceholder('Habit name').fill('Drink water');
  await page.getByRole('button', { name: /Save/i }).click();

  await expect(page.getByText('Drink water')).toBeVisible();
});

test('User can mark a habit as done', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const habit = await page.getByText('Drink water');
  await habit.locator('..').getByRole('checkbox').check();

  await expect(habit.locator('..').getByRole('checkbox')).toBeChecked();
});

test('User can navigate between days', async ({ page }) => {
  await page.goto('http://localhost:5173/day/2025-04-20');
  await page.getByRole('button', { name: /Previous/i }).click();
  await expect(page.getByText('2025-04-19')).toBeVisible();
  await page.getByRole('button', { name: /Next/i }).click();
  await expect(page.getByText('2025-04-20')).toBeVisible();
  await page.getByRole('button', { name: /Next/i }).click();
  await expect(page.getByText('2025-04-21')).toBeVisible();
  await page.getByRole('button', { name: /Next/i }).click();
  await expect(page.getByText('2025-04-22')).toBeVisible();
});