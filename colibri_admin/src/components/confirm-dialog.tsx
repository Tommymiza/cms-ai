'use client'
import { Button } from './button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './dialog'

export default function ConfirmDialog(
    { open, message, onCancel, onConfirm }: 
    { open: boolean, message: string, onCancel: () => void, onConfirm: () => void }
) {
    
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogBody>
                <p>{message}</p>
            </DialogBody>
            <DialogActions>
                <Button onClick={onCancel}>Annuler</Button>
                <Button onClick={onConfirm}>Confirmer</Button>
            </DialogActions>
        </Dialog>
    )
}