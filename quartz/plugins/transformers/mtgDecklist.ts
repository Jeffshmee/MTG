import fs from "node:fs"
import path from "node:path"
import type { Element, ElementContent, Properties, Root, Text } from "hast"
import type { VFile } from "vfile"
import { resolveRelative, type FullSlug } from "../../util/path"
import { QuartzTransformerPlugin } from "../types"
import { pipsFromString } from "./manaPips"

function h(tag: string, properties: Properties, children: ElementContent[] = []): Element {
  return { type: "element", tagName: tag, properties, children }
}

function text(value: string): Text {
  return { type: "text", value }
}

function classList(node: Element): string[] {
  const raw = node.properties?.className
  if (Array.isArray(raw)) {
    return raw.map(String)
  }
  if (typeof raw === "string") {
    return raw.split(/\s+/)
  }
  return []
}

function isDecklistCode(node: Element): boolean {
  return classList(node).some(
    (cls) => cls === "decklist" || cls === "language-decklist" || cls.startsWith("language-decklist"),
  )
}

function collectText(node: Element | Text | ElementContent): string {
  if (node.type === "text") {
    return node.value
  }
  if (node.type !== "element" || !node.children) {
    return ""
  }
  return node.children.map(collectText).join("")
}

function norm(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

type CardLine = { count: number; name: string }
type Section = { title: string; cards: CardLine[] }

function sectionRank(title: string): number {
  const t = title.toLowerCase()
  if (t.startsWith("commander")) return 0
  if (t.startsWith("creature")) return 1
  if (t.startsWith("planeswalker")) return 2
  if (t.startsWith("instant")) return 3
  if (t.startsWith("sorcer")) return 4
  if (t.startsWith("enchant")) return 5
  if (t.startsWith("artifact")) return 6
  if (t.startsWith("land")) return 100
  return 50
}

function sortSections(sections: Section[]): Section[] {
  return [...sections].sort((a, b) => sectionRank(a.title) - sectionRank(b.title))
}

function parseDecklist(src: string): { legality: string; sections: Section[] } {
  let legality = ""
  const sections: Section[] = []
  let current: Section | null = null

  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith("//")) {
      continue
    }

    const meta = line.match(/^(group|legality)\s*:\s*(.+)$/i)
    if (meta) {
      if (meta[1].toLowerCase() === "legality") {
        legality = meta[2].trim()
      }
      continue
    }

    if (line.startsWith("#")) {
      current = { title: line.replace(/^#+\s*/, ""), cards: [] }
      sections.push(current)
      continue
    }

    const card = line.match(/^(\d+)x?\s+(.+)$/i)
    if (!card) {
      continue
    }
    if (!current) {
      current = { title: "Deck", cards: [] }
      sections.push(current)
    }
    current.cards.push({ count: Number(card[1]), name: card[2].trim() })
  }

  return { legality, sections: sortSections(sections) }
}

function sortCardsByCmc(sections: Section[], cmc: Map<string, number>) {
  for (const section of sections) {
    section.cards.sort((a, b) => {
      const d = (cmc.get(norm(a.name)) ?? 99) - (cmc.get(norm(b.name)) ?? 99)
      return d !== 0 ? d : a.name.localeCompare(b.name)
    })
  }
}

function buildCardIndex(
  contentDir: string,
  files: string[],
): { mana: Map<string, string>; cmc: Map<string, number> } {
  const mana = new Map<string, string>()
  const cmc = new Map<string, number>()
  for (const fp of files) {
    const posix = fp.replace(/\\/g, "/")
    if (!/02[- ]cards/i.test(posix) || !posix.toLowerCase().endsWith(".md")) {
      continue
    }
    const abs = path.isAbsolute(fp) ? fp : path.join(contentDir, fp)
    let raw = ""
    try {
      raw = fs.readFileSync(abs, "utf8")
    } catch {
      continue
    }
    const base = norm(path.basename(posix, ".md"))
    const costMatch = raw.match(/\*\*Mana Cost:\*\*\s*(.+)/)
    const cost = costMatch?.[1]?.trim() ?? ""
    if (cost.includes("{")) {
      mana.set(base, cost)
    }
    const cmcMatch = raw.match(/^>\s*cmc:\s*(\d+)/m) ?? raw.match(/^cmc:\s*(\d+)/m)
    if (cmcMatch) {
      cmc.set(base, Number(cmcMatch[1]))
    }
  }
  return { mana, cmc }
}

function buildNameIndex(slugs: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const slug of slugs) {
    if (!slug.includes("02-cards/")) {
      continue
    }
    const last = slug.split("/").pop()
    if (!last || last === "index") {
      continue
    }
    const key = norm(last)
    const list = map.get(key) ?? []
    list.push(slug)
    map.set(key, list)
  }
  return map
}

