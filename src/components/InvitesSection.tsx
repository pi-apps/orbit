import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { Invite } from "../types";
import { Check, X, Mail } from "lucide-react";

const InvitesSection: React.FC = () => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = useCallback(async () => {
    if (!userGlobalData?.user?.uid) return;
    setLoading(true);
    try {
      const userInvites = await orbitProvider.getInvitesForUser(
        userGlobalData.user.uid
      );
      setInvites(userInvites);
    } catch (error) {
      console.error("Failed to fetch invites:", error);
    } finally {
      setLoading(false);
    }
  }, [userGlobalData?.user?.uid]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleAccept = async (inviteId: string) => {
    if (!userGlobalData?.user?.uid) return;
    try {
      await orbitProvider.acceptInvite(inviteId, userGlobalData.user.uid);
      fetchInvites(); // Refresh invites list
    } catch (error) {
      console.error("Failed to accept invite:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleDecline = async (inviteId: string) => {
    if (!userGlobalData?.user?.uid) return;
    try {
      await orbitProvider.declineInvite(inviteId, userGlobalData.user.uid);
      fetchInvites(); // Refresh invites list
    } catch (error) {
      console.error("Failed to decline invite:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <p>Loading invites...</p>
      </div>
    );
  }

  if (invites.length === 0) {
    return null; // Don't render anything if there are no invites
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5" />
        You have new invitations!
      </h2>
      <div className="space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-800">
              You've been invited to join the{" "}
              <span className="font-semibold">{invite.workspaceName}</span>{" "}
              workspace.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAccept(invite.id)}
                className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                title="Accept"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDecline(invite.id)}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                title="Decline"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitesSection;