import{expect,Locator,Page}from '@playwright/test';

export class PlayListPage {
    readonly page:Page;
    constructor(page:Page) {
        this.page = page;
    }
    async validatePageTitle(title:string) {
        await expect(this.page).toHaveTitle(title);
    }
}