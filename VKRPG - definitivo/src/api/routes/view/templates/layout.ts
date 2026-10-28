export function layout(title: string, content: string, tableId?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - ShieldFrog</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .nav-link { transition: color .15s, background .15s; }
    details > summary::-webkit-details-marker { display: none; }
  </style>
</head>
<body class="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col">
  <header class="bg-zinc-800/90 border-b border-zinc-700/50 sticky top-0 z-50 backdrop-blur-sm">
    <div class="max-w-6xl mx-auto px-4 relative">
      <div class="flex items-center justify-center h-14">
        <div class="w-14"></div>
        <a href="/" class="flex items-center gap-2 text-amber-400 font-bold text-xl tracking-tight no-underline">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          ShieldFrog
        </a>
        <button id="menuBtn" class="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/50 focus:outline-none" aria-label="Menu">
          <svg id="menuIcon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <div id="mobileMenu" class="hidden absolute left-1/2 -translate-x-1/2 top-full mt-0 w-52 bg-zinc-800 border border-zinc-700/60 rounded-lg shadow-xl py-2 z-50 text-center">
        <a href="/" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Home</a>
        <div class="text-zinc-500 text-xs uppercase tracking-wider px-4 pt-3 pb-1">New</div>
        <a href="/form/game-table/new" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Table</a>
        <a href="/form/character/new${tableId ? '?table_id=' + tableId : ''}" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Character</a>
        <a href="/form/npc/new" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">NPC</a>
        <a href="/form/item/new" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Item</a>
        <a href="/form/advantage/new" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Advantage</a>
        <a href="/form/disadvantage/new" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Disadvantage</a>
        <div class="text-zinc-500 text-xs uppercase tracking-wider px-4 pt-3 pb-1">Dashboards</div>
        <a href="/tables" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Narrator</a>
        <a href="/table" class="block px-4 py-2 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50">Player</a>
      </div>
    </div>
  </header>
  <script>
    const btn = document.getElementById('menuBtn')
    const menu = document.getElementById('mobileMenu')
    const icon = document.getElementById('menuIcon')
    if (btn && menu && icon) {
      btn.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden')
        icon.innerHTML = open
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
      })
    }
    document.querySelectorAll('details').forEach(d => {
      d.addEventListener('toggle', () => {
        document.querySelectorAll('details[open]').forEach(o => { if (o !== d) o.open = false })
      })
    })
  </script>
  <main class="flex-1">
    ${content}
  </main>
</body>
</html>`
}
