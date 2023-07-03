import { ServerResponse, IncomingMessage } from 'http';
export type ApiResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};
