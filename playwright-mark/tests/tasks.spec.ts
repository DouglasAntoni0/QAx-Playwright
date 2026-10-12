import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {

    const taskName = 'Ler um livro de TypeScript'

    const cleanup = await request.delete(
        `http://localhost:3333/helper/tasks/${encodeURIComponent(taskName)}`
    )
    expect(cleanup.status()).toBe(204)

    await page.goto('http://localhost:8080');

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)

    await page.click('css=button >> text=Create')

    const target = page.locator(`css=.task-item p >> text=${taskName}`)
    await expect(target).toBeVisible();

})
