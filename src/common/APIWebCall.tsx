// Withdraw history API (paginated)
export const onWithdrawHistoryAPICall = (page = 1) => {
  return _REQUEST2SERVER(
    `mobile/advisor/withdraw-requests/?page=${page}`,
    null,
    'GET',
    false,
    true,
  );
};
// Withdraw request API
export const onWithdrawRequestAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/advisor/withdrawrequest/`,
    params,
    'POST',
    false,
    true,
  );
};
// Get crowd attendance for a user (admin API)
export const onAdminUserCrowdAttendanceAPICall = userId => {
  return _REQUEST2SERVER(
    `admin_api/users/${userId}/crowd-attendance/`,
    null,
    'GET',
    false,
    true,
  );
};
import axios from 'axios';
import InternetPermission from '../components/InternetPermission';
import { BASE_URL } from '../constants/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sanitizeValue = (value: any) => {
  if (typeof value !== 'string') {
    return value;
  }

  // Prevent accidental encoded quotes like %22 from malformed stored values.
  return value.trim().replace(/^"+|"+$/g, '');
};

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

    let headers: any = isFormData
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
      const rawToken = await AsyncStorage.getItem('token');
      const token = sanitizeValue(rawToken);
      console.log('token=========', token);

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const normalizedUrl = sanitizeValue(url);
    const requestUrl = /^https?:\/\//i.test(normalizedUrl)
      ? normalizedUrl
      : `${BASE_URL}${normalizedUrl}`;

    const config: any = {
      method: method,
      url: requestUrl,
      headers: headers,
      timeout: 20000,
    };

    if (String(method).toUpperCase() !== 'GET' && params != null) {
      config.data = params;
    }

    console.log('API CONFIG =>', config);

    const response = await axios(config);

    return response.data;
  } catch (error: any) {
    console.log('API ERROR =>', error?.response || error);
    console.log('API ERROR CODE =>', error?.code);
    console.log('API ERROR MESSAGE =>', error?.message);
    console.log('API ERROR URL =>', error?.config?.url);
    console.log('API ERROR STATUS =>', error?.response?.status);
    console.log('API ERROR DATA =>', error?.response?.data);
    console.log('API ERROR REQUEST =>', error?.request);
    console.log('API ERROR TO_JSON =>', error?.toJSON?.());

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
    `mobile/update-advisorprofile/${userId}/`,
    params,
    'PATCH', // ✅ PATCH method
    true,
    false,
  );
};

export const onLoginAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/advisor/login/send-otp/`,
    params,
    'POST',
    false,
    false,
  );
};

export const onVerifyOtpAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/advisor/login/verify-otp/`,
    params,
    'POST',
    false,
    false,
  );
};
export const onCommunityFeedAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/community-complaint/`,
    params,
    'POST',
    false,
    true,
  );
};
export const onAdvisorComplaintsAPICall = (
  latitude = null,
  longitude = null,
) => {
  const hasCoordinates =
    typeof latitude === 'number' && typeof longitude === 'number';
  const query = hasCoordinates
    ? `?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(
        longitude,
      )}`
    : '';

  return _REQUEST2SERVER(
    `mobile/advisor/complaints/${query}`,
    null,
    'GET',
    false,
    true,
  );
};
export const onAdvisorOngoingAPICall = () => {
  return _REQUEST2SERVER(`mobile/onging/`, null, 'GET', false, true);
};
export const onAdvisorHistoryAPICall = () => {
  return _REQUEST2SERVER(`mobile/history/`, null, 'GET', false, true);
};
export const oncityListAPICall = () => {
  return _REQUEST2SERVER(`mobile/city-list/`, null, 'GET', false, true);
};
export const onDepartmentAPICall = () => {
  return _REQUEST2SERVER(`departments/?all=true`, null, 'GET', false, false);
};
export const onProfileAPICall = () => {
  return _REQUEST2SERVER(`mobile/profile/`, null, 'GET', false, true);
};
export const onCommunityFeedListAPICall = () => {
  return _REQUEST2SERVER(
    `mobile/community-complaint/`,
    null,
    'GET',
    false,
    true,
  );
};

export const onUploadDocumentsAPICall = formData => {
  return _REQUEST2SERVER(
    `mobile/advisordocument-upload/`,
    formData,
    'POST',
    true,
    true,
  );
};

export const onGetUploadedDocumentsAPICall = () => {
  return _REQUEST2SERVER(
    `mobile/advisordocument-upload/`,
    null,
    'GET',
    false,
    true,
  );
};

