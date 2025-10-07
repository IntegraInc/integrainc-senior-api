"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const SeniorClient_1 = require("../../../infra/soap/SeniorClient");
const soapParser_1 = require("../../../shared/utils/soapParser");
class AuthService {
    constructor() {
        this.seniorClient = new SeniorClient_1.SeniorClient();
    }
    async authenticate(user, password, encryption) {
        const response = await this.seniorClient.authenticate(user, password, encryption);
        const parsed = (0, soapParser_1.extractSoapFields)(response, ["pmLogged"]);
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
                    message: "Invalid username or password.",
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
exports.AuthService = AuthService;
