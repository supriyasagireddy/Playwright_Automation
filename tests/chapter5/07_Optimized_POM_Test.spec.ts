import{test}from "../../src/fixtures/TestFixture"

test('Implementing textures', async ({page,homePage,resultPage,playlistPage}) => {
    
    // Navigate to the home page
    await homePage.goToUrl();
    // Search for a keyword
    await homePage.searchWithKeywords(`${process.env.SEARCH_KEYWORDS}`);

    // Click on the first playlist link in the results
    await resultPage.clickOnPlaylist(`${process.env.SEARCH_KEYWORDS}`);

    // Validate the title of the playlist page
    await playlistPage.validatePageTitle(`${process.env.SEARCH_KEYWORDS}`+ ' - YouTube'); 
    

}); 