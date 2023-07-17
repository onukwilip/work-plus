import { deleteMaterialAction } from "@/store/materialsReducer";
import { modalActions } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { MaterialType, SelectorType } from "../../types";

const DeleteMaterial: React.FC<{ id: string; material: MaterialType }> = ({
  id,
  material,
}) => {
  const dispatch = useDispatch();
  const deletingMaterial: boolean = useSelector<SelectorType>(
    (state) => state.materials.deleting
  ) as boolean;
  const displayModal = () => {
    dispatch(
      modalActions.display({
        component: DeleteMaterial as React.FC<unknown>,
        properties: { id },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const deleteMaterial = () => {
    // DELETE THE CUSTOMER
    dispatch(
      deleteMaterialAction(id, () => {
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
        Delete material: <b>{material.description}</b>?
      </Header>
      <Modal.Content>
        <p style={{ textAlign: "center" }}>
          Are you sure you want to delete this material with description{" "}
          <b>{material.description}</b> and price{" "}
          <b>{material["unit price"]}</b>? This action cannot be undone!
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={closeModal}
          disabled={deletingMaterial}
        >
          <Icon name="remove" /> No
        </Button>
        <Button
          color="red"
          inverted
          onClick={deleteMaterial}
          disabled={deletingMaterial}
        >
          <Icon name="checkmark" /> {deletingMaterial ? "Deleting..." : "Yes"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteMaterial;
