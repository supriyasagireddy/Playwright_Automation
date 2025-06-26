import { Locator, Page } from '@playwright/test'; 
//Create Exportable Class
export class HomePage {
     readonly page:Page;
     readonly searchTextbox:Locator

    //constructor
    constructor(page:Page) {
        this.page = page;
        //Elements
        this.searchTextbox = this.page.locator(`${process.env.SEARCH_TEXTBOX_LOCATOR}`);
    }
    //Methods
    async goToUrl() {
        await this.page.goto(`${process.env.GOOGLE_URL}`);
    }

    async searchWithKeywords(keyword: string,) {
        await this.searchTextbox.click();
        await this.searchTextbox.fill(keyword);
        await this.searchTextbox.press('Enter');
    }

}