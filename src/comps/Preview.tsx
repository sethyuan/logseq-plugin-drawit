import { useEffect, useRef, useState } from "preact/hooks"
import { progress } from "../libs/api"

const INTERVAL = 1000

export default function Preview({ image }: { image?: string }) {
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

  return (
    <div>
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
    </div>
  )
}
