import {IdlePingInterface} from './idle-ping.interface';
import {UploadTestInterface} from './upload-test.interface';
import {DownloadTestInterface} from './download-test.interface';
import {ServerInterface} from './server.interface';

export interface SpeedtestInterface {
  id: number
  isp: string
  packetLoss: number
  timestamp: Date
  downloadTest: DownloadTestInterface
  uploadTest: UploadTestInterface
  idlePing: IdlePingInterface
  server: ServerInterface
}
