import { layout } from './layout'

interface RouteDoc {
  method: 'GET' | 'POST' | 'PUT'
  path: string
  desc: string
  reqBody?: string
  resBody: string
}

const adminRoutes: RouteDoc[] = [
  {
    method: 'POST', path: '/create-user',
    desc: 'Create a new user.',
    reqBody: JSON.stringify({ username: 'gm_narrator', password: 'secret123' }, null, 2),
    resBody: JSON.stringify({ id: 'usr_abc123', username: 'gm_narrator' }, null, 2)
  },
  {
    method: 'POST', path: '/create-game-table',
    desc: 'Create a new game table.',
    reqBody: JSON.stringify({ title: 'My Campaign', narrator_id: 'usr_abc123' }, null, 2),
    resBody: JSON.stringify({ id: 'tbl_xyz789', title: 'My Campaign' }, null, 2)
  },
  {
    method: 'PUT', path: '/users/edit/:id',
    desc: 'Update a user.',
    reqBody: JSON.stringify({ username: 'new_name' }, null, 2),
    resBody: JSON.stringify({ id: 'usr_abc123', username: 'new_name' }, null, 2)
  },
  {
    method: 'GET', path: '/game-tables',
    desc: 'List all game tables.',
    resBody: JSON.stringify([{ id: 'tbl_xyz789', title: 'My Campaign', narrator: { username: 'gm_narrator' } }], null, 2)
  },
  {
    method: 'PUT', path: '/game-table/edit/:id',
    desc: 'Update a game table.',
    reqBody: JSON.stringify({ title: 'Updated Title', intro: 'New intro text' }, null, 2),
    resBody: JSON.stringify({ id: 'tbl_xyz789', title: 'Updated Title' }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-scene',
    desc: 'Create a new scene within a game table.',
    reqBody: JSON.stringify({ table_id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', title: 'Session 2', description: 'The dungeon crawl', order: 2 }, null, 2),
    resBody: JSON.stringify({ id: 'scn_002', title: 'Session 2' }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-narration',
    desc: 'Create a narration block inside a scene.',
    reqBody: JSON.stringify({ scene_id: 'scn_002', text: 'The door creaks open...', moment: 0 }, null, 2),
    resBody: JSON.stringify({ id: 'nar_002', text: 'The door creaks open...' }, null, 2)
  }
]

const characterRoutes: RouteDoc[] = [
  {
    method: 'POST', path: '/game-table-character',
    desc: 'Create a new character.',
    reqBody: JSON.stringify({
      table_id: '85234849-c260-4950-8d6d-20d897cca1b6',
      user_id: '5af72edc-aef3-4af0-a494-27c4926d1c45',
      sheet: {
        name: 'Elric Galrhorn Denmark',
        bio: 'A streetwise duelist with quick reflexes.',
        backstory: 'Former city watch turned blade-for-hire.',
        points: 150,
        hp: 8, st: 11, dx: 12, iq: 13, ht: 10, fatigue: 0,
        encumbrance: 'Light'
      },
      advantages: [
        { advantage_id: '962f395e-b81d-44b6-8257-4dc304a223ec', name: 'Leadership', cost_points: 5, effect: 'Inspire allies' }
      ],
      disadvantages: [
        { disadvantage_id: 'fbc86dc5-2c39-4acb-9f56-b648334cedef', name: 'Code of Honor', cost_points: -10, effect: 'Discipline' }
      ],
      skills: [
        { skill_id: 'd282e343-89c8-41ec-a686-83d81b69c34e', cost_points: 14, effect: 'Melee attacks with swords' }
      ]
    }, null, 2),
    resBody: JSON.stringify({ id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', name: 'Elric Galrhorn Denmark' }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-character',
    desc: 'Update an existing character.',
    reqBody: JSON.stringify({ id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', name: 'Elric', st: 11, dx: 13 }, null, 2),
    resBody: JSON.stringify({ id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', name: 'Elric', st: 11, dx: 13 }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-character/:id',
    desc: 'Get a character by ID (optionally ?moment=N for historical state).',
    resBody: JSON.stringify({
      table: { id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', title: 'A Noite do Lobisomem', intro: 'Uma aventura de horror na aldeia de Shadowbrook', system: 'GURPS' },
      character: {
        id: 'dc60499b-829f-4763-983f-9b7a22f3c00a',
        name: 'Elric Galrhorn Denmark',
        user: { id: '5af72edc-aef3-4af0-a494-27c4926d1c45', username: 'John Doe', email: 'john.doe@email.com', phone: '85888888888', type: 1 },
        sheet: { id: '9000c81a-ca73-4a4e-9fb2-91107da645c2', name: 'Elric Galrhorn Denmark', bio: 'A streetwise duelist.', backstory: 'Former city watch.', points: 150, hp: 8, st: 11, dx: 12, iq: 13, ht: 10, fatigue: 0, encumbrance: 'Light', basic_speed: 5.5, move: 4.5, base_hp: 11, base_st: 11, base_dx: 12, base_iq: 13, base_ht: 10, base_fatigue: 0 },
        advantages: [], disadvantages: [], skills: [], items: [], damages: [], armors: [], active_effects: [{ id: '5ea0a4bb-127a-4e9a-b644-77beec334685', name: 'Blunt trauma', description: "Thorne's heavy overhand blows bruised Elric through his guard", mod_hp: -3 }]
      },
      peculiarities: [],
      moments: [0, 1],
      selected_moment: null
    }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-character/:id/history',
    desc: 'Get the character journey: every modifier event with its chapter, moment, scene, narration, and action provenance.',
    resBody: JSON.stringify({
      character: { id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', name: 'Elric Galrhorn Denmark', user: { id: '5af72edc-aef3-4af0-a494-27c4926d1c45', username: 'John Doe' } },
      table: { id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', title: 'A Noite do Lobisomem', system: 'GURPS' },
      events: [{ id: '5ea0a4bb-127a-4e9a-b644-77beec334685', name: 'Blunt trauma', mod_hp: -3, chapter: 1, narration_moment: 1, scene_title: 'The Ambush', narration_title: 'Thorne closes in', action_description: 'Thorne lands a heavy overhand blow', action_result: 'Success' }]
    }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-characters/:id',
    desc: 'List all characters for a game table.',
    resBody: JSON.stringify([{ id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', name: 'Elric Galrhorn Denmark' }], null, 2)
  },
  {
    method: 'POST', path: '/game-table-npc',
    desc: 'Create a new NPC.',
    reqBody: JSON.stringify({ table_id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', sheet: { name: 'Goblin', st: 9, dx: 12, iq: 8, ht: 10 } }, null, 2),
    resBody: JSON.stringify({ character_id: 'a1b2c3d4-0000-0000-0000-000000000000', sheet_id: 'b2c3d4e5-0000-0000-0000-000000000000' }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-npc/:id',
    desc: 'Get a single NPC by ID.',
    resBody: JSON.stringify({ npc: { id: 'npc_001', status: 'active' }, character: { id: 'ch_001', name: 'Goblin', sheet: { hp: 7, st: 9, dx: 12, iq: 8, ht: 10 }, advantages: [], skills: [], items: [], damages: [], armors: [] } }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-npcs/:id',
    desc: 'List all NPCs for a game table.',
    resBody: JSON.stringify({ table: { id: 'tbl_001', title: 'Campaign' }, npcs: [{ npc_id: 'npc_001', sheet_name: 'Goblin' }] }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-modifier',
    desc: 'Create a new modifier for a character.',
    reqBody: JSON.stringify({ character_id: 'ch_001', name: 'Slash Wound', mod_hp: -4 }, null, 2),
    resBody: JSON.stringify({ id: 'mod_001', name: 'Slash Wound' }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-modifier',
    desc: 'Update an existing modifier.',
    reqBody: JSON.stringify({ id: 'mod_001', mod_hp: -5 }, null, 2),
    resBody: JSON.stringify({ id: 'mod_001', mod_hp: -5 }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-modifier/:id',
    desc: 'Get a single modifier by ID.',
    resBody: JSON.stringify({ id: 'mod_001', name: 'Slash Wound', mod_hp: -3, character_id: 'ch_001' }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-modifiers/:id',
    desc: 'List all modifiers for a game table.',
    resBody: JSON.stringify([{ id: 'mod_001', name: 'Slash Wound', character_id: 'ch_001', mod_hp: -3 }], null, 2)
  }
]

const skillRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-skills/:id',
    desc: 'List all skills for a game table.',
    resBody: JSON.stringify([{ id: 'sk_001', name: 'Swordsmanship', predefinition_type: 'Physical', predefinition_difficulty: 'Easy', category: 'Combat' }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-skill/:id',
    desc: 'Get a single skill by ID.',
    resBody: JSON.stringify({ id: 'sk_001', table_id: 'tbl_001', name: 'Swordsmanship', predefinition_type: 'Physical', predefinition_difficulty: 'Easy', predefinition_value: 12, category: 'Combat' }, null, 2)
  }
]

const advantageRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-advantages/:id',
    desc: 'List all advantages for a game table.',
    resBody: JSON.stringify([{ id: 'adv_001', name: 'Leadership', cost_points: 5, category: 'Social', description: 'Inspire allies in combat.' }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-advantage/:id',
    desc: 'Get a single advantage by ID.',
    resBody: JSON.stringify({ id: 'adv_001', table_id: 'tbl_001', name: 'Leadership', cost_points: 5, category: 'Social', description: 'Inspire allies in combat.' }, null, 2)
  }
]

const disadvantageRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-disadvantages/:id',
    desc: 'List all disadvantages for a game table.',
    resBody: JSON.stringify([{ id: 'dis_001', name: 'Code of Honor', cost_points: -10, category: 'Mental', effect: 'Must follow a strict code.' }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-disadvantage/:id',
    desc: 'Get a single disadvantage by ID.',
    resBody: JSON.stringify({ id: 'dis_001', table_id: 'tbl_001', name: 'Code of Honor', cost_points: -10, category: 'Mental', effect: 'Must follow a strict code.' }, null, 2)
  }
]

const quirkRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-peculiarities/:id',
    desc: 'List all quirks (peculiarities) for a game table.',
    resBody: JSON.stringify([{ id: 'pec_001', name: 'Bad Temper', cost_points: -5, effect: '-2 reaction rolls' }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-peculiarity/:id',
    desc: 'Get a single quirk by ID.',
    resBody: JSON.stringify({ id: 'pec_001', character_id: 'ch_001', name: 'Bad Temper', cost_points: -5, effect: '-2 reaction rolls' }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-peculiarity',
    desc: 'Create a quirk for a character.',
    reqBody: JSON.stringify({ character_id: 'ch_001', name: 'Bad Temper', cost_points: -5, effect: '-2 reaction rolls' }, null, 2),
    resBody: JSON.stringify({ success: true }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-peculiarity',
    desc: 'Update an existing quirk.',
    reqBody: JSON.stringify({ id: 'pec_001', name: 'Bad Temper', cost_points: -5, effect: '-3 reaction rolls' }, null, 2),
    resBody: JSON.stringify({ success: true }, null, 2)
  }
]

const itemRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-items/:id',
    desc: 'List all items for a game table (includes joined damage and armor data).',
    resBody: JSON.stringify([
      { id: 'item_001', name: 'Short Sword', type: 1, category: 'Melee', weight: 3, damage_value: 'sw+2 cut', range: 'Melee', armor_value: null, armor_fit: null },
      { id: 'item_002', name: 'Chain Mail', type: 2, category: 'Armor', weight: 15, damage_value: null, range: null, armor_value: 4, armor_fit: 'Snug' }
    ], null, 2)
  },
  {
    method: 'GET', path: '/game-table-item/:id',
    desc: 'Get a single item by ID (includes joined damage and armor data).',
    resBody: JSON.stringify({ id: 'item_001', table_id: 'tbl_001', name: 'Short Sword', type: 1, category: 'Melee', weight: 3, damage_id: 'dmg_001', damage_value: 'sw+2 cut', range: 'Melee', armor_id: null, armor_value: null, armor_fit: null }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-item',
    desc: 'Create an item. Auto-creates Damage for weapons (type=1) or Armor for armor (type=2).',
    reqBody: JSON.stringify({ table_id: 'tbl_001', name: 'Short Sword', type: 1, category: 'Melee', weight: 3, character_id: 'ch_001', damage_value: 'sw+2 cut', range: 'Melee' }, null, 2),
    resBody: JSON.stringify({ success: true, id: 'item_001' }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-item',
    desc: 'Update an existing item. Also updates linked Damage/Armor.',
    reqBody: JSON.stringify({ id: 'item_001', name: 'Short Sword+1', damage_value: 'sw+3 cut', character_id: 'ch_001' }, null, 2),
    resBody: JSON.stringify({ success: true }, null, 2)
  }
]

const locationRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/table-locations/:id',
    desc: 'List all locations for a game table.',
    resBody: JSON.stringify([{ id: 'loc_001', name: 'Shadowbrook Village', region: 'Misty Valley', description: 'A quiet village...', address: '123 Main St', map_coordinates: '45.5,-73.5' }], null, 2)
  },
  {
    method: 'GET', path: '/table-location/:id',
    desc: 'Get a single location by ID.',
    resBody: JSON.stringify({ id: 'loc_001', table_id: 'tbl_001', name: 'Shadowbrook Village', region: 'Misty Valley', description: 'A quiet village...', address: '123 Main St', map_coordinates: '45.5,-73.5' }, null, 2)
  },
  {
    method: 'POST', path: '/table-location',
    desc: 'Create a new location.',
    reqBody: JSON.stringify({ table_id: 'tbl_001', name: 'Shadowbrook Village', region: 'Misty Valley', description: 'A quiet village...', address: '123 Main St', map_coordinates: '45.5,-73.5' }, null, 2),
    resBody: JSON.stringify({ id: 'loc_002', name: 'Shadowbrook Village' }, null, 2)
  },
  {
    method: 'PUT', path: '/table-location',
    desc: 'Update an existing location.',
    reqBody: JSON.stringify({ id: 'loc_001', name: 'Shadowbrook Village (Updated)' }, null, 2),
    resBody: JSON.stringify({ success: true }, null, 2)
  }
]

const visibilityRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-visibility/:id',
    desc: 'List all visibility rules for a game table.',
    resBody: JSON.stringify([{ id: 'vis_001', item_id: 'item_001', role: 'player', visible: true }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-visibility-item/:id',
    desc: 'Get a single visibility rule by ID.',
    resBody: JSON.stringify({ id: 'vis_001', item_id: 'item_001', role: 'player', visible: true }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-visibility',
    desc: 'Create a visibility rule.',
    reqBody: JSON.stringify({ table_id: 'tbl_001', item_id: 'item_001', role: 'player', visible: true }, null, 2),
    resBody: JSON.stringify({ id: 'vis_002', visible: true }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-visibility',
    desc: 'Update a visibility rule.',
    reqBody: JSON.stringify({ id: 'vis_002', visible: false }, null, 2),
    resBody: JSON.stringify({ id: 'vis_002', visible: false }, null, 2)
  }
]

const queueRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/game-table-queue/:id',
    desc: 'List all queue entries for a game table.',
    resBody: JSON.stringify([{ id: 'que_001', character_id: 'ch_001', position: 1 }], null, 2)
  },
  {
    method: 'GET', path: '/game-table-queue-item/:id',
    desc: 'Get a single queue entry by ID.',
    resBody: JSON.stringify({ id: 'que_001', character_id: 'ch_001', position: 1 }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-queue',
    desc: 'Create a queue entry.',
    reqBody: JSON.stringify({ table_id: 'tbl_001', character_id: 'ch_001', position: 1 }, null, 2),
    resBody: JSON.stringify({ id: 'que_002', position: 1 }, null, 2)
  },
  {
    method: 'PUT', path: '/game-table-queue',
    desc: 'Update a queue entry.',
    reqBody: JSON.stringify({ id: 'que_002', position: 2 }, null, 2),
    resBody: JSON.stringify({ id: 'que_002', position: 2 }, null, 2)
  }
]

const publicRoutes: RouteDoc[] = [
  {
    method: 'GET', path: '/users/search/:searchTerm',
    desc: 'Search users by username.',
    resBody: JSON.stringify([{ id: '5af72edc-aef3-4af0-a494-27c4926d1c45', username: 'John Doe' }], null, 2)
  },
  {
    method: 'GET', path: '/game-table/:id',
    desc: 'Get a single game table by ID.',
    resBody: JSON.stringify({ id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', title: 'A Noite do Lobisomem', narrator: { username: 'gm_narrator' } }, null, 2)
  },
  {
    method: 'GET', path: '/game-table-scenes/:id',
    desc: 'Get all scenes for a game table (with narrations, actions, and modifiers).',
    resBody: JSON.stringify([{ id: 'scn_001', title: 'Session 1', narrations: [{ id: 'nar_001', text: 'The party arrives...', moment: 0 }] }], null, 2)
  },
  {
    method: 'POST', path: '/game-table-scene',
    desc: 'Create a new scene within a game table.',
    reqBody: JSON.stringify({ table_id: 'f8a9b0c1-d2e3-4567-fabc-678901234567', title: 'Session 2', description: 'The dungeon crawl', order: 2 }, null, 2),
    resBody: JSON.stringify({ id: 'scn_002', title: 'Session 2' }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-narration',
    desc: 'Create a narration block inside a scene.',
    reqBody: JSON.stringify({ scene_id: 'scn_002', text: 'The door creaks open...', moment: 0 }, null, 2),
    resBody: JSON.stringify({ id: 'nar_002', text: 'The door creaks open...' }, null, 2)
  },
  {
    method: 'POST', path: '/game-table-action',
    desc: 'Create an action inside a narration (character action, NPC action, etc.).',
    reqBody: JSON.stringify({ narration_id: 'nar_002', character_id: 'dc60499b-829f-4763-983f-9b7a22f3c00a', type: 'attack', description: 'Swing sword' }, null, 2),
    resBody: JSON.stringify({ id: 'act_001', narration_id: 'nar_002', type: 'attack' }, null, 2)
  }
]

function renderRoutes(routes: RouteDoc[]): string {
  return routes.map(r => `
  <details class="bg-zinc-800/60 border border-zinc-700/40 rounded-lg overflow-hidden">
    <summary class="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-zinc-700/40 transition-colors">
      <span class="px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wider ${methodClass(r.method)}">${r.method}</span>
      <code class="text-zinc-200 text-sm font-mono flex-1">${r.path}</code>
      <span class="text-zinc-500 text-xs mr-2">${r.desc}</span>
      <svg class="w-4 h-4 text-zinc-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
    </summary>
    <div class="px-4 pb-4 border-t border-zinc-700/40 pt-3 space-y-3">
      ${r.reqBody ? `
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Request Body</p>
        <pre class="bg-zinc-950 rounded-lg p-3 overflow-x-auto text-xs text-zinc-300 font-mono">${escapeHtml(r.reqBody)}</pre>
      </div>
      ` : `
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Request</p>
        <pre class="bg-zinc-950 rounded-lg p-3 overflow-x-auto text-xs text-zinc-300 font-mono">${r.method} ${r.path}</pre>
      </div>
      `}
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Response</p>
        <pre class="bg-zinc-950 rounded-lg p-3 overflow-x-auto text-xs text-zinc-300 font-mono">${escapeHtml(r.resBody)}</pre>
      </div>
    </div>
  </details>
  `).join('')
}

export function apiDocs(tablesHtml?: string): string {
  return layout('Home and routes', `
    <div class="max-w-4xl mx-auto p-6">
      ${tablesHtml ?? ''}

      <div class="mb-6${tablesHtml ? ' mt-10' : ''}">
        <h1 class="text-3xl font-bold text-amber-100">API Documentation</h1>
        <p class="text-zinc-400 mt-2">Backend routes for the VKRPG microservice. Click a route to see request/response examples.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Admin
        </h2>
        <div class="space-y-2">
          ${renderRoutes(adminRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Character
        </h2>
        <div class="space-y-2">
          ${renderRoutes(characterRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Skills
        </h2>
        <div class="space-y-2">
          ${renderRoutes(skillRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Advantages
        </h2>
        <div class="space-y-2">
          ${renderRoutes(advantageRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          Disadvantages
        </h2>
        <div class="space-y-2">
          ${renderRoutes(disadvantageRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          Quirks (Peculiarities)
        </h2>
        <div class="space-y-2">
          ${renderRoutes(quirkRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          Items
        </h2>
        <p class="text-xs text-zinc-500 mb-3">Weapons (type=1), Armor (type=2), Equipment (type=3). Damage/Armor data auto-created and JOINed.</p>
        <div class="space-y-2">
          ${renderRoutes(itemRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Locations
        </h2>
        <div class="space-y-2">
          ${renderRoutes(locationRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          Visibility
        </h2>
        <div class="space-y-2">
          ${renderRoutes(visibilityRoutes)}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          Queue (Turn Order)
        </h2>
        <div class="space-y-2">
          ${renderRoutes(queueRoutes)}
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Scenes & Narrations
        </h2>
        <div class="space-y-2">
          ${renderRoutes(publicRoutes)}
        </div>
      </div>
    </div>
    <script>
      document.querySelectorAll('.space-y-2 details').forEach(d => {
        d.addEventListener('toggle', () => {
          if (d.open) {
            d.closest('.space-y-2').querySelectorAll('details[open]').forEach(o => {
              if (o !== d) o.open = false
            })
          }
        })
      })
    </script>
  `)
}

function methodClass(method: string): string {
  switch (method) {
    case 'GET': return 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
    case 'POST': return 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
    case 'PUT': return 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
    default: return 'bg-zinc-700/60 text-zinc-300'
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
