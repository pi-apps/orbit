import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import orbitProvider from "../backend/OrbitProvider";
import { selectUserGlobalData } from "../store/orbitSlice";
import { CreatePayment } from "../utils/PiIntegration";
import PiIcon from "./PiIcon";

const proFeatures = [
  "2 workspaces",
  "Link more than one account on each platform",
  "Schedule posts",
  "Upload images",
  "Advanced analytics",
  "AI in templates",
  "Image generation",
  "Video generation",
  "Upload more than 50 images",
];

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Subscription Successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You have successfully subscribed to Orbit Pro.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={onClose}
                  >
                    Go back to dashboard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function OrbitProModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const userGlobalData = useSelector(selectUserGlobalData);
  const isSubscribed = userGlobalData?.userData?.pro?.isSubscribed || false;
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!userGlobalData?.user || isSubscribed) return;

    const amount = billingCycle === "monthly" ? 25 : 250;
    const onPaymentSuccess = async () => {
      try {
        await orbitProvider.subscribeToPro(
          userGlobalData.user.uid,
          billingCycle,
          amount
        );
        setShowSuccess(true);
      } catch (error) {
        console.error(
          "Failed to update subscription status in Firestore:",
          error
        );
      }
    };

    try {
      await CreatePayment(
        userGlobalData.user.uid,
        amount,
        "pro-subscription",
        onPaymentSuccess
      );
    } catch (error) {
      console.error("Pi Payment failed:", error);
      // Handle payment initiation failure
    }
  };

  const subscriptionEndDate = userGlobalData?.userData?.pro?.endDate
    ? new Date(userGlobalData.userData.pro.endDate).toLocaleDateString()
    : "N/A";

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => {
          setShowSuccess(false);
          onClose();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {isSubscribed && (
                  <div className="mb-4 rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InformationCircleIcon
                          className="h-5 w-5 text-blue-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          You are currently on the{" "}
                          <span className="font-medium">
                            {userGlobalData?.userData?.pro?.plan}
                          </span>{" "}
                          plan. Your subscription is valid until{" "}
                          <span className="font-medium">
                            {subscriptionEndDate}
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Orbit Pro
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Unlock more features with Orbit Pro.
                      </p>
                      <ul className="mt-4 space-y-2">
                        {proFeatures.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400 sm:ml-3 sm:w-auto"
                    onClick={handleSubscribe}
                    disabled={isSubscribed}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      disabled={isSubscribed}
                      className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ${
                        billingCycle === "monthly" && !isSubscribed
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      } ${isSubscribed ? "cursor-not-allowed" : ""}`}
                    >
                      Monthly (25 <PiIcon size={16} className="inline" />)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      disabled={isSubscribed}
                      className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ${
                        billingCycle === "yearly" && !isSubscribed
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      } ${isSubscribed ? "cursor-not-allowed" : ""}`}
                    >
                      Yearly (250 <PiIcon size={16} className="inline" />)
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
