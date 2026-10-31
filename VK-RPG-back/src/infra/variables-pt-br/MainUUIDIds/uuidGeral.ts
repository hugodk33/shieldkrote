import crypto from 'crypto'

// Mesa PT-BR com ids PRÓPRIOS: cada variante agora é dona de um mainGameTableId
// distinto, tornando a mesa PT totalmente independente da EN. As contas de
// usuário (admin/playerOne) e o narrador seguem compartilhadas entre as mesas.
export const mainGameTableId = crypto.randomUUID()
export { mainNarratorId, adminId, playerOneId } from '../../variables/MainUUIDIds/uuidGeral'