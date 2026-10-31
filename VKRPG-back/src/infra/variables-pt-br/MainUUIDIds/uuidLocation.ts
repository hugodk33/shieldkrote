import crypto  from 'crypto'

// Locais de cena (site) — ids estáveis referenciados nas narrações
export const locationId1 = crypto.randomUUID()
export const locationId2 = crypto.randomUUID()
export const locationId3 = crypto.randomUUID()

// Templo esquecido — planta baixa simples 3×3 do clímax do capítulo 1
export const locTempleId = crypto.randomUUID()

// Cascata de território do seed (world > ... > battlemap)
export const locWorldId = crypto.randomUUID()
export const locContinentId = crypto.randomUUID()
export const locNationId = crypto.randomUUID()
export const locRegionId = crypto.randomUUID()
export const locCityId = crypto.randomUUID()

// Distritos da capital
export const locDistrictMerchantId = crypto.randomUUID()
export const locDistrictCentralId = crypto.randomUUID()
export const locDistrictLowerId = crypto.randomUUID()
export const locDistrictDockId = crypto.randomUUID()
export const locDistrictScholarsId = crypto.randomUUID()
export const locDistrictOldId = crypto.randomUUID()

// Sites cujo id é referenciado pelas regras de visibility (compartilhado EN/PT)
export const locWatchBarracksId = crypto.randomUUID()
export const locShadowyTankardId = crypto.randomUUID()
export const locRooftopsId = crypto.randomUUID()
export const locArcaneLibraryId = crypto.randomUUID()

// Andares de prédios com mapa próximo da escala real (escalas por escada)
export const locLibraryUpperId = crypto.randomUUID()
export const locTankardCellarId = crypto.randomUUID()
export const locWatchUpperId = crypto.randomUUID()

// Conexões entre plantas (porta/escada/alçapão) — ids referenciados pelo seed
// de visibility para dar aos players o conhecimento das passagens.
export const connMarketLibraryId = crypto.randomUUID()
export const connLibraryUpperId = crypto.randomUUID()
export const connTankardCellarId = crypto.randomUUID()
export const connWatchUpperId = crypto.randomUUID()