import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../context";

interface ModalProps {}

class Modal extends React.Component<ModalProps> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    render() {
        return (
            <Dialog
                open={this.context.modal?.show || false}
                onClose={() => {
                    if (typeof this.context.modal?.onClose === "function") {
                        this.context.modal.onClose();
                    }
                    this.context.closeModal();
                }}
                maxWidth={this.context.modal?.size || 'md'}
                scroll={this.context.modal?.scrollable ? 'paper' : 'body'}
                fullWidth
            >
                <DialogTitle>
                    {this.context.modal?.titulo}
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            if (typeof this.context.modal?.onClose === "function") {
                                this.context.modal.onClose();
                            }
                            this.context.closeModal();
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {this.context.modal?.conteudo}
                </DialogContent>
            </Dialog>
        );
    }
}

export default Modal;
