/* ============================================================
   i18n-parts/admin — painel do superadmin (d3miurg0).

   As duas mesas-base da seed não têm campanha: elas existem para
   cadastrar os kits (content_modules) e a taxonomia
   (content_categories) que o assistente de nova mesa oferece no
   passo 2. Mesclado ao dict de lib/i18n-core.ts via spread.
   ============================================================ */

export const PT: Record<string, string> = {
  "admin.eyebrow": "Catálogo · superadmin",
  "admin.title": "O Anel",
  "admin.subtitle":
    "Aqui você mantém a taxonomia do catálogo e os kits que todo novo narrador encontra ao criar uma mesa.",
  "admin.guidanceTitle": "Como o catálogo funciona",
  "admin.guidanceBody":
    "As categorias são globais; os kits pertencem a um idioma. O assistente de nova mesa só oferece o acervo do idioma escolhido para a mesa.",
  "admin.guidanceKits":
    "Kits são pacotes fechados de conteúdo (fantasia, cyberpunk...). Cada idioma tem o seu próprio conjunto de pacotes.",
  "admin.guidanceCategories":
    "Categorias organizam o catálogo por domínio e subcategoria, para o narrador filtrar o que instalar.",
  "admin.baseTables": "Mesas-base",
  "admin.baseTablesHint":
    "As mesas de exemplo da seed agora pertencem ao narrador semeado e instalam os kits do próprio idioma.",
  "admin.backHub": "Minhas mesas",
  "admin.badge": "Mesa-base",

  "admin.nav.categories": "Categorias",
  "admin.nav.kits": "Kits",

  "admin.hub.eyebrow": "Anel do superadmin",
  "admin.hub.body": "Registre kits por idioma e mantenha a taxonomia do catálogo.",
  "admin.hub.open": "Abrir painel",

  "admin.kits.eyebrow": "Catálogo · pacotes",
  "admin.kits.title": "Kits",
  "admin.kits.pageSubtitle":
    "Cada narrador instala um ou mais kits ao criar a mesa. O acervo é separado por idioma: mesas EN só recebem kits EN, mesas PT só recebem kits PT.",
  "admin.kits.hint":
    "Pacotes que os narradores podem instalar inteiros ao criar uma mesa.",
  "admin.kits.open": "Gerenciar kits",
  "admin.kits.filter": "Filtrar por idioma",
  "admin.kits.filterAll": "Todos",
  "admin.kits.lang": "Idioma do kit",
  "admin.kits.langHint":
    "O assistente consulta apenas o acervo do idioma da mesa. Um kit registrado em PT não aparece em mesas EN.",
  "admin.kits.langPt": "Português",
  "admin.kits.langEn": "English",
  "admin.kits.categoriesHint":
    "As categorias usadas para agrupar o conteúdo ficam na tela de taxonomia.",
  "admin.kits.empty": "Nenhum kit registrado ainda.",
  "admin.kits.records": "{n} registros no catálogo",
  "admin.kits.new": "Registrar kit",
  "admin.kits.name": "Nome do kit",
  "admin.kits.namePh": "Ex.: Fantasia sombria",
  "admin.kits.slug": "Identificador (slug)",
  "admin.kits.slugPh": "Opcional — gerado do nome",
  "admin.kits.tech": "Nível tecnológico",
  "admin.kits.techPh": "Ex.: TL3",
  "admin.kits.accent": "Cor de destaque",
  "admin.kits.accentPh": "#c9a227",
  "admin.kits.description": "Descrição",
  "admin.kits.descriptionPh": "O que este pacote entrega ao narrador",
  "admin.kits.sort": "Ordem",
  "admin.kits.submit": "Registrar kit",
  "admin.kits.saved": "Kit registrado.",
  "admin.kits.submitError": "Não foi possível registrar o kit.",

  "admin.categories.eyebrow": "Catálogo · taxonomia",
  "admin.categories.title": "Categorias",
  "admin.categories.hint":
    "A árvore que agrupa perícias, itens, vantagens, desvantagens, NPCs e locais no assistente.",
  "admin.categories.empty": "Nenhuma categoria registrada ainda.",
  "admin.categories.root": "raiz",
  "admin.categories.rootsLabel": "raízes",
  "admin.categories.childrenLabel": "subcategorias",
  "admin.categories.new": "Registrar categoria",
  "admin.categories.domain": "Domínio",
  "admin.categories.parent": "Categoria pai",
  "admin.categories.parentNone": "Nenhuma — criar raiz",
  "admin.categories.name": "Identificador (slug)",
  "admin.categories.namePh": "Ex.: combat",
  "admin.categories.display": "Nome exibido",
  "admin.categories.displayPh": "Ex.: Combate",
  "admin.categories.sort": "Ordem",
  "admin.categories.submit": "Registrar categoria",
  "admin.categories.saved": "Categoria registrada.",
  "admin.categories.submitError": "Não foi possível registrar a categoria.",
  "admin.categories.noParents": "Nenhuma raiz neste domínio ainda.",

  "admin.domain.skill": "Perícias",
  "admin.domain.item": "Itens",
  "admin.domain.advantage": "Vantagens",
  "admin.domain.disadvantage": "Desvantagens",
  "admin.domain.npc": "NPCs",
  "admin.domain.location": "Locais",

  "admin.form.required": "Preencha os campos obrigatórios.",
  "admin.error.generic": "Algo deu errado.",
};

