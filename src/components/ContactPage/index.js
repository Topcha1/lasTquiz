import { useEffect, useState } from "react";
import ContactList from "../ContactList";
import Modal from '../Modal';
import './contactPage.css';
import ApiService from "../../services/apiService";
import { useNavigate } from "react-router";

const ContactPage = () => {
  const navigate = useNavigate();
  const [modalIsOn, setModalIsOn] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [userData, setUserData] = useState({});
  const [forEditContact, setForEditContact] = useState({});

  useEffect(() => {
    ApiService.userInfo().then(data => {
      setUserData(data);
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })
  }, [navigate]);


  useEffect(() => {
    if(!userData.id) {
      return
    }
    ApiService.getContacts(userData.id).then(data => {
      setContacts(data);
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })
  }, [navigate, userData.id]);


  const refetchContacts = (id) => {
    if(id?.length) {
      const ids = new Set(id)
      setContacts(contacts.filter(item => !ids.has(item.id)))
    } else {
      setContacts(contacts.filter(e => e.id !== id))
    }
  }
  const editContact = (contact) => {
    setModalIsOn(true)
    setForEditContact(contact)
  }

  const handleClick = (contact) => {
    setModalIsOn(true)
    setForEditContact(undefined)
  }

  const updatedContacts = async (contactsForUpdate) => {
    const updated = contacts.map(c => {
      if(c.id === contactsForUpdate.id ) {
        c.name = contactsForUpdate.name
        c.phoneNumber = contactsForUpdate.phoneNumber
      }
      return {
        ...c,
      }
    })
    await ApiService.updateContact(contactsForUpdate);
    setContacts(updated)
  }


  return (
    <>
      <button onClick={handleClick} id="add-new-contact">Add Contact</button>
      <ContactList
          contacts={contacts}
          onSetContacts={setContacts}
          refetchContacts={refetchContacts}
          editContact={editContact}
      />
      {modalIsOn && <Modal
          onSetModalIsOn={setModalIsOn}
          onSetContacts={setContacts}
          userId={userData.id}
          fillToEdit={forEditContact}
          updatedContacts={updatedContacts}
      />}
    </>

  )
}

export default ContactPage;