import { useEffect, useRef, useState } from "preact/hooks"
import { progress } from "../libs/api"
import { base64ToArrayBuffer } from "../libs/utils"
import Toolbar from "./Toolbar"

const INTERVAL = 1000

export default function Preview({
  image,
  blockUUID,
  redrawIt,
}: {
  image?: string
  blockUUID: string
  redrawIt: (uuid: string) => Promise<void>
}) {
  const [previewImage, setPreviewImage] = useState("")
  const timer = useRef<any>()

  async function updateProgress() {
    if (image != null) return
    const [ok, data] = await progress()
    if (!ok) return
    setPreviewImage(data!.current_image)
  }

  useEffect(() => {
    if (image == null) {
      timer.current = setTimeout(updateProgress, INTERVAL)
    } else {
      clearTimeout(timer.current)
    }
  })

  async function regenerate() {
    setPreviewImage("")
    redrawIt(blockUUID)
  }

  async function insertImage() {
    const storage = logseq.Assets.makeSandboxStorage()
    const arrayBuffer = base64ToArrayBuffer(image!)
    const filename = `${Date.now()}.png`
    await storage.setItem(filename, arrayBuffer as any)
    const filepath = `../assets/storages/${logseq.baseInfo.id}/${filename}`
    const block = await logseq.Editor.getBlock(blockUUID)
    if (block == null) return
    const content = block.content.replace(
      "{{renderer :drawit}}",
      `![](${filepath})`,
    )
    await logseq.Editor.updateBlock(blockUUID, content)
  }

  async function discard() {
    const block = await logseq.Editor.getBlock(blockUUID)
    if (block == null) return
    const content = block.content.replace("\n{{renderer :drawit}}", "")
    await logseq.Editor.updateBlock(blockUUID, content)
  }

  return (
    <div
      class="kef-drawit-preview"
      style={{
        width: `${logseq.settings!.width}px`,
        height: `${logseq.settings!.height}px`,
      }}
    >
      {(image || previewImage) && (
        <img
          style={{
            width: `${logseq.settings!.width}px`,
            height: `${logseq.settings!.height}px`,
          }}
          src={`data:image/png;base64,${image || previewImage}`}
          alt=""
        />
      )}

      {image && (
        <Toolbar
          onRegenerate={regenerate}
          onInsert={insertImage}
          onDiscard={discard}
        />
      )}
    </div>
  )
}
