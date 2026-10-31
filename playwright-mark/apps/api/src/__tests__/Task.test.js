const request = require('supertest')

const { app, databaseReady } = require('../app')
const { Task } = require('../models/Task')

let connection

beforeAll(async () => {
    connection = await databaseReady
    await connection.runMigrations()
})

beforeEach(async () => {
    await connection.getRepository(Task).clear()
})

afterAll(async () => {
    if (connection && connection.isConnected) {
        try {
            await connection.dropDatabase()
        } finally {
            await connection.close()
        }
    }
})

describe('Tasks', () => {
    it('deve cadastrar uma tarefa com o contrato atual', async () => {
        const task = { name: 'Criar tarefa pela API', is_done: false }

        await request(app).post('/tasks').send(task).expect(201)

        const response = await request(app).get('/tasks').expect(200)

        expect(response.body).toEqual([
            expect.objectContaining(task),
        ])
    })

    it('deve rejeitar tarefa com nome duplicado', async () => {
        const task = { name: 'Impedir tarefa duplicada', is_done: false }

        await request(app).post('/tasks').send(task).expect(201)

        const duplicate = await request(app).post('/tasks').send(task).expect(400)

        expect(duplicate.body).toEqual({ message: 'Task already exists!' })

        const response = await request(app).get('/tasks').expect(200)

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toEqual(expect.objectContaining(task))
    })
})
