import {DownloadPingInterface} from './download-ping-interface';
import {LoadTestInterface} from './load-test-interface';

export interface DownloadTestInterface extends LoadTestInterface{
  downloadPing: DownloadPingInterface
}
