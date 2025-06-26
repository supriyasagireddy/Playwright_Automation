import {test, expect} from '@playwright/test';
import {HomePage} from '../../src/pages/HomePage';
import {ResultPage} from '../../src/pages/ResultPage';
import {PlayListPage} from '../../src/pages/PlayListPage';

test('Page Object Model Test', async ({page}) => {
    
    // Create instances of page objects
    const homePage = new HomePage(page);
    // Navigate to the home page
    await homePage.goToUrl();
    // Search for a keyword
    await homePage.searchWithKeywords(`${process.env.SEARCH_KEYWORDS}`);

    // Create instances of result pages
    const resultPage = new ResultPage(page);
    // Click on the first playlist link in the results
    await resultPage.clickOnPlaylist(`${process.env.SEARCH_KEYWORDS}`);

    const playListPage = new PlayListPage(page);
    // Validate the title of the playlist page
    await playListPage.validatePageTitle(`${process.env.SEARCH_KEYWORDS}`+ ' - YouTube'); 
    
});