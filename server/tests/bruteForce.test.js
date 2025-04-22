// server/tests/bruteForce.test.js
/* eslint-env jest */
const request  = require('supertest')
const fs       = require('fs')
const path     = require('path')
const mongoose = require('mongoose')
const app      = require('../app')    // bare Express instance

// total attempts and batch size
const ATTEMPTS   = 1000
const BATCH_SIZE = 100

describe(
  `Brute‑force sprint (CSV only, ${BATCH_SIZE}-request batches)`,
  () => {
    it(`runs ${ATTEMPTS} failed logins in parallel batches and exports CSV`, async () => {
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
            const res = await request(app)
              .post('/api/auth/login')
              .send({
                email:    'admin@example.com',
                password: 'wrong-password'
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

      // log sum of individual latencies
      const totalMs = results.reduce((sum, r) => sum + r.ms, 0)
      console.log(`Σ individual latencies: ${totalMs} ms`)

      // write out the CSV
      const header = 'attempt,status,ms'
      const lines  = results.map(r => `${r.attempt},${r.status},${r.ms}`)
      const out    = [header, ...lines].join('\n')
      const csvPath = path.join(__dirname, 'bruteForce.csv')
      fs.writeFileSync(csvPath, out)
      console.log(`📄  bruteForce.csv written (${results.length} rows)`)

      expect(results).toHaveLength(ATTEMPTS)
    }, 60000)  // allow up to 60s
  }
)

// disconnect mongoose so Jest exits cleanly
afterAll(async () => {
  await mongoose.disconnect()
})
