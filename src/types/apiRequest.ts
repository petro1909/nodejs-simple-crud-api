import { IncomingMessage } from 'http';
import { requestParams } from './requestParams';

export interface ApiRequest extends IncomingMessage {
  body: unknown;
  params: requestParams;
}
