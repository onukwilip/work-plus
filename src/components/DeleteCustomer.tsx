import { deleteCustomerAction } from "@/store/customersReducer";
import { modalActions } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { CustomerType, SelectorType } from "../../types";

const DeleteCustomer: React.FC<{ id: string; customer: CustomerType }> = ({
  id,
  customer,
}) => {
  const dispatch = useDispatch();
  const deletingCustomer: boolean = useSelector<SelectorType>(
    (state) => state.customers.deleting
  ) as boolean;
  const displayModal = () => {
    dispatch(
      modalActions.display({
        component: DeleteCustomer as React.FC<unknown>,
        properties: { id },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const deleteCustomer = () => {
    // DELETE THE CUSTOMER
    dispatch(
      deleteCustomerAction(id, () => {
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
        Delete customer: <b>{customer.name}</b>?
      </Header>
      <Modal.Content>
        <p style={{ textAlign: "center" }}>
          Are you sure you want to delete this customer with name{" "}
          <b>{customer.name}</b> and email <b>{customer.email}</b>? This action
          cannot be undone!
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={closeModal}
          disabled={deletingCustomer}
        >
          <Icon name="remove" /> No
        </Button>
        <Button
          color="red"
          inverted
          onClick={deleteCustomer}
          disabled={deletingCustomer}
        >
          <Icon name="checkmark" /> {deletingCustomer ? "Deleting..." : "Yes"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteCustomer;
