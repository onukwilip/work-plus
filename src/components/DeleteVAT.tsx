import { deleteVATAction } from "@/store/vatReducer";
import { modalActions } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { VATType, SelectorType } from "../../types";

const DeleteVAT: React.FC<{ id: string; vat: VATType }> = ({ id, vat }) => {
  const dispatch = useDispatch();
  const deletingVAT: boolean = useSelector<SelectorType>(
    (state) => state.vat.deleting
  ) as boolean;
  const displayModal = () => {
    dispatch(
      modalActions.display({
        component: DeleteVAT as React.FC<unknown>,
        properties: { id },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const deleteVAT = () => {
    // DELETE THE CUSTOMER
    dispatch(
      deleteVATAction(id, () => {
        closeModal();
      }) as unknown as AnyAction
    );
  };

  return (
    <Modal
      basic
      onClose={closeModal}
      onOpen={displayModal}
      open={true}
      size="small"
      trigger={<Button>Basic Modal</Button>}
      dimmer="blurring"
    >
      <Header icon>
        <Icon name="user delete" color="red" />
        Delete VAT: <b>{vat.description}</b>?
      </Header>
      <Modal.Content>
        <p style={{ textAlign: "center" }}>
          Are you sure you want to delete this VAT with description{" "}
          <b>{vat.description}</b> and price <b>{vat["unit price"]}</b>? This
          action cannot be undone!
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={closeModal}
          disabled={deletingVAT}
        >
          <Icon name="remove" /> No
        </Button>
        <Button color="red" inverted onClick={deleteVAT} disabled={deletingVAT}>
          <Icon name="checkmark" /> {deletingVAT ? "Deleting..." : "Yes"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteVAT;
