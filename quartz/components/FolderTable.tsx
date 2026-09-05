import type { Element, Root } from "hast"
import { i18n } from "../i18n"
import { costNodes } from "../plugins/transformers/manaPips"
import { QuartzPluginData } from "../plugins/vfile"
import type { BuildTimeTrieData } from "../util/ctx"
import type { FileTrieNode } from "../util/fileTrie"
import { htmlToJsx } from "../util/jsx"
import { FilePath, FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type FolderRow = QuartzPluginData & { slug?: string }

function titleOf(page: FolderRow): string {
  const title = page.frontmatter?.title
  if (typeof title === "string" && title && title !== "index") {
    return title
  }
  const slug = page.slug ?? ""
  const parts = slug.replace(/\/index$/, "").split("/")
  return parts[parts.length - 1] || slug
}

function fmString(page: FolderRow, key: string): string | undefined {
  const value = (page.frontmatter as Record<string, unknown> | undefined)?.[key]
  return typeof value === "string" ? value : undefined
}

function fmNumber(page: FolderRow, key: string): number | undefined {
  const value = (page.frontmatter as Record<string, unknown> | undefined)?.[key]
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value)
    if (Number.isFinite(n)) {
      return n
    }
  }
  return undefined
}

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

function typeBucketKey(value: string): string {
  const lower = value.toLowerCase()
  for (const [name, n] of TYPE_BUCKETS) {
    if (lower.startsWith(name) || new RegExp(`\\b${name}\\b`).test(lower)) {
      return `${n}-${value}`
    }
  }
  return `8-${value}`
}

function sortFolderRows(a: FolderRow, b: FolderRow): number {
  const aFolder = isFolderPath(a.slug ?? "")
  const bFolder = isFolderPath(b.slug ?? "")
  if (aFolder && !bFolder) {
    return -1
  }
  if (!aFolder && bFolder) {
    return 1
  }
  const at = fmString(a, "type") ?? ""
  const bt = fmString(b, "type") ?? ""
  if (at || bt) {
    const byType = typeBucketKey(at).localeCompare(typeBucketKey(bt), undefined, {
      numeric: true,
      sensitivity: "base",
    })
    if (byType !== 0) {
      return byType
    }
  }
  return titleOf(a).localeCompare(titleOf(b), undefined, { numeric: true, sensitivity: "base" })
}

function pagesFromTrie(
  folder: FileTrieNode<BuildTimeTrieData>,
  showSubfolders: boolean,
): FolderRow[] {
  return folder.children
    .map((node) => {
      const nodeData = node.data
      if (nodeData) {
        if ((nodeData as FolderRow & { unlisted?: boolean }).unlisted === true) {
          return undefined
        }
        return nodeData as FolderRow
      }
      if (node.isFolder && showSubfolders) {
        return {
          slug: node.slug,
          frontmatter: { title: node.displayName, tags: [] },
        } as FolderRow
      }
      return undefined
    })
    .filter((page): page is FolderRow => page !== undefined)
}

function pagesFromAllFiles(allFiles: QuartzPluginData[], folderSlug: string, showSubfolders: boolean): FolderRow[] {
  const folderPrefix = folderSlug.endsWith("/index")
    ? folderSlug.slice(0, -"index".length)
    : folderSlug.endsWith("/")
      ? folderSlug
      : folderSlug + "/"
  const directChildren: FolderRow[] = []
  const subfolderFiles = new Map<string, FolderRow[]>()

  for (const file of allFiles) {
    if ((file as { unlisted?: boolean }).unlisted === true) {
      continue
    }
    const fileSlug = file.slug
    if (!fileSlug || !fileSlug.startsWith(folderPrefix)) {
      continue
    }
    const relativePath = fileSlug.slice(folderPrefix.length)
    if (!relativePath || relativePath === "index") {
      continue
    }
    const segments = relativePath.split("/")
    if (segments.length === 1) {
      directChildren.push(file)
    } else if (showSubfolders) {
      const subfolderName = segments[0]
      const list = subfolderFiles.get(subfolderName) ?? []
      list.push(file)
      subfolderFiles.set(subfolderName, list)
    }
  }

  for (const [subfolderName, files] of subfolderFiles) {
    const indexFile = files.find((f) => f.slug === `${folderPrefix}${subfolderName}/index`)
    if (indexFile) {
      continue
    }
    directChildren.push({
      slug: `${folderPrefix}${subfolderName}/index` as FullSlug,
      frontmatter: { title: subfolderName, tags: [] },
    } as unknown as FolderRow)
  }

  return directChildren
}

