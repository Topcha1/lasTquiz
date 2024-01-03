import axios from "axios";

class ApiService {
  static apiBase = process.env.REACT_APP_API_BASE;

  static async login(userData) {
    const res = await axios.post(`${ApiService.apiBase}/login`, userData);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return true;
  }

  static async createContact(userData) {
    const token = localStorage.getItem("token");
    await axios.post(`${ApiService.apiBase}/create`, userData,{
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    return true;
  }

  static async updateContact(userData) {
    const token = localStorage.getItem("token");
    await axios.put(`${ApiService.apiBase}/update/${userData.id}`, {userData},{
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    return true;
  }

  static async deleteContactByContactId(id) {
    const token = localStorage.getItem("token");
    await axios.delete(`${ApiService.apiBase}/delete/${id}`,{
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    return true;
  }

  static async deleteContactByIds(ids) {
    const token = localStorage.getItem("token");
    await axios.post(`${ApiService.apiBase}/delete/many`,{
      ids
    },{
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    return true;
  }


  static async getContacts(user_id) {
    const token = localStorage.getItem("token");
    const contacts = await axios.get(`${ApiService.apiBase}/contacts?user_id=${user_id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    return contacts.data;
  }

  static async userInfo() {
    const token = localStorage.getItem("token");
    const user = await axios.get(`${ApiService.apiBase}/me`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    return user.data;
  }
}

export default ApiService;