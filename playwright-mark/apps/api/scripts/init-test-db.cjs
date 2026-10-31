process.env.NODE_ENV = 'test'

const connect = require('../src/database').default

async function initialize() {
    const connection = await connect()

    try {
        await connection.runMigrations()
        console.log('Banco de teste inicializado com as migrations da API.')
    } finally {
        await connection.close()
    }
}

initialize().catch(error => {
    console.error(error)
    process.exitCode = 1
})
