import { layout } from './layout'

function charCard(ch: any, isNpc: boolean): string {
  const id = isNpc ? ch.characterId : ch.id
  const name = ch.name || ch.username || 'Unknown'
  const hp = ch.hp ?? ch.sheet?.hp ?? '-'
  const fp = ch.fatigue ?? ch.sheet?.fatigue ?? '-'
  const st = ch.st ?? ch.sheet?.st ?? '-'
  const dx = ch.dx ?? ch.sheet?.dx ?? '-'
  const iq = ch.iq ?? ch.sheet?.iq ?? '-'
  const ht = ch.ht ?? ch.sheet?.ht ?? '-'
  const border = isNpc ? 'border-zinc-600/40' : 'border-emerald-700/30'
  const tag = isNpc
    ? '<span class="text-[10px] text-zinc-600 uppercase tracking-wider">NPC</span>'
    : '<span class="text-[10px] text-emerald-500 uppercase tracking-wider flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' + (ch.user?.username || 'Player') + '</span>'
  return `
    <div class="bg-zinc-800/50 border ${border} rounded-lg p-4">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="text-sm font-semibold text-zinc-200">${name}</h3>
          ${tag}
        </div>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 mb-3">
        <span>ST <span class="text-red-400 font-bold">${st}</span></span>
        <span>DX <span class="text-emerald-400 font-bold">${dx}</span></span>
        <span>IQ <span class="text-blue-400 font-bold">${iq}</span></span>
        <span>HT <span class="text-purple-400 font-bold">${ht}</span></span>
        <span>HP <span class="text-zinc-300">${hp}</span></span>
        <span>FP <span class="text-zinc-300">${fp}</span></span>
      </div>
      <a href="/game-table-character-viewer/${id}" class="block w-full text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">Character Sheet &rarr;</a>
    </div>
  `
}

