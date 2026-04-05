// src/components/Modal.jsx
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

export default function Modal({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}