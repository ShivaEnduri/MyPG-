export interface BaseUserForm {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  mobile: string;
  password: string;
  permanentAddress: string;
  state_id: string;
  city_id: string;
  pincode: string;
}

export interface UserBaseFormProps<T extends BaseUserForm> {
  form: T;
  update: <K extends keyof T>(key: K, value: T[K]) => void;
  states: any[];
  cities: any[];
  genders: any[];
  showPassword?: boolean;
  setShowPassword?: (v: boolean) => void;
   pgList?: any[];
  hideLogin?: boolean; 
}
