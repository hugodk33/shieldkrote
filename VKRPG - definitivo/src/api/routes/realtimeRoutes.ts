import { Router } from 'express'
import { subscribeTable } from '../../infra/realtime/TableEvents'

const router = Router()

/* Canal SSE por mesa — o navegador abre esta conexão e recebe
   eventos `change` sempre que a crônica da mesa muda. */
router.get('/realtime/events/:tableId', (req, res) => {
  const { tableId } = req.params as { tableId: string }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.write('event: connected\ndata: {}\n\n')

  subscribeTable(tableId, res)
})

export default router