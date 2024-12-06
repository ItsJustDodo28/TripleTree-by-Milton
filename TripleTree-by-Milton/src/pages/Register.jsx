import { useState } from 'react';
import '../styles/Register.css';
import {isValidPhoneNumber} from 'react-phone-number-input'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useNavigate } from 'react-router-dom';




function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Username:', username);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Address:', address);
    console.log('Phone Number:', phoneNumber);

    if (isValidPhoneNumber(phoneNumber)) {
      setPhoneError('');
      console.log('Valid phone number');

        /////////////////////////////////////backend sign up here
        navigate('/')

    } else {
      setPhoneError('Invalid phone number');
      console.log('Invalid phone number');
    }
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='firstName'>First Name</label>
          <input
            type='text'
            id='firstName'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='lastName'>Last Name</label>
          <input
            type='text'
            id='lastName'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='address'>Address (optional)</label>
          <input
            type='text'
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='phoneNumber'>Phone Number</label>
          <PhoneInput
            id='phoneNumber'
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountry="EG"
            required
          />
          <p className='error'>&nbsp; {phoneError ? phoneError : ''} </p>
        </div>
        <button type='submit' className='register-button'>Register</button>
      </form>
    </div>
  );
}

export default Register;