document.addEventListener("nav", () => {
  const tables = document.querySelectorAll<HTMLTableElement>(
    "article table, .markdown-rendered table, .page-listing table, table.folder-index-table",
  )
  for (const table of tables) {
    const headRow = table.tHead?.rows[0] ?? table.querySelector("tr")
    if (!headRow || table.dataset.sortReady === "true") {
      continue
    }
    table.dataset.sortReady = "true"
    table.classList.add("sortable")
    const headers = [...headRow.cells]
    headers.forEach((th, col) => {
      th.tabIndex = 0
      th.addEventListener("click", () => sortTable(table, col))
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          sortTable(table, col)
        }
      })
    })
    const manaCol = headers.findIndex((th) => /^\s*mana\s*$/i.test(th.textContent ?? ""))
    const typeCol = headers.findIndex((th) => isTypeHeader(th.textContent ?? ""))
    if (manaCol >= 0) {
      sortTable(table, manaCol, "asc")
    } else if (typeCol >= 0) {
      sortTable(table, typeCol, "asc")
    }
  }
})

const TYPE_BUCKETS: [string, number][] = [
  ["creature", 0],
  ["planeswalker", 1],
  ["instant", 2],
  ["sorcery", 3],
  ["enchantment", 4],
  ["artifact", 5],
  ["battle", 6],
  ["land", 7],
]

function isTypeHeader(text: string): boolean {
  return /^(card\s*type|creature\s*type|type)$/i.test(text.trim())
}

function typeBucketKey(value: string): string {
  const lower = value.toLowerCase()
  for (const [name, n] of TYPE_BUCKETS) {
    if (lower.startsWith(name) || new RegExp(`\\b${name}\\b`).test(lower)) {
      return `${n}-${value}`
    }
  }
  return `8-${value}`
}

function sortTable(table: HTMLTableElement, col: number, force?: "asc" | "desc") {
  const tbody = table.tBodies[0]
  if (!tbody) {
    return
  }
  const ths = table.tHead?.rows[0]?.cells ?? table.querySelector("tr")?.cells
  if (!ths) {
    return
  }
  const th = ths[col]
  const next = force ?? (th.dataset.sort === "asc" ? "desc" : "asc")
  for (const cell of Array.from(ths)) {
    delete cell.dataset.sort
  }
  th.dataset.sort = next
  const rows = [...tbody.rows]
  const dir = next === "asc" ? 1 : -1
  const typeCol = isTypeHeader(th.textContent ?? "")
  rows.sort((a, b) => {
    const av = cellValue(a.cells[col])
    const bv = cellValue(b.cells[col])
    if (typeCol) {
      return dir * typeBucketKey(av).localeCompare(typeBucketKey(bv), undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    return dir * cmp(av, bv)
  })
  for (const row of rows) {
    tbody.append(row)
  }
}

function cellValue(cell: HTMLTableCellElement | undefined): string {
  return (cell?.dataset.sort ?? cell?.textContent ?? "").trim()
}

function cmp(a: string, b: string): number {
  const na = parseFloat(a.replace(/[^0-9.-]/g, ""))
  const nb = parseFloat(b.replace(/[^0-9.-]/g, ""))
  const aNum = a !== "" && !Number.isNaN(na) && /[0-9]/.test(a)
  const bNum = b !== "" && !Number.isNaN(nb) && /[0-9]/.test(b)
  if (aNum && bNum) {
    return na - nb
  }
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}