export function playerSession(data: any): string {
  const table = data.table
  const characters = data.characters ?? []
  const scenes = data.scenes ?? []

  const players = characters.filter((c: any) => !c.isNpc)
  const npcs = characters.filter((c: any) => c.isNpc)
  const playerChar = players[0]

  const sortedScenes = [...scenes].sort((a: any, b: any) => (b.chapter - a.chapter) || (b.moment - a.moment))
  const latestScene = sortedScenes[0]
  const latestNarrations = latestScene?.narrations ?? []
  const latestNarration = latestNarrations[latestNarrations.length - 1]
  const lc = latestScene?.chapter ?? 1
  const lm = latestScene?.moment ?? 0
  const lt = latestNarration?.title ?? latestScene?.title ?? ''
  const ln = latestNarration?.narration ?? ''
  const lsid = latestScene?.id ?? ''
  const lp = latestScene ? `${latestScene.moment + 1}.${latestNarrations.length}` : '1'

  return layout(`Session — ${table?.title || 'Game'}`, `
    <div class="max-w-4xl mx-auto p-4 md:p-6">
      <div class="flex gap-1 border-b border-zinc-700/50">
        <a href="/table/${table?.id}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-200 border-b-2 border-amber-500">Act</a>
        <a href="/player/game_table_scenes/${table?.id}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Timeline</a>
        <details class="relative">
          <summary class="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent cursor-pointer list-none flex items-center gap-1">Table<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary>
          <div class="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
            <a href="/player/game_table_items/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Items</a>
            <a href="/player/game_table_advantages/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Advantages</a>
            <a href="/player/game_table_disadvantages/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Disadvantages</a>
            <a href="/player/game_table_skills/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Skills</a>
            <a href="/player/game_table_characters/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Characters</a>
            <a href="/player/game_table_locations/${table?.id}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Locations</a>
          </div>
        </details>
        ${playerChar ? `<a href="/player/game-table-character-viewer/${playerChar.id}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Character</a>` : ''}
      </div>

      <div class="mb-3 mt-3">
        <h1 class="text-2xl font-bold text-amber-100">${table?.title || 'Session'}</h1>
      </div>

      <div id="tab-act" class="space-y-6">
        <div class="bg-zinc-900/80 border border-zinc-700/40 rounded-xl p-5">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="text-sm text-zinc-300">
              <span class="text-zinc-500 uppercase text-xs tracking-wider">Chapter</span>
              <span class="text-amber-400 font-bold text-xl ml-1">${lc}</span>
              <span class="text-zinc-600 mx-2">&middot;</span>
              <span class="text-zinc-500 uppercase text-xs tracking-wider">Part</span>
              <span class="text-amber-400 font-bold text-xl ml-1">${lp}</span>
              <span class="text-zinc-600 mx-2">&middot;</span>
              <span class="text-zinc-300">${lt}</span>
            </div>
          </div>
          ${ln ? `<p class="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700/50 pl-3 mt-3">${ln}</p>` : ''}
          ${latestNarration?.actions?.length ? `
            <div class="mt-4 border-t border-zinc-700/40 pt-3">
              ${latestNarration.actions.sort((a: any, b: any) => (a.queue ?? 0) - (b.queue ?? 0)).map((a: any) => {
                const charId = a.character?.id || ''
                const charName = a.character?.name || a.character?.username || 'Unknown'
                return `
                  <div class="flex items-start gap-3 py-1.5">
                    <span class="text-xs text-zinc-600 w-4 mt-0.5">${a.queue}.</span>
                    <div class="flex-1">
                      <span class="text-sm text-zinc-300">
                        ${charId ? `<a href="/player/game-table-character-viewer/${charId}" class="text-zinc-200 hover:text-blue-400">${charName}</a>` : charName}
                        ${a.description ? `&mdash; ${a.description}` : ''}
                      </span>
                      ${a.dice_roll ? `<span class="text-xs text-zinc-400 ml-1">${a.dice_roll}${a.result ? ` = ${a.result}` : ''}</span>` : ''}
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          ` : ''}
        </div>

        <div class="bg-zinc-900/80 border border-zinc-700/40 rounded-xl p-5">
          <h2 class="text-lg font-bold text-zinc-100 mb-4">Roll &amp; Act</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col items-center justify-center gap-2">
              <div class="flex items-center gap-3 mb-4">
                <div>
                  <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1 text-center">Dice</label>
                  <select id="diceType" class="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-700/60">
                    <option value="4" class="bg-zinc-800">d4</option>
                    <option value="6" selected class="bg-zinc-800">d6</option>
                    <option value="8" class="bg-zinc-800">d8</option>
                    <option value="10" class="bg-zinc-800">d10</option>
                    <option value="12" class="bg-zinc-800">d12</option>
                    <option value="20" class="bg-zinc-800">d20</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1 text-center">Count</label>
                  <div class="flex items-center gap-1">
                    <button id="decBtn" class="w-8 h-9 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors text-lg leading-none">−</button>
                    <span id="diceCount" class="w-10 text-center text-lg font-bold text-amber-400 font-mono">3</span>
                    <button id="incBtn" class="w-8 h-9 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors text-lg leading-none">+</button>
                  </div>
                </div>
                <div>
                  <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1 text-center">Mod</label>
                  <input type="number" id="diceMod" value="0" min="-20" max="20" readonly
                    class="w-16 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-zinc-100 text-sm text-center focus:outline-none focus:border-amber-700/60" />
                </div>
              </div>

              <div id="diceResults" class="flex flex-wrap items-center justify-center gap-2 mb-4 min-h-[4rem]">
                <div class="w-10 h-10 bg-zinc-800/30 border border-zinc-700/30 rounded-lg flex items-center justify-center text-lg font-mono text-zinc-700 shadow-inner">?</div>
              </div>

              <div class="flex items-center gap-4 mb-3 text-sm text-zinc-500">
                <span>Modifier: <span id="modDisplay" class="text-zinc-300 font-semibold">0</span></span>
                <span class="text-base">Total: <span id="totalDisplay" class="text-amber-400 font-bold text-xl font-mono"></span></span>
              </div>

              <div class="flex justify-center gap-3">
                <button id="rollBtn" class="bg-amber-700/80 hover:bg-amber-600 text-amber-100 text-sm font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"><span>🎲</span> Roll</button>
                <button id="copyRollBtn" class="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors">📋 Copy</button>
              </div>
            </div>
            <div class="space-y-3">
              <input type="hidden" id="tableId" value="${table?.id || data?.table_id || ''}" />
              <div>
                <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Skill / Attribute</label>
                <select id="actSkill" class="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-700/60 transition-colors">
                  <option value="st" class="bg-zinc-800">ST</option>
                  <option value="dx" class="bg-zinc-800">DX</option>
                  <option value="iq" class="bg-zinc-800">IQ</option>
                  <option value="ht" class="bg-zinc-800">HT</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Dice Roll</label>
                <input type="text" id="actRoll" placeholder="3d6+2=14" readonly
                  class="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-700/60 transition-colors" />
              </div>
              <div>
                <label class="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Target Character</label>
                <select id="actTarget" class="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-700/60 transition-colors">
                  <option value="" class="bg-zinc-800">—</option>
                  ${characters.map((c: any) => `
                    <option value="${c.id}" class="bg-zinc-800">${c.name || c.username || 'Unknown'}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
    <script>
      (function() {
        var rollBtn = document.getElementById('rollBtn');
        var copyBtn = document.getElementById('copyRollBtn');
        var modDisplay = document.getElementById('modDisplay');
        var totalDisplay = document.getElementById('totalDisplay');
        var diceResults = document.getElementById('diceResults');
        var actSkill = document.getElementById('actSkill');
        var diceMod = document.getElementById('diceMod');
        var diceType = document.getElementById('diceType');
        var diceCount = document.getElementById('diceCount');
        var decBtn = document.getElementById('decBtn');
        var incBtn = document.getElementById('incBtn');

        var lastRolls = [];

        function updateMod() {
          var mod = parseInt((diceMod && diceMod.value) || '0', 10);
          var totalMod = mod;
          if (modDisplay) modDisplay.textContent = (totalMod >= 0 ? '+' : '') + totalMod;
          return totalMod;
        }

        function rollAll() {
          var die = parseInt((diceType && diceType.value) || '6', 10);
          var count = parseInt((diceCount && diceCount.textContent) || '3', 10);
          var mod = updateMod();
          lastRolls = [];
          var sum = 0;
          var html = '';
          for (var i = 0; i < count; i++) {
            var r = Math.floor(Math.random() * die) + 1;
            lastRolls.push(r);
            sum += r;
            var color = r >= die ? 'text-emerald-400' : (r <= die * 0.25 ? 'text-red-400' : 'text-amber-400');
            html += '<div class="w-10 h-10 bg-zinc-800 border border-zinc-600/50 rounded-lg flex items-center justify-center text-lg font-bold ' + color + ' font-mono shadow-inner">' + r + '</div>';
            if (i < count - 1) html += '<span class="text-zinc-600 text-sm">+</span>';
          }
          if (diceResults) diceResults.innerHTML = html;
          var total = sum + mod;
          if (totalDisplay) totalDisplay.textContent = total;
        }

        if (diceMod) diceMod.addEventListener('input', updateMod);
        updateMod();

        if (decBtn) decBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var c = parseInt((diceCount && diceCount.textContent) || '3', 10);
          if (c > 1) { c--; if (diceCount) diceCount.textContent = c; }
        });
        if (incBtn) incBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var c = parseInt((diceCount && diceCount.textContent) || '3', 10);
          if (c < 20) { c++; if (diceCount) diceCount.textContent = c; }
        });

        if (rollBtn) rollBtn.addEventListener('click', function(e) {
          e.preventDefault();
          rollAll();
          var count = parseInt((diceCount && diceCount.textContent) || '3', 10);
          if (lastRolls.length === 0) lastRolls = new Array(count).fill(0);
          var total = (totalDisplay && totalDisplay.textContent) || '0';
          var die = (diceType && diceType.value) || '6';
          var text = count + 'd' + die + ' [ ' + lastRolls.join(' , ') + ' ]';
          var rollInput = document.getElementById('actRoll');
          if (rollInput) rollInput.value = text;
        });
        if (copyBtn) copyBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var count = parseInt((diceCount && diceCount.textContent) || '3', 10);
          if (lastRolls.length === 0) lastRolls = new Array(count).fill(0);
          var text = lastRolls.join('+') + '=' + (totalDisplay && totalDisplay.textContent) || '0';
          navigator.clipboard.writeText(text).catch(function() {});
        });
      })();
    </script>
  `, table?.id)
}
