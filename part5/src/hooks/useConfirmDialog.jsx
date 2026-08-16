// hooks/useConfirmDialog.js
import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'

const useConfirmDialog = () => {
  const [dialogConfig, setDialogConfig] = useState(null)

  const confirmDialog = (message) => {
    return new Promise((resolve) => {
      setDialogConfig({
        message,
        onConfirm: () => {
          setDialogConfig(null)
          resolve(true)
        },
        onCancel: () => {
          setDialogConfig(null)
          resolve(false)
        }
      })
    })
  }

  const DialogComponent = dialogConfig ? (
    <ConfirmDialog
      message={dialogConfig.message}
      onConfirm={dialogConfig.onConfirm}
      onCancel={dialogConfig.onCancel}
    />
  ) : null

  return { confirmDialog, DialogComponent }
}

export default useConfirmDialog
