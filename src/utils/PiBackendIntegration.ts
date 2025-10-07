import axios from "axios";
export type NetworkPassphrase = "Pi Network" | "Pi Testnet";
export type Direction = "user_to_app" | "app_to_user";
type PiNetworkPaymentDTO = {
  // Payment data:
  identifier: string; // payment identifier
  user_uid: string; // user's app-specific ID
  amount: number; // payment amount
  memo: string; // a string provided by the developer, shown to the user
  metadata: Object; // an object provided by the developer for their own usage
  from_address: string; // sender address of the blockchain transaction
  to_address: string; // recipient address of the blockchain transaction
  direction: Direction; // direction of the payment
  created_at: string; // the payment's creation timestamp
  network: NetworkPassphrase; // a network of the payment

  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean; // Server-Side Approval
    transaction_verified: boolean; // blockchain transaction verified
    developer_completed: boolean; // Server-Side Completion
    cancelled: boolean; // cancelled by the developer or by Pi Network
    user_cancelled: boolean; // cancelled by the user
  };

  // Blockchain transaction data:
  transaction: null | {
    // This is null if no transaction has been made yet
    txid: string; // id of the blockchain transaction
    verified: boolean; // true if the transaction matches the payment, false otherwise
    _link: string; // a link to the operation on the Blockchain API
  };
};
export type RewardedAdStatusDTO = {
  identifier: string; // the adId token returned from the Pi SDK displayAd("rewarded") method
  mediator_ack_status: "granted" | "revoked" | "failed" | null;
  mediator_granted_at: string | null; // ISO 8601 date string
  mediator_revoked_at: string | null; // ISO 8601 date string
};
export class PiNetworkService {
  private baseUrl = "https://api.minepi.com/v2";
  private PiNetworkApi;
  private apiKey: string;
  private walletPrivateSeed: string;
  private mainnetApiKey =
    "nrh00imav2rj5hbxjmdt545hkanl6g0gkxwh7guvgus22uphx3wrv5gdcqcgsipk";
  private testnetApiKey =
    "mzgtwcimosueu2hdwkmrk1xgrw9ivh7t3wc4uk7mff00i7rxel1sg7wwobqihfvr";
  static connect() {
    return new PiNetworkService();
  }
  constructor() {
    const _apiKey = this.mainnetApiKey;
    this.apiKey = _apiKey;
    this.walletPrivateSeed = "c";

    this.PiNetworkApi = axios.create({
      baseURL: this.baseUrl,
      timeout: 20000,
      headers: {
        Authorization: "Key " + _apiKey,
      },
    });
  }
  async verifyRewardedAd(adId: string): Promise<RewardedAdStatusDTO> {
    try {
      console.log("verifying ad status");
      const APIAnswer = await this.PiNetworkApi.get(
        "/ads_network/status/" + adId
      );
      return APIAnswer["data"];
    } catch (error) {
      console.log("Error verifying ad status");
      console.log(error);
      throw error;
    }
  }

  async authWithPiNetworkApi(accessToken: string) {
    try {
      const APIAnswer = await this.PiNetworkApi.get("/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      return APIAnswer["data"];
    } catch (error) {
      throw error;
    }
  }

  async approvePiNetworkPayment(paymentId: string) {
    try {
      const approvalResult = await this.PiNetworkApi.post(
        "/payments/" + paymentId + "/approve"
      );
      if (approvalResult.status !== 200) {
        throw Error("An error occurred while approving the payment request");
      }
    } catch (error) {
      throw error;
    }
  }

  async completePiNetworkPayment(paymentId: string, transactionId: string) {
    try {
      const completionResponse = await this.PiNetworkApi.post(
        "/payments/" + paymentId + "/complete",
        { txid: transactionId }
      );
      if (completionResponse.status !== 200) {
        throw Error("An error occurred while completing the payment");
      }
    } catch (error) {
      throw error;
    }
  }

  async getPiNetworkPaymentInformation(paymentId: string) {
    try {
      const paymentResponse = await this.PiNetworkApi.get(
        "/payments/" + paymentId
      );
      if (paymentResponse.status === 200) {
        const piNetworkPaymentDTO: PiNetworkPaymentDTO = paymentResponse.data;
        return piNetworkPaymentDTO;
      } else {
        throw Error("An error occurred");
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelPiNetworkPayment(paymentId: string) {
    try {
      const paymentCancellingResponse = await this.PiNetworkApi.post(
        "/payments/" + paymentId + "/cancel"
      );
      if (paymentCancellingResponse.status !== 200) {
        throw Error("An error occurred while cancelling the payment");
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelPiNetworkIncompletePayment(
    paymentId: string,
    PiNetworkPaymentDTO: any
  ) {
    try {
      const paymentCancellingResponse = await this.PiNetworkApi.post(
        "/payments/" + paymentId + "/cancel",
        { paymentId }
      );

      if (paymentCancellingResponse.status !== 200) {
        throw Error("An error occurred while cancelling the payment");
      }
      await this.cancelAllPiNetworkIncompletePayments();
    } catch (error) {
      throw error;
    }
  }

  private async cancelAllPiNetworkIncompletePayments() {
    try {
      const allPiNetworkIncompletePaymentsResponse =
        await this.PiNetworkApi.get("/payments/incomplete_server_payments");
      const allPiNetworkIncompletePayments =
        allPiNetworkIncompletePaymentsResponse.data;
      const incompletePayments: any[] =
        allPiNetworkIncompletePayments["incomplete_server_payments"];
      for (let index = 0; index < incompletePayments.length; index++) {
        const payment = incompletePayments[index];
        const paymentId = payment.identifier;
        await this.PiNetworkApi.post("/payments/" + paymentId + "/cancel", {
          paymentId,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
