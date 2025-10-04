import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { extractSoapFields } from "../../../shared/utils/soapParser";

export class AuthService {
 private seniorClient: SeniorClient;

 constructor() {
  this.seniorClient = new SeniorClient();
 }

 async authenticate(user: string, password: string, encryption: number) {
  const response = await this.seniorClient.authenticate(
   user,
   password,
   encryption
  );

  const parsed = extractSoapFields(response, ["pmLogged", "token"]);

  // 🧠 Case 1: SOAP execution failure
  if (parsed.error) {
   return {
    success: false,
    message: parsed.message,
    details: parsed.details,
   };
  }

  const { pmLogged } = parsed.data?.pmLogged;

  // 🧠 Case 2: Invalid credentials (pmLogged = -1)
  if (pmLogged.toString() == "-1") {
   return {
    success: false,
    code: "INVALID_CREDENTIALS",
    message: "Invalid username or password.",
   };
  }

  // ✅ Case 3: Success
  return {
   success: true,
   message: "Authenticated successfully.",
   result: parsed.data,
  };
 }
}
