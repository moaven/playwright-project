import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    
    await page.goto('https://conduit.bondaracademy.com/');

    // we don't have login code here, becuase the authViaAPI.setup.ts and also the config in the playwright.config.ts help us to login to the app
})

test('create article via website and delete it via api',async ({page, request}) => {
    // create a new article via website
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()

    // save the slug parameter of this create article endpoint into slugId 
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug

    // check if created the article correctly
    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

    // get access token from authViaAPI.setup.ts
    
    // delete the article via api and check if the response is successful
    const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`
        // get Authorization headers from authViaAPI.setup.ts
    )
    expect(deleteArticleRequest.status()).toEqual(204)
})