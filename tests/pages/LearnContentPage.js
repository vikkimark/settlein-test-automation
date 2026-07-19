class LearnContentPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Learn from Real Experiences' });
    this.instagramLink = page.getByRole('link', { name: 'Instagram' });
    this.youtubeLink = page.getByRole('link', { name: 'YouTube' });
    this.linkedinLink = page.getByRole('link', { name: 'LinkedIn' });
  }

  videoCard(title) {
    return this.page.getByText(title);
  }
}

module.exports = { LearnContentPage };
