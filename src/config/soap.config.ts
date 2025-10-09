import "dotenv/config";
export const soapConfig = {
 seniorUrl: process.env.SENIOR_SOAP_URL || "",
 timeout: 30000,
 userModule: process.env.SENIOR_USER_MODULE || "G",
 productModule: process.env.SENIOR_PRODUCT_MODULE || "P",
};
