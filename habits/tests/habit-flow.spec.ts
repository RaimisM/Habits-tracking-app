import { test, expect } from '@playwright/test';

// Test 1: Adding a new habit
test('should add a new habit', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/day/2025-04-23');
  const initialHabits = await page.locator('.habit-item').count();
  await page.getByRole('button', { name: '+ Add Habit' }).click();
  await page.getByRole('textbox', { name: 'Enter habit name' }).fill('Read a book');
  await page.getByRole('button', { name: 'Save' }).click();
  
  const newHabitCount = await page.locator('.habit-item').count();
  expect(newHabitCount).toBe(initialHabits + 1);
  await expect(page.getByText('Read a book')).toBeVisible();
});

// Test 2: Marking a habit as done
test('should mark a habit as done', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/day/2025-04-23');
  await page.getByRole('button', { name: '+ Add Habit' }).click();
  await page.getByRole('textbox', { name: 'Enter habit name' }).fill('Read a book');
  await page.getByRole('button', { name: 'Save' }).click();
  
  const checkbox = page.getByRole('checkbox').first();
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  
  await page.waitForTimeout(500);
  await expect(checkbox).toBeChecked();
});

// Test 3: Navigating between days
test('should navigate to previous and next day', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/day/2025-04-23');
  const initialUrl = page.url();
  await page.getByRole('button', { name: '← Previous' }).click();
  await page.waitForTimeout(500);
  const previousUrl = page.url();
  expect(previousUrl).not.toEqual(initialUrl);
  expect(previousUrl).toContain('day/2025-04-22');
  
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.waitForTimeout(500);
  const newUrl = page.url();
  expect(newUrl).toEqual(initialUrl);
  expect(newUrl).toContain('day/2025-04-23');
});

// Test 4: Stopping a habit
test('should stop tracking a habit', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/day/2025-04-23');
  await page.getByRole('button', { name: '+ Add Habit' }).click();
  await page.getByRole('textbox', { name: 'Enter habit name' }).fill('Read a book');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Read a book')).toBeVisible();
  
  const initialHabits = await page.locator('.habit-item').count();
  await page.getByRole('button', { name: 'Edit Icon' }).first().click();
  await page.getByRole('button', { name: 'Stop' }).click();
  await page.waitForTimeout(1000);
  
  const habitExists = await page.getByText('Read a book').isVisible();
  if (!habitExists) {
    const currentHabits = await page.locator('.habit-item').count();
    expect(currentHabits).toBeLessThan(initialHabits);
  }
  else {
    const stoppedLabel = await page.getByText('Stopped').isVisible();
    expect(stoppedLabel).toBeTruthy();
  }
});