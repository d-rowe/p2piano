export type SignalPayload = {
  userId: string;
  signalData: {
    sdp: string;
    type: string;
  };
};
