import {axiosInstance} from "@/network/axiosInstance";
import { buildApiUrl } from "@/servivces/utils/apiHelper";
import { buildPayload } from "@/servivces/utils/payloadHelper";
import { AxiosResponse } from "axios";


export type PgAmenitiesMap = {
  id: number;
  pg_info: number;
  amns_info: number;
};

export type PgAmenitiesMapQueryParams = {
  id?: number;
  pg_info?: number;
  amns_info?: number;
};

export type AddPgAmenitiesMapPayload = {
  pg_info: number;
  amns_info: number;
};


export const getPgAmenitiesMap = (
  params?: PgAmenitiesMapQueryParams
): Promise<AxiosResponse<PgAmenitiesMap[]>> => {
  const url = buildApiUrl("/getAllRecords", "pgAmenitiesMap");

  return axiosInstance.get(url, {
    params,
  });
};

export const addPgAmenitiesMapApi = async (
  payload: AddPgAmenitiesMapPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "pgAmenitiesMap");

  return axiosInstance.post(url, buildPayload(payload));
};