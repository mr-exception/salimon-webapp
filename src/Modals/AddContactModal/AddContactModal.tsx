import Contact from "Classes/Contact/Contact";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "redux/actions/contacts";
import { closeAddContactModal } from "redux/actions/modals";
import { IInitialState } from "redux/types/states";
import TextField from "ui-kit/Form/FormField/TextField";
import Modal from "ui-kit/Modal/Modal";
import "./styles.css";
const AddContactModal = () => {
  const show = useSelector(
    (state: IInitialState) => state.modals.add_contact.show
  );
  const storage = useSelector((state: IInitialState) => state.storage);
  const dispatch = useDispatch();

  const [first_name, set_first_name] = useState("");
  const [first_name_error, set_first_name_error] = useState<string>();
  const [last_name, set_last_name] = useState("");
  const [last_name_error, set_last_name_error] = useState<string>();
  const [public_key, set_public_key] = useState("");
  const [public_key_error, set_public_key_error] = useState<string>();

  const submit = () => {
    const contact = new Contact(first_name, last_name, public_key, storage);
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
          error={first_name_error}
          validations={[{ type: "REQUIRED" }]}
        />
        <TextField
          label="last name"
          placeHolder="fox"
          value={last_name}
          onChange={set_last_name}
          error={last_name_error}
          validations={[{ type: "REQUIRED" }]}
        />
        <TextField
          label="public key"
          placeHolder="paste the client public key here"
          value={public_key}
          onChange={set_public_key}
          error={public_key_error}
          validations={[{ type: "REQUIRED" }, { type: "PUBLIC_KEY" }]}
        />
      </div>
      <div className="submit-row">
        <button className="submit-btn" onClick={submit}>
          submit
        </button>
      </div>
    </Modal>
  );
};

export default AddContactModal;
