import{Locator, Page} from '@playwright/test';

export class ResultPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async clickOnPlaylist(link: string) {
    await this.page.getByRole('link', { name: link }).first().click({ timeout: 30000 });
}
}

