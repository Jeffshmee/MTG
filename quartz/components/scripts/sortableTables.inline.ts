document.addEventListener("nav", () => {
  const tables = document.querySelectorAll<HTMLTableElement>("article table, .markdown-rendered table")
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
    if (manaCol >= 0) {
      sortTable(table, manaCol, "asc")
    }
  }
})

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
  rows.sort((a, b) => dir * cmp(cellValue(a.cells[col]), cellValue(b.cells[col])))
  for (const row of rows) {
    tbody.append(row)
  }
}

function cellValue(cell: HTMLTableCellElement | undefined): string {
  return (cell?.textContent ?? "").trim()
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
