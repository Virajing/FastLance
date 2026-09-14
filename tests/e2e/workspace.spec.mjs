import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';

test('register, onboard, publish, switch identity-preserving roles, propose, contract, and exchange persistent messages in two sessions', async ({ browser }) => {
  const workerContext = await browser.newContext(), clientContext = await browser.newContext();
  const worker = await workerContext.newPage(), client = await clientContext.newPage();
  const failures = [];
  for (const page of [worker, client]) page.on('pageerror', error => failures.push(error.message));
  const password = crypto.randomBytes(18).toString('base64url');
  async function register(page, name, freelancer = false) {
    await page.goto('/register');
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Email', { exact: true }).fill(crypto.randomUUID() + '@example.test');
    await page.getByLabel('Password', { exact: true }).fill(password);
    if (freelancer) await page.getByLabel('I want to').selectOption('freelancer');
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    await expect(page).toHaveURL(freelancer ? /onboarding/ : /dashboard$/);
  }
  try {
    await worker.goto('/dashboard/services');
    await expect(worker).toHaveURL(/login/);
    await register(worker, 'Browser Freelancer', true);
    await worker.getByLabel('Professional title').fill('React developer');
    await worker.getByLabel('Professional bio').fill('I build accessible websites and maintainable applications for clients.');
    await worker.getByLabel('Skills, separated by commas').fill('React, JavaScript');
    await worker.getByLabel('Web development and design', { exact: true }).check();
    await worker.getByLabel('Hourly rate (INR)').fill('125.50');
    await worker.getByRole('button', { name: 'Complete onboarding' }).click();
    await expect(worker.getByRole('heading', { name: 'Freelancer overview' })).toBeVisible();
    await worker.getByRole('link', { name: 'My services', exact: true }).click();
    await worker.getByRole('button', { name: 'Create service' }).click();
    await worker.getByLabel('Service title').fill('Browser-tested React website');
    await worker.getByLabel('Description', { exact: true }).fill('A complete accessible React website with delivery documentation.');
    await worker.getByLabel('Basic package name').fill('Website');
    await worker.getByLabel('Price (INR)').fill('125.50');
    await worker.getByLabel('Delivery days').fill('4');
    await worker.getByLabel('Publication status').selectOption('published');
    await worker.getByRole('button', { name: 'Save service' }).click();
    await expect(worker.getByText(/Browser-tested React website.*published/)).toBeVisible();
    const names = await worker.locator('nav[aria-label="Workspace"] a').allTextContents();
    for (const name of names) {
      await worker.getByRole('link', { name, exact: true }).first().click();
      await expect(worker.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(worker.getByText('This page could not be displayed')).toHaveCount(0);
      await expect(worker.getByText('Page Not Found', { exact: true })).toHaveCount(0);
    }
    await worker.getByRole('button', { name: 'Switch to client', exact: true }).click();
    await expect(worker.getByRole('heading', { name: 'Client overview' })).toBeVisible();
    await expect(worker.getByText('Browser Freelancer', { exact: true }).first()).toBeVisible();
    await worker.goto('/dashboard/services');
    await expect(worker.getByRole('alert')).toContainText('unavailable in your current workspace');
    await worker.goto('/dashboard');
    await worker.getByRole('button', { name: 'Switch to freelancer', exact: true }).click();

    await register(client, 'Browser Client');
    const clientLinks = await client.locator('nav[aria-label="Workspace"] a').allTextContents();
    for (const name of clientLinks) {
      await client.getByRole('link', { name, exact: true }).first().click();
      await expect(client.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(client.getByText('This page could not be displayed')).toHaveCount(0);
    }
    await client.goto('/dashboard');
    await client.getByRole('link', { name: 'My job posts', exact: true }).click();
    await client.getByText('Create job', { exact: true }).click();
    await client.getByLabel('Job title').fill('Build an accessible dashboard');
    await client.getByLabel('Description', { exact: true }).fill('Build an accessible dashboard with persistent application data and documentation.');
    await client.getByLabel('Budget (INR)').fill('125.50');
    await client.getByLabel('Deadline').fill(new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10));
    await client.getByLabel('Status', { exact: true }).selectOption('open');
    await client.getByRole('button', { name: 'Save job', exact: true }).click();
    await expect(client).toHaveURL(/jobs\/[a-f0-9]{24}/);
    await worker.goto(client.url());
    await worker.getByLabel('Cover letter').fill('I can build this accessible dashboard and provide complete documentation.');
    await worker.getByLabel('Proposed amount (INR)').fill('125.50');
    await worker.getByLabel('Delivery days').fill('4');
    await worker.getByRole('button', { name: 'Submit proposal' }).click();
    await worker.getByRole('link', { name: 'Proposal saved. View or edit your proposal.' }).click();
    await worker.getByText('Edit proposal', { exact: true }).click();
    await worker.getByLabel('Cover letter').fill('Updated proposal: I will provide accessible components, tests and documentation.');
    await worker.getByRole('button', { name: 'Save proposal' }).click();
    await expect(worker.getByText('Updated proposal: I will provide accessible components, tests and documentation.', { exact: true }).first()).toBeVisible();
    await client.getByRole('link', { name: 'Received proposals', exact: true }).click();
    await client.getByRole('button', { name: 'Accept proposal', exact: true }).click();
    await client.getByRole('link', { name: 'View contract' }).click();
    await worker.goto(client.url());
    await worker.getByRole('button', { name: 'Accept contract', exact: true }).click();
    await expect(worker.getByText(/awaiting payment/)).toBeVisible();
    await client.reload();
    await expect(client.getByRole('button', { name: 'Pay with Razorpay' })).toBeDisabled();
    await expect(client.getByText(/Payments not configured/)).toBeVisible();

    await client.goto('/services');
    await client.getByRole('link', { name: 'Browser-tested React website', exact: true }).click();
    await client.getByRole('button', { name: 'Save item', exact: true }).click();
    await expect(client.getByRole('button', { name: 'Remove saved item' })).toBeVisible();
    await client.reload();
    await expect(client.getByRole('button', { name: 'Remove saved item' })).toBeVisible();
    await client.getByRole('button', { name: 'Message', exact: true }).click();
    await expect(client).toHaveURL(/messages\?conversation=/);
    await client.getByLabel('Message', { exact: true }).fill('Hello from the browser client');
    await client.getByRole('button', { name: 'Send message', exact: true }).click();
    await expect(client.getByText('Hello from the browser client', { exact: true }).last()).toBeVisible();
    await worker.goto('/dashboard/messages');
    await worker.getByRole('button', { name: /Browser Client/ }).click();
    await expect(worker.getByRole('list', { name: 'Message history' })).toContainText('Hello from the browser client');
    await worker.getByLabel('Message', { exact: true }).fill('Hello from the browser freelancer');
    await worker.getByRole('button', { name: 'Send message', exact: true }).click();
    await expect(client.getByRole('list', { name: 'Message history' })).toContainText('Hello from the browser freelancer');
    await worker.reload(); await client.reload();
    for (const page of [worker, client]) {
      await expect(page.getByRole('list', { name: 'Message history' })).toContainText('Hello from the browser client');
      await expect(page.getByRole('list', { name: 'Message history' })).toContainText('Hello from the browser freelancer');
      await expect(page.getByLabel('Upload attachment')).toBeDisabled();
    }
    expect(failures).toEqual([]);
  } finally { await workerContext.close(); await clientContext.close(); }
});
