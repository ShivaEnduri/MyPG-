import { AxiosResponse } from "axios";
import { axiosInstance } from "../../network/axiosInstance";
import { buildApiUrl } from "../utils/apiHelper";


// ── Types ────────────────────────────────────────────────────────────────────

export interface SocialLoginPayload {
  idToken: string;
}

export interface SocialLoginResponse {
  isProfileIncomplete?: boolean;
  mergedAccount?: boolean;
  customToken?: string;
  user?: Record<string, unknown>;
}
 
export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  gender_id: string;
  dob: string;
  location: string;
}


export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface SocialLoginResponse {
  isProfileIncomplete?: boolean;
  mergedAccount?: boolean;
  customToken?: string;
  user?: Record<string, unknown>;
}

export interface GetMeResponse {
  user: {
    mobile_no?: string;
    gender_id?: string;
    [key: string]: unknown;
  };
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

/* ===================== HELPERS ===================== */

type QueryParams = Record<string, string | number | undefined>;

/* ===================== API CALLS ===================== */

export const socialLoginApi = async (
  payload: SocialLoginPayload
): Promise<AxiosResponse<SocialLoginResponse>> => {
  const url = buildApiUrl("/social-login", "auth");
  return axiosInstance.post(url, payload);
};
export const getMeApi = async (idToken?: string) => {
  const url = buildApiUrl("/me", "auth");
  
  return axiosInstance.get(url, {
    // If token passed explicitly, use it — otherwise interceptor handles it
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
  });
};
export const updateProfileApi = async (
  payload: UpdateProfilePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/profile", "auth");
  return axiosInstance.patch(url, payload);
};

export const sendOtpApi = async (
  payload: SendOtpPayload
): Promise<AxiosResponse<OtpResponse>> => {
  const url = buildApiUrl("/send-otp", "otp");
  return axiosInstance.post(url, payload);
};

export const verifyOtpApi = async (
  payload: VerifyOtpPayload
): Promise<AxiosResponse<OtpResponse>> => {
  const url = buildApiUrl("/verify-otp", "otp");
  return axiosInstance.post(url, payload);
};

