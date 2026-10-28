import crypto from 'crypto'

export const characterMiraId = crypto.randomUUID()
export const characterGalarhornId = crypto.randomUUID()
export const characterGarrickId = crypto.randomUUID()
export const characterLyraId = crypto.randomUUID()
export const characterKaelId = crypto.randomUUID()
export const characterNPCsIds = Array.from({ length: 10 }, () => crypto.randomUUID())