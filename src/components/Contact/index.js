import ApiService from "../../services/apiService";

const Contact = ({ contactData, checkedIds, onToggleContactFromList,refetchContacts, editContact  }) => {

    const handleDeleteChecked = async (id) => {
        await ApiService.deleteContactByContactId(id);
        refetchContacts(id);
    }

    const handleEditChecked = async (id) => {
        editContact(id)
    }

  return (
    <tr>
      <td>
        <input type="checkbox" onChange={(e) => onToggleContactFromList(e, contactData.id)} checked={checkedIds.includes(contactData.id)} />
      </td>
      <td onClick={() => handleDeleteChecked(contactData.id)}><i className="fa fa-trash-o" /></td>
      <td onClick={() => handleEditChecked(contactData)}><i className="fa fa-pencil"></i></td>
      <td>{contactData.name}</td>
      <td>{contactData.phoneNumber}</td>
    </tr>
  )
}

export default Contact