export const EN: Record<string, string> = {
  "admin.eyebrow": "Catalog · superadmin",
  "admin.title": "The Ring",
  "admin.subtitle":
    "Here you maintain the catalog taxonomy and the kits every new narrator sees when creating a table.",
  "admin.guidanceTitle": "How the catalog works",
  "admin.guidanceBody":
    "Categories are global; kits belong to one language. The new-table wizard only offers the catalog for the table's chosen language.",
  "admin.guidanceKits":
    "Kits are closed content packages (fantasy, cyberpunk...). Each language keeps its own set of packages.",
  "admin.guidanceCategories":
    "Categories organize the catalog by domain and subcategory, so narrators can filter what they install.",
  "admin.baseTables": "Base tables",
  "admin.baseTablesHint":
    "The seeded sample tables now belong to the seeded narrator and install the kits of their own language.",
  "admin.backHub": "My tables",
  "admin.badge": "Base table",

  "admin.nav.categories": "Categories",
  "admin.nav.kits": "Kits",

  "admin.hub.eyebrow": "Superadmin ring",
  "admin.hub.body": "Register kits by language and keep the catalog taxonomy.",
  "admin.hub.open": "Open panel",

  "admin.kits.eyebrow": "Catalog · packages",
  "admin.kits.title": "Kits",
  "admin.kits.pageSubtitle":
    "Each narrator installs one or more kits when creating a table. The catalog is split by language: EN tables only receive EN kits, PT tables only receive PT kits.",
  "admin.kits.hint": "Packages narrators can install whole when creating a table.",
  "admin.kits.open": "Manage kits",
  "admin.kits.filter": "Filter by language",
  "admin.kits.filterAll": "All",
  "admin.kits.lang": "Kit language",
  "admin.kits.langHint":
    "The wizard only reads the catalog of the table's language. A kit registered in PT never appears in EN tables.",
  "admin.kits.langPt": "Português",
  "admin.kits.langEn": "English",
  "admin.kits.categoriesHint":
    "The categories used to group content live on the taxonomy screen.",
  "admin.kits.empty": "No kit registered yet.",
  "admin.kits.records": "{n} catalog records",
  "admin.kits.new": "Register kit",
  "admin.kits.name": "Kit name",
  "admin.kits.namePh": "E.g. Dark fantasy",
  "admin.kits.slug": "Identifier (slug)",
  "admin.kits.slugPh": "Optional — generated from the name",
  "admin.kits.tech": "Tech level",
  "admin.kits.techPh": "E.g. TL3",
  "admin.kits.accent": "Accent color",
  "admin.kits.accentPh": "#c9a227",
  "admin.kits.description": "Description",
  "admin.kits.descriptionPh": "What this package gives the narrator",
  "admin.kits.sort": "Order",
  "admin.kits.submit": "Register kit",
  "admin.kits.saved": "Kit registered.",
  "admin.kits.submitError": "Could not register the kit.",

  "admin.categories.eyebrow": "Catalog · taxonomy",
  "admin.categories.title": "Categories",
  "admin.categories.hint":
    "The tree that groups skills, items, advantages, disadvantages, NPCs and places in the wizard.",
  "admin.categories.empty": "No category registered yet.",
  "admin.categories.root": "root",
  "admin.categories.rootsLabel": "roots",
  "admin.categories.childrenLabel": "subcategories",
  "admin.categories.new": "Register category",
  "admin.categories.domain": "Domain",
  "admin.categories.parent": "Parent category",
  "admin.categories.parentNone": "None — create a root",
  "admin.categories.name": "Identifier (slug)",
  "admin.categories.namePh": "E.g. combat",
  "admin.categories.display": "Display name",
  "admin.categories.displayPh": "E.g. Combat",
  "admin.categories.sort": "Order",
  "admin.categories.submit": "Register category",
  "admin.categories.saved": "Category registered.",
  "admin.categories.submitError": "Could not register the category.",
  "admin.categories.noParents": "No root in this domain yet.",

  "admin.domain.skill": "Skills",
  "admin.domain.item": "Items",
  "admin.domain.advantage": "Advantages",
  "admin.domain.disadvantage": "Disadvantages",
  "admin.domain.npc": "NPCs",
  "admin.domain.location": "Places",

  "admin.form.required": "Fill in the required fields.",
  "admin.error.generic": "Something went wrong.",
};
