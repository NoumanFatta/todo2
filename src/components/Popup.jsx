import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Grow } from "@mui/material";


const TransitionGrow = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="left" ref={ref} {...props} />;
});

const Popup = ({
  children,
  open,
  handleClose,
  className,
  modalWidth = "lg",
  fullWidth,
}) => {
  
  return (
    <Dialog
      fullWidth={fullWidth}
      className={className}
      maxWidth={modalWidth}
      open={open}
      TransitionComponent={TransitionGrow}
      onClose={handleClose}
      container={document.getElementById("modal")}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
Popup.defaultProps = { fullWidth: true };
export default Popup;
