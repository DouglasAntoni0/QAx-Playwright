import 'dotenv/config'
import { expect, APIRequestContext } from '@playwright/test'

import { TaskModel } from '../fixtures/task.model'

const BASE_API = process.env.BASE_API

export async function deleteTaskByHelper(request: APIRequestContext, taskName: string) {
    const response = await request.delete(`${BASE_API}/helper/tasks/${taskName}`)
    expect(response.ok()).toBeTruthy()
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
    const newTask = await request.post(`${BASE_API}/tasks`, { data: task })
    expect(newTask.ok()).toBeTruthy()
}
