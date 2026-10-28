import { Router } from 'express'
import { saveUploadedImage } from '../../infra/storage/uploads'

/** Image uploads — accepts a JSON body `{ data: "data:image/...;base64,...", scope? }`
    and returns `{ url }` pointing at the statically-served file. */
const uploadRoutes = Router()

uploadRoutes.post('/upload', (req, res) => {
  try {
    const data = (req.body ?? {}).data as string | undefined
    const scope = (req.body ?? {}).scope as string | undefined
    const saved = saveUploadedImage(data ?? '', scope ?? 'misc')
    return res.status(201).json({ url: saved.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha no upload.'
    return res.status(400).json({ error: message })
  }
})

export default uploadRoutes
