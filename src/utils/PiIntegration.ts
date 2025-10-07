import axios, { AxiosResponse } from "axios";
import { PiNetworkService } from "./PiBackendIntegration";

interface PaymentDTO {
  identifier: string;
}

interface AuthenticateAnswer {
  accessToken: string;
  username: string;
  wallet_address: string;
}

interface APIAnswerData {
  user: {
    username: string;
    userUid: string;
  };
}
const piNetworkService = PiNetworkService.connect();

// Function to handle incomplete payment found
export async function onIncompletePaymentFound(paymentDTO: PaymentDTO) {
  const paymentId = paymentDTO.identifier;
  await piNetworkService.cancelPiNetworkIncompletePayment(
    paymentId,
    paymentDTO
  );
}

// Function to get user access token
export async function getUserAccessToken(): Promise<string> {
  await (window as any).Pi.init({ version: "2.0", sandbox: false });
  try {
    const answer: AuthenticateAnswer = await (window as any).Pi.authenticate(
      ["username", "payments", "wallet_address"],
      onIncompletePaymentFound
    );
    return answer.accessToken;
  } catch (error) {
    throw error;
  }
}

// Function to get user wallet address
export async function getUserWalletAddress(): Promise<string> {
  try {
    const answer: AuthenticateAnswer = await (window as any).Pi.authenticate(
      ["username", "payments", "wallet_address"],
      onIncompletePaymentFound
    );
    return answer.wallet_address;
  } catch (error) {
    throw error;
  }
}

// Function to authenticate with Pi Network
export async function authWithPiNetwork(): Promise<{
  username: string;
  data: APIAnswerData;
  accessToken: string;
}> {
  try {
    await (window as any).Pi.init({ version: "2.0", sandbox: false });
    const answer: AuthenticateAnswer = await (window as any).Pi.authenticate(
      ["username", "payments", "wallet_address"],
      onIncompletePaymentFound
    );
    console.log(answer);
    const APIAnswer: AxiosResponse<APIAnswerData> = await axios.get(
      "https://api.minepi.com/v2/me",
      {
        headers: {
          Authorization: "Bearer " + answer.accessToken,
        },
      }
    );
    console.log("API answer");
    console.log(APIAnswer);

    return { ...(APIAnswer.data as any), accessToken: answer.accessToken };
  } catch (error) {
    throw new Error("Error while authenticating");
  }
}

// Function to create a payment
export async function CreatePayment(
  userUid: string,
  amount: number,
  action: string,
  onPaymentSucceed: Function
): Promise<any> {
  await authWithPiNetwork();
  const paymentResult = await (window as any).Pi.createPayment(
    {
      amount: amount,
      memo: "Pro payment Orbit",
      metadata: { paymentSource: "Orbit" },
    },
    {
      onReadyForServerApproval: async (paymentId: string) => {
        await piNetworkService.approvePiNetworkPayment(paymentId);
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        try {
          await piNetworkService.completePiNetworkPayment(paymentId, txid);

          await onPaymentSucceed(); // Call original success callback
        } catch (error) {
          console.error(
            "Error during server completion or Firestore update:",
            error
          );
          // It's important to decide how to handle errors here.
          // If completePiNetworkPayment fails, onPaymentSucceed should likely not be called.
          // If Firestore update fails, the Pi payment was successful, but our DB is out of sync.
          // For now, we'll let the original onError handle Pi errors,
          // and log Firestore errors. The onPaymentSucceed might still be called if Pi part was ok.

          // Re-throwing the error if it's critical, or calling a specific error handler
          // This depends on how errors from onPaymentSucceed are handled by the caller
          if (
            !(error instanceof Error && error.message.includes("Firestore"))
          ) {
            throw error; // Re-throw if not a Firestore error, let Pi SDK handle it.
          }
          // If it is a Firestore error, the Pi payment succeeded. We still call onPaymentSucceed.
          onPaymentSucceed();
        }
      },
      onCancel: async (paymentId: string) => {
        //The payment has been cancelled
      },
      onError: async (error: any, paymentDTO: PaymentDTO) => {
        console.error("Payment error:", error);
        await piNetworkService.cancelPiNetworkPayment(paymentDTO.identifier);
      },
    }
  );
  return paymentResult;
}
