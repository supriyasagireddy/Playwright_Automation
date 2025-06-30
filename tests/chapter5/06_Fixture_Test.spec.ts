// import {test, expect} from '@playwright/test';
import{test}from '../../src/fixtures/TestFixture'
import {HomePage} from '../../src/pages/HomePage';
import {ResultPage} from '../../src/pages/ResultPage';
import {PlayListPage} from '../../src/pages/PlayListPage';

test('Implementing textures', async ({page}) => {
    console.log('execution started');
    // await page.setViewportSize({
    //     width: 640,
    //     height: 480,
    // })

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
    console.log('execution ended');

}); 