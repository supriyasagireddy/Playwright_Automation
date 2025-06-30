import {test, expect} from '@playwright/test';
import testData from '../../src/test-data/qa/testdata.json';

type TestData={
    TestDataSet1: {
        Skill1: string;
        Skill2: string;
    },
    TestDataSet2: {
        Skill1: string;
        Skill2: string;
    },
}
const typedTestData = testData as TestData;

for(const dataSetName in typedTestData){
    const skill = typedTestData[dataSetName as keyof TestData];
    test(`Data Driven Test Using JSON file in playwright : ${skill.Skill1}`, async ({page}) => {
        // Navigate to DuckDuckGo as it is less likely to block automation
        await page.goto('https://www.google.com/');



        //Search with keywods
        await page.getByLabel('Search', {exact: true}).fill(skill.Skill1);
        await page.getByLabel('Search', {exact: true}).press('Enter');

        //Click on Playlist
        await page.getByRole('link', {name: skill.Skill1}).first().click({ timeout: 40000 });

        //Validate webpage title
        await expect(page).toHaveTitle(`${skill.Skill1} - YouTube`);
        // Perform a search using the skill from the JSON data
    });
}   