function ManaCost({ value }: { value: string }) {
  const trimmed = value.trim()
  if (!trimmed || trimmed === "—" || trimmed === "-" || trimmed === "–") {
    return "—"
  }
  return costNodes(trimmed).map((node, i) => {
    if (node.type === "text") {
      return node.value
    }
    const el = node as Element
    return (
      <img
        key={i}
        class="mana-pip"
        src={String(el.properties?.src ?? "")}
        alt={String(el.properties?.alt ?? "")}
      />
    )
  })
}

const FolderTable: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const ctx = props.ctx
    const slug = fileData?.slug
    if (!slug) {
      return null
    }

    const trie = ctx?.trie
    let rows: FolderRow[]
    if (trie) {
      const folder = trie.findNode(slug.split("/"))
      if (!folder) {
        return null
      }
      rows = pagesFromTrie(folder, true)
    } else {
      rows = pagesFromAllFiles(allFiles ?? [], slug, true)
    }

    rows = [...rows].sort(sortFolderRows)

    const showCost = rows.some((row) => fmString(row, "mana_cost") !== undefined)
    const showType = rows.some((row) => Boolean(fmString(row, "type")))
    const showQty = rows.some((row) => fmNumber(row, "quantity") !== undefined)
    const showStatus = rows.some((row) => Boolean(fmString(row, "status")))

    const hastRoot = tree as Root
    const fp = (fileData.filePath ?? fileData.relativePath ?? "") as FilePath
    const content =
      hastRoot?.children && hastRoot.children.length > 0 ? htmlToJsx(fp, hastRoot) : null

    const cssClasses = (fileData?.frontmatter?.cssclasses ?? []) as string[]
    const classes = ["popover-hint", ...cssClasses].filter(Boolean).join(" ")
    const countText = i18n(cfg?.locale ?? "en-US").pages.folderContent.itemsUnderFolder({
      count: rows.length,
    })

    return (
      <div class={classes}>
        {content && (
          <article>
            <div class="markdown-preview-view markdown-rendered">{content}</div>
          </article>
        )}
        <div class="page-listing">
          <p class="folder-index-count">{countText}</p>
          {rows.length > 0 && (
            <div class="table-container markdown-rendered">
              <table class="folder-index-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    {showCost && <th scope="col">Cost</th>}
                    {showType && <th scope="col">Type</th>}
                    {showStatus && <th scope="col">Status</th>}
                    {showQty && <th scope="col">Qty</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((page) => {
                    const pageSlug = (page.slug ?? "") as FullSlug
                    const name = titleOf(page)
                    const folder = isFolderPath(pageSlug)
                    const cost = fmString(page, "mana_cost")
                    const type = fmString(page, "type")
                    const status = fmString(page, "status")
                    const qty = fmNumber(page, "quantity")
                    const cmc = fmNumber(page, "cmc")
                    return (
                      <tr class={folder ? "is-folder" : undefined}>
                        <td data-sort={name}>
                          <a
                            href={resolveRelative(slug as FullSlug, pageSlug)}
                            class="internal internal-link"
                          >
                            {name}
                          </a>
                        </td>
                        {showCost && (
                          <td class="folder-index-cost" data-sort={cmc !== undefined ? String(cmc) : ""}>
                            {cost !== undefined ? <ManaCost value={cost} /> : ""}
                          </td>
                        )}
                        {showType && <td data-sort={type ?? ""}>{type ?? ""}</td>}
                        {showStatus && <td data-sort={status ?? ""}>{status ?? ""}</td>}
                        {showQty && (
                          <td class="folder-index-qty" data-sort={qty !== undefined ? String(qty) : ""}>
                            {qty !== undefined ? qty : ""}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  Component.css = `
.folder-index-count {
  opacity: 0.75;
  margin: 0 0 0.75rem 0;
}
.folder-index-table {
  width: 100%;
  border-collapse: collapse;
}
`
  return Component
}

export default FolderTable
export { FolderTable }
