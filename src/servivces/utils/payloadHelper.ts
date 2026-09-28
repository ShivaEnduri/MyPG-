// ==================== Payload Helper ====================

// export const buildPayload = (fields: Record<string, any>) => ({
//   payload: {
//     fields,
//   },
// });


export const buildPayload = (fields: Record<string, any>) => ({
  data: fields,
});