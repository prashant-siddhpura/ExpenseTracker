import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Settings = () => {
  const { userSettings, updateUserSettings } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(''); // For previewing the image
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (userSettings) {
      setDisplayName(userSettings.display_name || '');
      setPhotoPreview(userSettings.photo ? `data:image/jpeg;base64,${userSettings.photo}` : '');
      setPreferredCurrency(userSettings.preferred_currency || 'USD');
      setDarkMode(userSettings.dark_mode || false);
    }
  }, [userSettings]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Preview the image locally
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('display_name', displayName);
    if (photoFile) formData.append('photo', photoFile); // Append file if selected
    formData.append('preferred_currency', preferredCurrency);
    formData.append('dark_mode', darkMode.toString());

    try {
      await updateUserSettings(formData); // Pass FormData directly
      
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="budget-management-container">
          <h1 style={{fontSize:"30px"}}>Profile</h1>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div>
              <label style={{fontSize:"18px"}} htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name..."
              />
            </div>
            <div>
              <label style={{fontSize:"18px" , marginRight:"15px"}} htmlFor="photoFile">Profile Photo : </label>
              <input
                type="file"
                id="photoFile"
                accept="image/*"
                onChange={handleFileChange}
              />
              {photoPreview && (
                <div className="mt-2">
                  <img src={photoPreview} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full" />
                </div>
              )}
            </div>
            <div>
              <label style={{fontSize:"16px"}} htmlFor="currency">Preferred Currency</label>
              <select
                id="currency"
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:"18px" , marginRight:"5px"}} htmlFor="darkMode">Dark Mode</label>
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            </div>
            <button className="btn" type="submit">
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};  