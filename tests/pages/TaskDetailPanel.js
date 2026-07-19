class TaskDetailPanel {
  constructor(page) {
    this.page = page;
    this.emptyStateHeading = page.getByRole('heading', { name: 'Select a Task' });
    this.taskHeading = page.locator('h2.text-3xl.font-bold');
    this.markCompleteButton = page.getByRole('button', { name: /Mark Complete|Completed/ });
    this.documentsHeading = page.getByRole('heading', { name: 'Documents Needed' });
    this.timelineHeading = page.getByRole('heading', { name: 'Timeline' });
    this.proTipsHeading = page.getByRole('heading', { name: 'Pro Tips from Real Experience' });
    this.govResourcesHeading = page.getByRole('heading', { name: 'Official Government Resources' });
    this.govResourcesLink = page.getByRole('link', { name: 'Official Application Portal' });
  }

  async toggleComplete() {
    await this.markCompleteButton.click();
  }
}

module.exports = { TaskDetailPanel };
