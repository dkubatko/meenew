import sharedStyles from "@/app/components/shared/shared.module.css";

export default function Backdrop(onClick: () => void) {
  return (
    <div
      className={sharedStyles.backdrop}
      onClick={onClick}
    />
  )
}