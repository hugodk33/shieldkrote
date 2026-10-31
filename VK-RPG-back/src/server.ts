import express from 'express'
import path from 'path'
import fs from 'fs'
import userRoutes from './api/routes/userRoutes'
import viewRoutes from './api/routes/view/main'
import realtimeRoutes from './api/routes/realtimeRoutes'
import uploadRoutes from './api/routes/uploadRoutes'
import { UPLOADS_DIR, ensureUploadsDir } from './infra/storage/uploads'
//import './infra/database/migrate'

const app = express()

/* Base64 image payloads travel as JSON, so raise the default 100kb cap. */
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

/* Local image store — created on boot, served under /uploads/<...>. */
ensureUploadsDir()
app.use('/uploads', express.static(UPLOADS_DIR))

app.use(uploadRoutes)
app.use(userRoutes)
app.use(viewRoutes)
app.use(realtimeRoutes)

const viewDistPath = path.join(__dirname, '..', '..', 'dist-view')
if (fs.existsSync(viewDistPath)) {
  app.use(express.static(viewDistPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(viewDistPath, 'index.html'))
  })
}

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})