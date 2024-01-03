import { useState } from 'react';
import './loginPage.css';
import ApiService from '../../services/apiService';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const navigate = useNavigate();
  const [err, setError] = useState("");
  const [loginData, setLoginData] = useState({ login: '', password: '' });

  const handleGetLoginData = (e) => {
    const { value, name } = e.target;
    setLoginData(loginData => {
      return {
        ...loginData,
        [name]: value
      }
    })
  };

  const handleActionLogin = async () => {
    if (!loginData.login && !loginData.password) {
      setError("All fields are required");
      return;
    }
    try {
      const loggedIn = await ApiService.login(loginData);
      if (loggedIn) navigate("/");
    }
    catch (err) {
      const { status } = err.response;
      if (status === 401) {
        setError("Invalid credentials");
        return;
      }
      setError("Ooop.. Something went wrong!");
      return;
    }
  }

  return (
    <div id='login'>
      {err && <div className='err-msg'>{err}</div>}
      <div>
        <input type="text" name="login" placeholder="your login" onInput={handleGetLoginData} />
      </div>
      <div>
        <input type="password" name="password" placeholder="your password" onInput={handleGetLoginData} />
      </div>
      <div>
        <button onClick={handleActionLogin}>Login</button>
      </div>
    </div>

  )
}

export default LoginPage;