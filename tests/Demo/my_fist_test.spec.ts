const{test, expect}=require('@playwright/test')
// const{hello,helloworld}=require('./Demo/hello')
// import{hello, helloworld} from './Demo/hello'

// console.log(hello());
// console.log(helloworld());

test('My first test ',async({page})=>{
    await page.goto('https://google.com')
    await expect(page).toHaveTitle('Google')
})