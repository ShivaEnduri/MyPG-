// apps/rentals/src/utils/api/apiStatus.ts

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
  failure: "FAILURE",
} as const;

export type ApiStatus = typeof apiStatusConstants[keyof typeof apiStatusConstants];

export default apiStatusConstants;