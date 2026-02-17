import axios from 'axios';
import InternetPermission from '../components/InternetPermission';
import { BASE_URL } from '../constants/Utils';

const _REQUEST2SERVER = async (
  url,
  params = null,
  method = 'GET',
  isFormData = false,
) => {
  try {
    const isInternetGranted =
      await InternetPermission.checkInternetPermissions();

    if (!isInternetGranted) {
      return {
        success: false,
        message: 'No Internet Connection',
      };
    }

    const config = {
      method: method,
      url: BASE_URL + url,
      headers: isFormData
        ? {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        : {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
      data: params,
    };

    console.log('API CONFIG =>', config);

    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.log('API ERROR =>', error?.response || error);

    return {
      success: false,
      message:
        error?.response?.data?.message || 'Server Error. Try again later.',
    };
  }
};

// ✅ Signup API (IMPORTANT → isFormData = true)
export const onSignUPAPICall = params => {
  return _REQUEST2SERVER(`lawyer/signup/`, params, 'POST', true);
};

export const onLoginAPICall = params => {
  return _REQUEST2SERVER(`login/send-otp/`, params, 'POST');
};

export const onVerifyOtpAPICall = params => {
  return _REQUEST2SERVER(`login/verify-otp/`, params, 'POST');
};

export default {
  onSignUPAPICall,
  onLoginAPICall,
  onVerifyOtpAPICall,
};
