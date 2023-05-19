import "@logseq/libs"
import type { UISlotIdentity } from "@logseq/libs/dist/LSPlugin.user"
import { setup, t } from "logseq-l10n"
import { render } from "preact"
import Preview from "./comps/Preview"
import { t2i } from "./libs/api"
import zhCN from "./translations/zh-CN.json"

let lastResult: string | undefined = ""
let lastPrompt = ""

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
    .kef-drawit-preview {
      position: relative;
    }
    .kef-drawit-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: var(--ls-primary-background-color);
      padding: 0.3em 0.5em;
      box-shadow: 0 0 6px 0 var(--ls-block-bullet-color);
      display: flex;
      align-items: center;
    }
    .kef-drawit-toolbar-btn {
      margin-right: 0.9em;
      font-size: 0.75em;
      opacity: 0.8;
    }
    .kef-drawit-toolbar-btn:last-child {
      margin-right: 0;
    }
    .kef-drawit-toolbar-btn:hover {
      opacity: 1;
    }
    `,
  })
}

async function drawIt() {
  if (lastResult == null) return
  lastResult = undefined
  try {
    const block = await logseq.Editor.getCurrentBlock()
    if (block == null) return
    const hasRenderer = block.content.includes("\n{{renderer :drawit}}")
    const prompt = hasRenderer
      ? block.content.replace("\n{{renderer :drawit}}", "")
      : block.content
    const t2iPromise = t2i(prompt)
    if (!hasRenderer) {
      await logseq.Editor.insertAtEditingCursor("\n{{renderer :drawit}}")
    } else {
      renderPreview(block.uuid)
    }
    await logseq.Editor.exitEditingMode()
    const [ok, image] = await t2iPromise
    if (!ok) return
    lastResult = image
    lastPrompt = prompt
    renderPreview(block.uuid)
  } catch (err) {
    lastResult = ""
  }
}

async function redrawIt(uuid: string) {
  if (lastResult == null) return
  lastResult = undefined
  try {
    renderPreview(uuid)
    const [ok, image] = await t2i(lastPrompt)
    if (!ok) return
    lastResult = image
    renderPreview(uuid)
  } catch (err) {
    lastResult = ""
  }
}

function previewRenderer({
  slot,
  payload: { arguments: args, uuid },
}: UISlotIdentity & { payload: { arguments: string[]; uuid: string } }) {
  if (args[0] !== ":drawit") return

  const slotEl = parent.document.getElementById(slot)
  if (!slotEl) return
  const renderered = slotEl.childElementCount > 0
  if (renderered) return

  logseq.provideUI({
    key: `drawit`,
    slot,
    template: `<div id="kef-drawit-preview"></div>`,
    reset: true,
  })

  setTimeout(() => renderPreview(uuid), 0)
}

function renderPreview(uuid: string) {
  const el = parent.document.getElementById("kef-drawit-preview")
  if (el == null) return
  render(
    <Preview image={lastResult} blockUUID={uuid} redrawIt={redrawIt} />,
    el,
  )
}

logseq.ready(main).catch(console.error)