function pickSlug(name: string, currentSlug: FullSlug | undefined, index: Map<string, string[]>): string | undefined {
  const slugs = index.get(norm(name))
  if (!slugs || slugs.length === 0) {
    return undefined
  }
  const key = currentSlug?.includes("maralen/")
    ? "maralen/"
    : currentSlug?.includes("zurgo/")
      ? "zurgo/"
      : ""
  const match = slugs.find((s) => (key ? s.includes(key) : true))
  return match ?? slugs[0]
}

function cardNameNode(
  name: string,
  currentSlug: FullSlug | undefined,
  index: Map<string, string[]>,
): ElementContent {
  const slug = pickSlug(name, currentSlug, index)
  if (!slug || !currentSlug) {
    return text(name)
  }
  const href = resolveRelative(currentSlug, slug as FullSlug)
  return h(
    "a",
    {
      className: ["internal", "internal-link"],
      href,
      "data-slug": slug,
    },
    [text(name)],
  )
}

function renderDecklist(
  src: string,
  currentSlug: FullSlug | undefined,
  index: Map<string, string[]>,
  mana: Map<string, string>,
  cmc: Map<string, number>,
): Element {
  const { legality, sections } = parseDecklist(src)
  sortCardsByCmc(sections, cmc)
  const total = sections.reduce(
    (sum, section) => sum + section.cards.reduce((s, card) => s + card.count, 0),
    0,
  )
  const label = [legality ? legality[0].toUpperCase() + legality.slice(1) : "", total ? `${total} cards` : ""]
    .filter(Boolean)
    .join(" · ")

  const children: ElementContent[] = []
  if (label) {
    children.push(h("div", { className: ["mtg-decklist-meta"] }, [text(label)]))
  }

  const columns: ElementContent[] = []
  for (const section of sections) {
    const count = section.cards.reduce((s, card) => s + card.count, 0)
    const items: ElementContent[] = section.cards.map((card) => {
      const row: ElementContent[] = [
        h("span", { className: ["qty"] }, [text(String(card.count))]),
        cardNameNode(card.name, currentSlug, index),
      ]
      const cost = mana.get(norm(card.name))
      if (cost) {
        const pips = pipsFromString(cost)
        if (pips.length > 0) {
          row.push(h("span", { className: ["mtg-decklist-mana"] }, pips))
        }
      }
      return h("li", {}, row)
    })
    columns.push(
      h("section", { className: ["mtg-decklist-section"] }, [
        h("h3", {}, [
          text(section.title),
          h("span", { className: ["mtg-decklist-count"] }, [text(` ${count}`)]),
        ]),
        h("ul", {}, items),
      ]),
    )
  }
  children.push(h("div", { className: ["mtg-decklist-columns"] }, columns))

  return h("div", { className: ["mtg-decklist"] }, children)
}

function walk(
  node: Root | Element,
  currentSlug: FullSlug | undefined,
  index: Map<string, string[]>,
  mana: Map<string, string>,
  cmc: Map<string, number>,
) {
  if (!node.children) {
    return
  }
  const next: ElementContent[] = []
  for (const child of node.children) {
    if (child.type === "element" && child.tagName === "pre") {
      const code = child.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "code",
      )
      if (code && isDecklistCode(code)) {
        next.push(renderDecklist(collectText(code), currentSlug, index, mana, cmc))
        continue
      }
    }
    if (child.type === "element") {
      walk(child, currentSlug, index, mana, cmc)
    }
    next.push(child as ElementContent)
  }
  node.children = next as typeof node.children
}

export const MtgDecklist: QuartzTransformerPlugin = () => ({
  name: "MtgDecklist",
  htmlPlugins(ctx) {
    const index = buildNameIndex(ctx.allSlugs ?? [])
    const { mana, cmc } = buildCardIndex(ctx.argv.directory, (ctx.allFiles ?? []).map(String))
    return [
      () => (tree: Root, file: VFile) => {
        const slug = file.data.slug as FullSlug | undefined
        walk(tree, slug, index, mana, cmc)
      },
    ]
  },
})
