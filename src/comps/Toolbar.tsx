import { t } from "logseq-l10n"

export default function Toolbar({
  onRegenerate,
  onInsert,
  onDiscard,
}: {
  onRegenerate: () => void
  onInsert: () => void
  onDiscard: () => void
}) {
  return (
    <div class="kef-drawit-toolbar">
      <button class="kef-drawit-toolbar-btn" onClick={onRegenerate}>
        {t("Regenerate")}
      </button>
      <button class="kef-drawit-toolbar-btn" onClick={onInsert}>
        {t("Insert")}
      </button>
      <button class="kef-drawit-toolbar-btn" onClick={onDiscard}>
        {t("Discard")}
      </button>
    </div>
  )
}
