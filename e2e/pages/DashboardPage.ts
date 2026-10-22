import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly invoiceCards: Locator;
  readonly emptyState: Locator;
  readonly payMultipleButton: Locator;
<<<<<<< HEAD
=======
  readonly analyticsDashboard: Locator;
  readonly liveMetrics: Locator;
  readonly autoRefreshToggle: Locator;
  readonly connectionStatus: Locator;
>>>>>>> upstream/main

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Dashboard/i });
    this.invoiceCards = page.locator('a[aria-label*="View Invoice"]');
    this.emptyState = page.locator('text=/No invoices found/i');
    this.payMultipleButton = page.locator('button:has-text("Pay Multiple")');
<<<<<<< HEAD
=======
    this.analyticsDashboard = page.locator('[data-testid="analytics-dashboard"]');
    this.liveMetrics = page.locator('[data-testid="live-metric"]');
    this.autoRefreshToggle = page.locator('[data-testid="auto-refresh-toggle"]');
    this.connectionStatus = page.locator('[data-testid="connection-status"]');
>>>>>>> upstream/main
  }

  async goto() {
    await this.page.goto('/dashboard');
  }
<<<<<<< HEAD
=======

  async waitForLiveUpdate() {
    await this.connectionStatus.filter({ hasText: /connected/i }).waitFor();
  }

  async toggleAutoRefresh() {
    await this.autoRefreshToggle.click();
  }
>>>>>>> upstream/main
}
