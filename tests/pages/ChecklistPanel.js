class ChecklistPanel {
  constructor(page) {
    this.page = page;
    this.progressLabel = page.getByText('Settlement Progress');
    this.progressPercent = page.locator('span.text-indigo-600.font-bold');
    this.progressCount = page.locator('p.text-xs.text-gray-500.mt-2');
  }

  taskCard(title) {
    return this.page.locator('h3', { hasText: title }).locator('xpath=ancestor::div[contains(@class,"cursor-pointer")]');
  }

  async selectTask(title) {
    await this.page.getByText(title, { exact: true }).click();
  }

  async toggleTaskComplete(title) {
    const card = this.taskCard(title);
    await card.getByRole('button').first().click();
  }

  isTaskCompleted(title) {
    return this.taskCard(title).locator('h3.line-through');
  }
}

module.exports = { ChecklistPanel };