export const onApproveComplaintAPICall = complaintId => {
  return _REQUEST2SERVER(
    `mobile/complaint-request/approved/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onCompletedComplaintAPICall = complaintId => {
  return _REQUEST2SERVER(
    `mobile/completed/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onRequestRejectAPICall = complaintId => {
  return _REQUEST2SERVER(
    `mobile/complaint-reject/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};
export const onComplaintCancelAPICall = complaintId => {
  return _REQUEST2SERVER(
    `mobile/complaint-cancel/${complaintId}/`,
    null,
    'POST',
    false,
    true,
  );
};

export const onRegisterFCMTokenAPICall = fcmToken => {
  return _REQUEST2SERVER(
    `mobile/notification/fcm-token/`,
    { token: fcmToken },
    'POST',
    false,
    true,
  );
};
export const onNotificationSettingAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/notification-setting/`, // ⚠️ use same prefix as other APIs
    params,
    'PATCH',
    false,
    true, // ✅ requires token
  );
};

export const onDashboardAPICall = () => {
  return _REQUEST2SERVER(
    `mobile/advisor/dashboard/`,
    null,
    'GET',
    false,
    true, // ✅ assuming dashboard requires auth token
  );
};

export const onExchangeListAPICall = () => {
  return _REQUEST2SERVER(`/mobile/exchange/list/`, null, 'GET', false, true);
};

export const onExchangeCreateAPICall = params => {
  return _REQUEST2SERVER(
    `/mobile/exchange/create/`,
    params,
    'POST',
    false,
    true,
  );
};

export const onCrowdAttendanceAPICall = (crowdId, formData) => {
  return _REQUEST2SERVER(
    `mobile/crowd/${crowdId}/attendance/`,
    formData,
    'POST',
    true,
    true,
  );
};

export const onAddBankDetailsAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/advisor/add-bank/`,
    params,
    'POST',
    false,
    true,
  );
};

export const onGetBankDetailsAPICall = () => {
  return _REQUEST2SERVER(
    `mobile/advisor/bank-details/`,
    null,
    'GET',
    false,
    true,
  );
};

export const onNotificationListAPICall = () => {
  return _REQUEST2SERVER(`mobile/notification-list/`, null, 'GET', false, true);
};

export const onPaymentHistoryAPICall = () => {
  return _REQUEST2SERVER(
    `mobile/advisor/payment-history/`,
    null,
    'GET',
    false,
    true,
  );
};

export const onPageContentAPICall = type => {
  return _REQUEST2SERVER(
    `mobile/page/?type=${encodeURIComponent(type)}`,
    null,
    'GET',
    false,
    false,
  );
};

export const onBloodRequestCreateAPICall = params => {
  return _REQUEST2SERVER(
    `mobile/blood-request/create/`,
    params,
    'POST',
    false,
    true,
  );
};

export const onBloodRequestListAPICall = (cityId = null, bloodGroup = null) => {
  const queryParts: string[] = [];
  if (cityId) queryParts.push(`city_id=${encodeURIComponent(cityId)}`);
  if (bloodGroup)
    queryParts.push(`blood_group=${encodeURIComponent(bloodGroup)}`);
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return _REQUEST2SERVER(
    `mobile/blood-request/list/${query}`,
    null,
    'GET',
    false,
    true,
  );
};

export const onUserAdvisorListAPICall = (
  page = 1,
  caste: string | null = null,
  gender: string | null = null,
  businessName: string | null = null,
) => {
  const queryParts: string[] = [`page=${page}`];
  if (caste) queryParts.push(`caste=${encodeURIComponent(caste)}`);
  if (gender) queryParts.push(`gender=${encodeURIComponent(gender)}`);
  if (businessName)
    queryParts.push(`business_name=${encodeURIComponent(businessName)}`);
  return _REQUEST2SERVER(
    `mobile/user-advisor/list/?${queryParts.join('&')}`,
    null,
    'GET',
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
  onDepartmentAPICall,
  onCommunityFeedAPICall,
  onProfileAPICall,
  onCommunityFeedListAPICall,
  onUploadDocumentsAPICall,
  onGetUploadedDocumentsAPICall,
  onRegisterFCMTokenAPICall,
  onNotificationSettingAPICall,
  onDashboardAPICall,
  onExchangeListAPICall,
  onExchangeCreateAPICall,
  onCrowdAttendanceAPICall,
  onAddBankDetailsAPICall,
  onGetBankDetailsAPICall,
  onNotificationListAPICall,
  onPaymentHistoryAPICall,
  onPageContentAPICall,
  onBloodRequestCreateAPICall,
  onBloodRequestListAPICall,
  onUserAdvisorListAPICall,
};
