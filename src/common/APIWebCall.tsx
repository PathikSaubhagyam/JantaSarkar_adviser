import axios from 'axios';
import InternetPermission from '../components/InternetPermission';
import { BASE_URL } from '../constants/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const _REQUEST2SERVER = async (
  url,
  params = null,
  method = 'GET',
  isFormData = false,
  isAuthRequired = false,
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

    let headers = isFormData
      ? {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      : {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

    // ✅ TOKEN ONLY WHEN REQUIRED
    if (isAuthRequired) {
      const token = await AsyncStorage.getItem('token');
      console.log('token=========', token);

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const config = {
      method: method,
      url: BASE_URL + url,
      headers: headers,
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
export const onSignUPAPICall = (userId, params) => {
  return _REQUEST2SERVER(
    `update-advisorprofile/${userId}/`,
    params,
    'PATCH', // ✅ PATCH method
    true,
    false,
  );
};

export const onLoginAPICall = params => {
  return _REQUEST2SERVER(
    `advisor/login/send-otp/`,
    params,
    'POST',
    false,
    false,
  );
};

export const onVerifyOtpAPICall = params => {
  return _REQUEST2SERVER(
    `advisor/login/verify-otp/`,
    params,
    'POST',
    false,
    false,
  );
};
export const onAdvisorComplaintsAPICall = () => {
  return _REQUEST2SERVER(`advisor/complaints/`, null, 'GET', false, true);
};
export const onAdvisorOngoingAPICall = () => {
  return _REQUEST2SERVER(`onging/`, null, 'GET', false, true);
};
export const onAdvisorHistoryAPICall = () => {
  return _REQUEST2SERVER(`history/`, null, 'GET', false, true);
};
export const oncityListAPICall = () => {
  return _REQUEST2SERVER(`city-list/`, null, 'GET', false, true);
};

export const onApproveComplaintAPICall = complaintId => {
  return _REQUEST2SERVER(
    `complaint-request/approved/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onCompletedComplaintAPICall = complaintId => {
  return _REQUEST2SERVER(
    `completed/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onRequestRejectAPICall = complaintId => {
  return _REQUEST2SERVER(
    `complaint-reject/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onComplaintCancelAPICall = complaintId => {
  return _REQUEST2SERVER(
    `complaint-cancel/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export default {
  onSignUPAPICall,
  onLoginAPICall,
  onVerifyOtpAPICall,
  onAdvisorComplaintsAPICall,
  onApproveComplaintAPICall,
  onAdvisorOngoingAPICall,
  onCompletedComplaintAPICall,
  onAdvisorHistoryAPICall,
  oncityListAPICall,
  onRequestRejectAPICall,
  onComplaintCancelAPICall,
};
