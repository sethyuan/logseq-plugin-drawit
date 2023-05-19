import "@logseq/libs"
import type { UISlotIdentity } from "@logseq/libs/dist/LSPlugin.user"
import { setup, t } from "logseq-l10n"
import { render } from "preact"
import Preview from "./comps/Preview"
import { t2i } from "./libs/api"
import zhCN from "./translations/zh-CN.json"

let lastResult: string | undefined = ""

async function main() {
  await setup({ builtinTranslations: { "zh-CN": zhCN } })

  provideStyles()

  logseq.useSettingsSchema([
    {
      key: "drawShortcut",
      title: "",
      type: "string",
      default: "mod+d mod+d",
      description: t("Shortcut that triggers drawing."),
    },
    {
      key: "apiHost",
      title: "",
      type: "string",
      default: "http://127.0.0.1:7860",
      description: t("API host."),
    },
    {
      key: "promptPrefix",
      title: "",
      type: "string",
      default: "masterpiece, best quality",
      description: t("Prefix that's added to all prompts."),
    },
    {
      key: "negativePrompt",
      title: "",
      type: "string",
      default: "NSFW, worst quality, low quality, lowres",
      description: t("Negative prompt."),
    },
    {
      key: "sampler",
      title: "",
      type: "string",
      default: "Euler a",
      description: t("Sampler to use."),
    },
    {
      key: "steps",
      title: "",
      type: "number",
      default: 20,
      description: t("Steps."),
    },
    {
      key: "width",
      title: "",
      type: "number",
      default: 512,
      description: t("Image width."),
    },
    {
      key: "height",
      title: "",
      type: "number",
      default: 512,
      description: t("Image height."),
    },
  ])

  logseq.Editor.registerSlashCommand("Draw It", drawIt)
  logseq.App.registerCommandPalette(
    {
      key: "kef-drawit-draw",
      label: t("Draw It"),
      ...(logseq.settings?.drawShortcut
        ? { keybinding: { binding: logseq.settings.drawShortcut } }
        : {}),
    },
    drawIt,
  )

  logseq.App.onMacroRendererSlotted(previewRenderer)

  console.log("#drawit loaded")
}

function provideStyles() {
  logseq.provideStyle({
    key: "kef-drawit",
    style: `
    `,
  })
}

async function drawIt() {
  if (lastResult == null) return
  lastResult = undefined
  try {
    const prompt = await logseq.Editor.getEditingBlockContent()
    const t2iPromise = t2i(prompt)
    await logseq.Editor.insertAtEditingCursor("\n{{renderer :drawit}}")
    await logseq.Editor.exitEditingMode()
    const [ok, image] = await t2iPromise
    if (!ok) return
    lastResult = image
    renderPreview()
  } catch (err) {
    lastResult = ""
  }
}

function previewRenderer({
  slot,
  payload: { arguments: args },
}: UISlotIdentity & { payload: { arguments: string[] } }) {
  if (args[0] !== ":drawit") return

  const slotEl = parent.document.getElementById(slot)
  if (!slotEl) return
  const renderered = slotEl.childElementCount > 0
  if (renderered) return

  logseq.provideUI({
    key: `drawit`,
    slot,
    template: `<div id="kef-drawit-preview" class="kef-drawit-preview"></div>`,
    reset: true,
  })

  setTimeout(renderPreview, 0)
}

function renderPreview() {
  const el = parent.document.getElementById("kef-drawit-preview")
  if (el == null) return
  render(<Preview image={lastResult} />, el)
}

logseq.ready(main).catch(console.error)
