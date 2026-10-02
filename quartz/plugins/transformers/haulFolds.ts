import type { Element, ElementContent, Root, RootContent } from "hast"
import type { VFile } from "vfile"
import { QuartzTransformerPlugin } from "../types"

function isH2(node: RootContent): node is Element {
  return node.type === "element" && node.tagName === "h2"
}

function isHaulPage(file: VFile): boolean {
  const slug = String(file.data.slug ?? "")
  const path = String(file.data.filePath ?? file.path ?? "")
  const marker = `${slug}\n${path}`
  if (!/booster-hauls/i.test(marker) && !/Booster Hauls/i.test(marker)) {
    return false
  }
  if (/hauls-summary|booster-hauls\/0-|\(0\)\s*-\s*hauls summary/i.test(marker)) {
    return false
  }
  return true
}

export function foldHaulSections(tree: Root): void {
  const children = tree.children
  const start = children.findIndex(isH2)
  if (start < 0) {
    return
  }
  const next: RootContent[] = children.slice(0, start)
  let i = start
  while (i < children.length) {
    const node = children[i]
    if (!isH2(node)) {
      next.push(node)
      i++
      continue
    }
    const body: ElementContent[] = []
    i++
    while (i < children.length && !isH2(children[i])) {
      body.push(children[i] as ElementContent)
      i++
    }
    const details: Element = {
      type: "element",
      tagName: "details",
      properties: { className: ["haul-fold"] },
      children: [
        {
          type: "element",
          tagName: "summary",
          properties: {},
          children: [node],
        },
        ...body,
      ],
    }
    next.push(details)
  }
  tree.children = next
}

export const HaulFolds: QuartzTransformerPlugin = () => ({
  name: "HaulFolds",
  htmlPlugins() {
    return [
      () => (tree: Root, file: VFile) => {
        if (!isHaulPage(file)) {
          return
        }
        foldHaulSections(tree)
      },
    ]
  },
})
