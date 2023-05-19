import "@logseq/libs"
import { setup, t } from "logseq-l10n"
import zhCN from "./translations/zh-CN.json"

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
      default: "",
      description: t("Prompt prefix."),
    },
    {
      key: "negativePrompt",
      title: "",
      type: "string",
      default: "",
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
      description: t("Width."),
    },
    {
      key: "height",
      title: "",
      type: "number",
      default: 512,
      description: t("Height."),
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

  // logseq.beforeunload(async () => {
  //   injectionOff()
  // })

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
  // TODO
  // await logseq.Editor.insertAtEditingCursor("draw it")
}

logseq.ready(main).catch(console.error)
