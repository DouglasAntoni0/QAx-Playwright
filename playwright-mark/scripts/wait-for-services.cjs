const services = [
    `${process.env.BASE_API || 'http://localhost:3333'}/tasks`,
    process.env.BASE_URL || 'http://localhost:8080',
]

async function waitForService(url) {
    const deadline = Date.now() + 60000
    let lastStatus = 'sem resposta'

    while (Date.now() < deadline) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(2000),
            })

            lastStatus = `HTTP ${response.status}`

            if (response.status === 200) {
                console.log(`Disponível: ${url} (${lastStatus})`)
                return
            }
        } catch (error) {
            lastStatus = error.message
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    throw new Error(`Serviço indisponível: ${url} (${lastStatus})`)
}

Promise.all(services.map(waitForService)).catch(error => {
    console.error(error.message)
    process.exitCode = 1
})
