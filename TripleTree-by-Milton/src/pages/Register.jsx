import { useState } from 'react';
import '../styles/Register.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!email.trim() || !emailRegex.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!password.trim() || password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Invalid phone number.');
      return;
    }
    setPhoneError('');

    setIsLoading(true);

    const payload = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      address: address,
      phone: phoneNumber,
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(data.error || 'An error occurred during registration.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('Failed to register. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {validationErrors.firstName && <p className="error">{validationErrors.firstName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {validationErrors.lastName && <p className="error">{validationErrors.lastName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {validationErrors.email && <p className="error">{validationErrors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {validationErrors.password && <p className="error">{validationErrors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address (optional)</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <PhoneInput
            id="phoneNumber"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountry="EG"
            required
          />
          <p className="error">{phoneError || ''}</p>
        </div>
        <Button type="submit" className="register-button" variant="primary" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Register'}
        </Button>
      </form>
      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default Register;
