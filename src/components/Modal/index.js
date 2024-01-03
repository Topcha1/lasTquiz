import {useEffect, useState} from 'react';
import './modal.css';
import ApiService from "../../services/apiService";

const Modal = ({ onSetModalIsOn, onSetContacts, userId, fillToEdit, updatedContacts }) => {

  const [userInput, setUserInput] = useState({ name: '', phoneNumber: '' });
  useEffect(() => {
    // Set initial values when editing a contact
    if (fillToEdit) {
      setUserInput(fillToEdit); // Assuming fillToEdit contains the contact data to be edited
    }
  }, [fillToEdit]);
  const createNewContact = (e) => {
    const { value, name } = e.target
    setUserInput((userInput) => ({ id: Date.now(), ...userInput, [name]: value }));
    console.log(userInput,"userInput")
  }

  const addNewContactToList = async () => {
    const payload= {...userInput, user_id: userId}
    await ApiService.createContact(payload);
    onSetContacts((previousContacts) => {
      previousContacts.push(payload);
      return previousContacts;
    })
    onSetModalIsOn(false);
  }

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setUserInput((prevUserInput) => ({ ...prevUserInput, [name]: value }));
  };
  const editNewContactToList = () => {
    onSetModalIsOn(false);
    const payload = { ...userInput, user_id: userId };
    updatedContacts(payload)
  }
  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => onSetModalIsOn(false)}>&times;</span>
        <h2 style={{ textAlign: "center" }}>{fillToEdit ? 'Edit contact' : 'Add new Contact'}</h2>
        <div className='userInputWrapper'>
          <input type='text' name='name' placeholder='Name' value={userInput.name} onInput={handleInputChange} />
        </div>
        <div className='userInputWrapper'>
          <input type='text' name="phoneNumber" placeholder='Phone number' value={userInput.phoneNumber}  onInput={handleInputChange} />
        </div>
        <div className='userInputWrapper'><button onClick={fillToEdit ? editNewContactToList : addNewContactToList}>{fillToEdit ? 'Edit' : 'Add'}</button></div>
      </div>
    </div>
  )
}

export default Modal;