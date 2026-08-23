import type { Element, ElementContent, Root } from "hast"
import type { VFile } from "vfile"
import { QuartzTransformerPlugin } from "../types"
import { resolveRelative, type FullSlug } from "../../util/path"

function nestPrefix(slug: string): string | null {
  if (slug === "commander/maralen" || slug.startsWith("commander/maralen/")) {
    return "commander/maralen"
  }
  if (slug === "commander/zurgo" || slug.startsWith("commander/zurgo/")) {
    return "commander/zurgo"
  }
  if (slug === "collection" || slug.startsWith("collection/")) {
    return "collection"
  }
  return null
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

function vaultTail(href: string): string {
  let p = href.split("#")[0].split("?")[0]
  p = p.replace(/^https?:\/\/[^/]+/i, "")
  p = p.replace(/^\/MTG\//i, "/")
  p = p.replace(/^\//, "")
  const parts = p.split("/").filter((s) => s.length > 0 && s !== ".")
  while (parts[0] === "..") {
    parts.shift()
  }
  return parts.join("/")
}

function pickSlug(current: string, tail: string, all: Set<string>): string | null {
  if (!tail) {
    return null
  }
  const prefix = nestPrefix(current)
  const prefixed = prefix ? `${prefix}/${tail}` : tail
  if (all.has(prefixed)) {
    return prefixed
  }
  if (all.has(tail)) {
    return tail
  }
  const matches = [...all].filter((s) => s === tail || s.endsWith("/" + tail))
  if (prefix) {
    const prefer = matches.filter((s) => s === prefix || s.startsWith(prefix + "/"))
    if (prefer.length >= 1) {
      prefer.sort((a, b) => b.length - a.length)
      return prefer[0]
    }
  }
  if (matches.length === 1) {
    return matches[0]
  }
  return null
}

function walk(node: Root | Element, current: string, all: Set<string>) {
  if (!node.children) {
    return
  }
  for (const child of node.children as ElementContent[]) {
    if (child.type !== "element") {
      continue
    }
    const el = child as Element
    if (el.tagName === "a" && classList(el).includes("internal")) {
      const href = String(el.properties?.href ?? "")
      if (!href || href.startsWith("http") || href.startsWith("mailto:")) {
        continue
      }
      const hash = href.includes("#") ? "#" + href.split("#").slice(1).join("#") : ""
      const tail = vaultTail(href)
      const dest = pickSlug(current, tail, all)
      if (dest) {
        el.properties = el.properties ?? {}
        el.properties.href = resolveRelative(current as FullSlug, dest as FullSlug) + hash
        el.properties["data-slug"] = dest
      }
    }
    walk(el, current, all)
  }
}

export const VaultLinks: QuartzTransformerPlugin = () => ({
  name: "VaultLinks",
  htmlPlugins(ctx) {
    return [
      () => (tree: Root, file: VFile) => {
        const current = String(file.data.slug ?? "")
        if (!current) {
          return
        }
        const all = new Set((ctx.allSlugs ?? []).map(String))
        walk(tree, current, all)
      },
    ]
  },
})
