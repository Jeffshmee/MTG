import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { FolderTable } from "./quartz/components/FolderTable"
import type { PageTypePluginEntry } from "./quartz/plugins/types"

const config = await loadQuartzConfig()

// FolderPage always owns pageBody (blog-style PageList). YAML layout cannot replace it.
for (const plugin of config.plugins.pageTypes ?? []) {
  if (plugin.name === "FolderPage") {
    ;(plugin as PageTypePluginEntry).body = FolderTable
  }
}

export default config
export const layout = await loadQuartzLayout()
