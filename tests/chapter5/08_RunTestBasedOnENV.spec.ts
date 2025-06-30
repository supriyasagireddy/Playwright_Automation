import{test}from "../../src/fixtures/TestFixture"

test('Implementing textures', async ({page,homePage,resultPage,playlistPage,testData}) => {
    
    // Navigate to the home page
    await homePage.goToUrl();
    // Search for a keyword
    await homePage.searchWithKeywords(String(testData.Module1TestData?.Skill1));

    // Click on the first playlist link in the results
    await resultPage.clickOnPlaylist(String(testData.Module1TestData?.Skill1));

    // Validate the title of the playlist page
    await playlistPage.validatePageTitle(String(testData.Module1TestData?.Skill1)+ ' - YouTube'); 

    console.log(`Skill : ${String(testData.Module1TestData?.Skill1)}`);
    console.log(`Skill : ${String(testData.Module1TestData?.Skill2)}`);
    console.log(`Skill : ${String(testData.Module1TestData?.Skill3)}`);

    

}); 