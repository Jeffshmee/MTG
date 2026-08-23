import type { Element, ElementContent, Root, Text } from "hast"
import { QuartzTransformerPlugin } from "../types"

const SKIP = new Set(["code", "pre", "script", "style", "textarea"])

// `{W}`, `{10}`, `{W/U}`, `{W/P}`, `{2/W}`, `{T}`, `{C}`, …
const PIP =
  /\{(2\/[WUBRG]|[WUBRG]\/[WUBRGP]|[0-9]{1,3}|[WUBRGCXYZSTQEHP])\}/g

const VALID = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "100",
  "W",
  "U",
  "B",
  "R",
  "G",
  "C",
  "T",
  "Q",
  "E",
  "S",
  "X",
  "Y",
  "Z",
  "P",
  "H",
  "WU",
  "UB",
  "BR",
  "RG",
  "GW",
  "WB",
  "UR",
  "BG",
  "RW",
  "GU",
  "WP",
  "UP",
  "BP",
  "RP",
  "GP",
  "2W",
  "2U",
  "2B",
  "2R",
  "2G",
  "HW",
  "HR",
])

function scryfallCode(inner: string): string {
  const code = inner.replaceAll("/", "").toUpperCase()
  if (VALID.has(code)) {
    return code
  }
  if (code.length === 2) {
    const flipped = code[1] + code[0]
    if (VALID.has(flipped)) {
      return flipped
    }
  }
  return code
}

function pipImg(raw: string, code: string): Element {
  return {
    type: "element",
    tagName: "img",
    properties: {
      className: ["mana-pip"],
      src: `https://svgs.scryfall.io/card-symbols/${code}.svg`,
      alt: raw,
    },
    children: [],
  }
}

export function pipsFromString(value: string): Element[] {
  return splitPips(value).filter((node): node is Element => node.type === "element")
}

function splitPips(value: string): ElementContent[] {
  if (!value.includes("{")) {
    return [{ type: "text", value }]
  }

  const parts: ElementContent[] = []
  let last = 0
  PIP.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = PIP.exec(value))) {
    const code = scryfallCode(match[1])
    if (!VALID.has(code)) {
      continue
    }
    if (match.index > last) {
      parts.push({ type: "text", value: value.slice(last, match.index) })
    }
    parts.push(pipImg(match[0], code))
    last = match.index + match[0].length
  }

  if (parts.length === 0) {
    return [{ type: "text", value }]
  }
  if (last < value.length) {
    parts.push({ type: "text", value: value.slice(last) })
  }
  return parts
}

function stripMtgInString(value: string): string {
  return value.replace(/mtg:/g, "")
}

function stripMtgPrefix(node: Root | Element) {
  if (!node.children) {
    return
  }
  for (const child of node.children) {
    if (child.type === "text" && child.value.includes("mtg:")) {
      child.value = stripMtgInString(child.value)
      continue
    }
    // OFM injects callout titles as raw HTML; rehype-raw has not parsed them yet
    // when this plugin runs first.
    const raw = child as { type?: string; value?: string }
    if (raw.type === "raw" && typeof raw.value === "string" && raw.value.includes("mtg:")) {
      raw.value = stripMtgInString(raw.value)
      continue
    }
    if (child.type === "element") {
      stripMtgPrefix(child)
    }
  }
}

function walk(node: Root | Element) {
  if (!node.children) {
    return
  }
  if (node.type === "element" && SKIP.has(String(node.tagName))) {
    return
  }

  const next: ElementContent[] = []
  for (const child of node.children) {
    if (child.type === "text") {
      next.push(...splitPips((child as Text).value))
    } else if (child.type === "element") {
      walk(child)
      next.push(child)
    } else {
      next.push(child)
    }
  }
  node.children = next
}

export const ManaPips: QuartzTransformerPlugin = () => ({
  name: "ManaPips",
  // Infocard titles are `mtg:Name`. Strip the prefix before markdown so OFM
  // callout HTML never contains it.
  textTransform(_ctx, src) {
    return src.replaceAll("`mtg:", "`")
  },
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        stripMtgPrefix(tree)
        walk(tree)
      },
    ]
  },
})
