// apps/rentals/src/utils/api/apiCrud.ts
import axios from "axios";
import { buildApiUrl } from "./apiHelper";
import apiStatusConstants from "./apiStatus";

export const addNewRecord = async (
  tableName: string,
  fieldNames: string[],
  fieldValues: any[]
) => {
  const response = await axios.post(
    // buildApiUrl("/addNewRecord", null, true),
    buildApiUrl("/addNewRecord", "common"),
    { tableName, fieldNames, fieldValues }
  );
  return response;
};

export const addProperty = async (propertyData: any, images: File[]) => {
  const formData = new FormData();
  formData.append("propertyData", JSON.stringify(propertyData));
  images.forEach((img) => formData.append("images", img));

  const response = await axios.post(
    buildApiUrl("/AddProperty", "user"),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response;
};

export const updateProperty = async (
  propertyId: number,
  propertyData: any,
  newImages: File[] = [],
  removedImages: number[] = []
) => {
  const formData = new FormData();
  const payload = {
    property_id: propertyId,
    removedImages,
    ...propertyData,
  };
  formData.append("propertyData", JSON.stringify(payload));
  newImages.forEach((file) => formData.append("images", file));

  const response = await axios.put(
    buildApiUrl("/updateProperty", "user"),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteRecord = async (tableName: string, whereCondition: string) => {
  const response = await axios.delete(buildApiUrl("/deleteRecord", "common"), {
    data: { tableName, whereCondition },
  });
  return response;
};

export const getRecords = async (
  tableName: string,
  fieldNames: string[],
  additionalParams: Record<string, any> = {}
) => {
  const whereCondition = Object.entries(additionalParams)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND");

  const response = await axios.get(buildApiUrl("/getRecords", "common"), {
    params: { tableName, fieldNames, whereCondition: whereCondition || null },
  });
  return response.data.result;
};

// Add other reusable functions here: addRequest, fetchFilteredProperties, etc.