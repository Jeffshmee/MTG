import YAML from "yaml"
import { QuartzTransformerPlugin } from "../types"

export type CardMetaFields = {
  mana_cost?: string
  cmc?: number
  type?: string
  quantity?: number
  status?: string
}

const YAML_FENCE = /```yaml\r?\n([\s\S]*?)```/i
const INFOCARD_COST = /\*\*Mana Cost:\*\*\s*(.+)/i
const INFOCARD_TYPE = /\*\*Type:\*\*\s*(.+)/i
const INFOCARD_STATUS = /\*\*Status:\*\*\s*(.+)/i

function stripCalloutPrefix(block: string): string {
  return block.replace(/^>\s?/gm, "")
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }
  return undefined
}

function asNumber(value: unknown): number | undefined {
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

function cmcFromCost(cost: string): number {
  const face = cost.split("//")[0] ?? cost
  let total = 0
  const re = /\{([^}]+)\}/g
  let match: RegExpExecArray | null
  while ((match = re.exec(face))) {
    const inner = match[1].trim()
    if (/^X$/i.test(inner)) {
      continue
    }
    if (/^\d+$/.test(inner)) {
      total += Number(inner)
      continue
    }
    if (/^2\//i.test(inner)) {
      total += 2
      continue
    }
    total += 1
  }
  return total
}

function isEmptyCost(value: string): boolean {
  const trimmed = value.trim()
  return trimmed === "" || trimmed === "—" || trimmed === "-" || trimmed === "–"
}

export function parseCardMeta(src: string): CardMetaFields | null {
  const meta: CardMetaFields = {}

  const yamlMatch = src.match(YAML_FENCE)
  if (yamlMatch) {
    try {
      const parsed = YAML.parse(stripCalloutPrefix(yamlMatch[1]))
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const rec = parsed as Record<string, unknown>
        const cost = asString(rec.mana_cost)
        if (cost !== undefined) {
          meta.mana_cost = cost
        }
        const cmc = asNumber(rec.cmc)
        if (cmc !== undefined) {
          meta.cmc = cmc
        }
        const type = asString(rec.type)?.trim()
        if (type) {
          meta.type = type
        }
        const quantity = asNumber(rec.quantity)
        if (quantity !== undefined) {
          meta.quantity = quantity
        }
      }
    } catch {
      // Fall through to Infocard fields.
    }
  }

  if (meta.mana_cost === undefined) {
    const costLine = src.match(INFOCARD_COST)?.[1]?.trim()
    if (costLine !== undefined) {
      meta.mana_cost = isEmptyCost(costLine) ? "" : costLine
    }
  }

  if (meta.type === undefined) {
    const typeLine = src.match(INFOCARD_TYPE)?.[1]?.trim()
    if (typeLine) {
      meta.type = typeLine
    }
  }

  const statusLine = src.match(INFOCARD_STATUS)?.[1]?.trim()
  if (statusLine) {
    meta.status = statusLine
  }

  if (meta.cmc === undefined && meta.mana_cost !== undefined) {
    meta.cmc = isEmptyCost(meta.mana_cost) ? 0 : cmcFromCost(meta.mana_cost)
  }

  return Object.keys(meta).length > 0 ? meta : null
}

export const CardMeta: QuartzTransformerPlugin = () => ({
  name: "CardMeta",
  markdownPlugins() {
    return [
      () => (_tree, file) => {
        const src = String(file.value ?? "")
        const meta = parseCardMeta(src)
        if (!meta) {
          return
        }
        file.data.frontmatter ??= { title: "" }
        const fm = file.data.frontmatter as unknown as Record<string, unknown>
        for (const [key, value] of Object.entries(meta)) {
          if (fm[key] === undefined || fm[key] === null || fm[key] === "") {
            fm[key] = value
          }
        }
      },
    ]
  },
})
