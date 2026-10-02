function openHaulHash(hash: string) {
  if (!hash) {
    return
  }
  let id = hash
  try {
    id = decodeURIComponent(hash)
  } catch {
    id = hash
  }
  const el = document.getElementById(id)
  const details = el?.closest("details.haul-fold")
  if (details instanceof HTMLDetailsElement) {
    details.open = true
  }
}

function onHaulLinkClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) {
    return
  }
  const anchor = target.closest("a")
  if (!anchor) {
    return
  }
  let url: URL
  try {
    url = new URL(anchor.href)
  } catch {
    return
  }
  if (url.pathname !== window.location.pathname || !url.hash) {
    return
  }
  openHaulHash(url.hash.slice(1))
}

function onHaulNav() {
  const raw = window.location.hash.replace(/^#/, "")
  if (!raw) {
    return
  }
  openHaulHash(raw)
  let id = raw
  try {
    id = decodeURIComponent(raw)
  } catch {
    id = raw
  }
  document.getElementById(id)?.scrollIntoView()
}

const flag = "__mtgHaulFolds"
if (!(flag in window)) {
  Object.defineProperty(window, flag, { value: true })
  document.addEventListener("click", onHaulLinkClick, true)
  document.addEventListener("nav", onHaulNav)
}
