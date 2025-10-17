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

  const parsed = extractSoapFields(response, ["pmLogged"]);

  // 🧠 Case 1: SOAP execution failure
  if (parsed.error) {
   return {
    success: false,
    message: parsed.message,
    details: parsed.details,
   };
  }

  // 🧠 Case 2: Invalid credentials (pmLogged = -1)
  if (parsed.data.pmLogged === "-1") {
   return {
    success: false,
    error: {
     message: "Nome de usuário inválido ou senha incorreta.",
    },
   };
  }

  // ✅ Case 3: Success
  return {
   success: true,
   message: "Authenticated successfully.",
   data: "User authenticated",
  };
 }
}
