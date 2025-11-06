export interface AveragesInterface{

  id: number;
  downloadBandwidth: number;
  uploadBandwidth: number;
  downloadPingLatency: number;
  uploadPingLatency: number;
  idlePingLatency: number;
  downloadPingLow: number;
  uploadPingLow: number;
  idlePingLow: number;
  downloadPingHigh: number;
  uploadPingHigh: number;
  idlePingHigh: number;
  downloadPingJitter: number;
  uploadPingJitter: number;
  idlePingJitter: number;
  packetLoss: number;

}
