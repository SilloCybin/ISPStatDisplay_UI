import {UploadPingInterface} from './upload-ping-interface';
import {LoadTestInterface} from './load-test-interface';

export interface UploadTestInterface extends LoadTestInterface{
  uploadPing: UploadPingInterface
}
