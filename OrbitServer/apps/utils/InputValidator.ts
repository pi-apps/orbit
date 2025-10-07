import { encrypt } from "./encryption";
import { PiNetworkService } from "./PiIntegration";

class InputValidator {
  static connect() {
    return new InputValidator();
  }

  validateRealString(data: string) {
    if (typeof data !== "string") {
      throw Error("invalid string");
    }
    return data.trim();
  }

  async validatePiNetworkAccessToken(accessToken: string): Promise<{
    uid: any;
    username: any;
    piUid: string;
  }> {
    try {
      const { uid, username } =
        await PiNetworkService.connect().authWithPiNetworkApi(accessToken);
      return { uid: encrypt(username), username, piUid: uid };
    } catch (error) {
      throw error;
    }
  }
}

export const inputValidator = InputValidator.connect();
