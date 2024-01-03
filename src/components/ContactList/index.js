import { useState } from 'react';
import Contact from '../Contact';
import './contactList.css';
import ApiService from "../../services/apiService";

const ContactList = ({ contacts, onSetContacts,refetchContacts, editContact }) => {
  const [checkedIds, setCheckedIds] = useState([]);

  const checkAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      const checkedIdsArray = contacts.map(contact => contact.id);
      setCheckedIds(checkedIdsArray);
    }
    else setCheckedIds([])
  }

  const toggleContactFromList = (e, contactId) => {
    const { checked } = e.target;
    if (!checked) {
      setCheckedIds((ids) => {
        const newIdsArray = ids.filter(id => contactId !== id);
        return newIdsArray;
      });
    }
    else {
      setCheckedIds((ids) => {
        const withNewId = [...ids, contactId];
        return withNewId;
      });
    }
  }

  const handleDeleteChecked = async () => {
    if(checkedIds.length) {
      await ApiService.deleteContactByIds(checkedIds);
      refetchContacts(checkedIds);
      setCheckedIds([])
    }
  }

  return (
    <table>
      <caption>Contacts</caption>
      <thead>
        <tr>
          <th><input type="checkbox" onChange={checkAll} checked={checkedIds.length && checkedIds.length === contacts.length} /></th>
          <th><i className="fa fa-trash-o delete-all" onClick={handleDeleteChecked} /></th>
          <th></th>
          <th>Name</th>
          <th>Phone number</th>
        </tr>
      </thead>
      <tbody>
        {
          contacts.map((contact, i) => <Contact
              onToggleContactFromList={toggleContactFromList}
              checkedIds={checkedIds}
              contactData={contact}
              refetchContacts={refetchContacts}
              editContact={editContact}
              key={`contact-${i}`}
          />)
        }

      </tbody>
    </table>
  )
}

export default ContactList;