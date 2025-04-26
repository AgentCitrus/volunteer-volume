const request  = require('supertest')
const fs       = require('fs')
const path     = require('path')
const mongoose = require('mongoose')
const app      = require('../app') 

const ATTEMPTS   = 250
const BATCH_SIZE = 30

function randomPwd(min = 8, max = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = Math.floor(Math.random() * (max - min + 1)) + min
  let pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

describe(
  `Brute-force sprint (CSV only, ${BATCH_SIZE}-request batches, random passwords)`,
  () => {
    it(`runs ${ATTEMPTS} failed logins with random passwords and exports CSV`, async () => {
      const results = []

      for (let i = 0; i < ATTEMPTS; i += BATCH_SIZE) {
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1
        const batchName  = `batch-${batchIndex}`

        console.time(batchName)
        const batch = []

        for (let j = 0; j < BATCH_SIZE && i + j < ATTEMPTS; j++) {
          const attemptNo = i + j + 1
          batch.push((async () => {
            const t0 = Date.now()
            const pwd = randomPwd(8, 20)
            const res = await request(app)
              .post('/api/auth/login')
              .send({
                email:    'admin@example.com',
                password: pwd
              })
            return {
              attempt: attemptNo,
              status:  res.statusCode,
              ms:      Date.now() - t0
            }
          })())
        }

        const batchResults = await Promise.all(batch)
        console.timeEnd(batchName)
        results.push(...batchResults)
      }

      const totalMs = results.reduce((sum, r) => sum + r.ms, 0)
      console.log(`Σ individual latencies: ${totalMs} ms`)

      const header = 'attempt,status,ms'
      const lines  = results.map(r => `${r.attempt},${r.status},${r.ms}`)
      const out    = [header, ...lines].join('\n')
      const csvPath = path.join(__dirname, 'bruteForce.csv')
      fs.writeFileSync(csvPath, out)
      console.log(`📄  bruteForce.csv written (${results.length} rows)`)

      expect(results).toHaveLength(ATTEMPTS)
    }, 60000)
  }
)


afterAll(async () => {
  await mongoose.disconnect()
})
