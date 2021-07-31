import Contact from "Classes/Contact/Contact";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "Redux/actions/contacts";
import { closeAddContactModal } from "Redux/actions/modals";
import { IInitialState } from "Redux/types/states";
import TextField from "Ui-Kit/Form/FormField/TextField";
import Modal from "Ui-Kit/Modal/Modal";
import "./styles.css";
const AddContactModal = () => {
  const show = useSelector(
    (state: IInitialState) => state.modals.add_contact.show
  );
  const dispatch = useDispatch();

  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [public_key, set_public_key] = useState("");

  const submit = () => {
    const contact = new Contact({
      id: 0,
      first_name,
      last_name,
      public_key,
      advertiser_host_ids: [],
      relay_host_ids: [],
    });
    contact.store();
    dispatch(addContact(contact));
    dispatch(closeAddContactModal());
  };
  return (
    <Modal
      show={show}
      close={() => {
        dispatch(closeAddContactModal());
      }}
    >
      <div className="add-contact__form">
        <TextField
          label="first name"
          placeHolder="green"
          value={first_name}
          onChange={set_first_name}
          validations={[{ type: "REQUIRED" }]}
        />
        <TextField
          label="last name"
          placeHolder="fox"
          value={last_name}
          onChange={set_last_name}
          validations={[{ type: "REQUIRED" }]}
        />
        <TextField
          label="public key"
          placeHolder="paste the client public key here"
          value={public_key}
          onChange={set_public_key}
          validations={[{ type: "REQUIRED" }]}
        />
      </div>
      <div className="submit-row flex flex-row justify-center">
        <button
          className="submit-btn border-2 border-secondary rounded-md hover:bg-secondary hover:text-white mb-4"
          onClick={submit}
        >
          submit
        </button>
      </div>
    </Modal>
  );
};

export default AddContactModal;
