export const activeOpacity = 0.9;
export const API_INTERNET_CONNECTION_CAPTION_EN =
  'Sorry, No Internet connectivity detected. Please reconnect and try again';

// export const BASE_URL = 'http://192.168.1.20:5000/';
// export const BASE_URL = 'https://jantasarkar.saubhagyam.org/mobile/'; //live
export const BASE_URL = 'http://192.168.1.10:8000/mobile/'; //local

// export const IMAGE_BASE_URL = 'http://192.168.1.17:8080/spibo/storage/';
export const IMAGE_BASE_URL = 'https://jantasarkar.saubhagyam.org/mobile//';
export const DOBFormat = 'DD-MM-YYYY';
export const dateTime = 'DD-MM-YYYY   hh:mm A';
export const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateFormCheck = text => {
  if (!text) return false;
  return regEmail.test(text);
};
