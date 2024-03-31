import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(3006, { namespace: 'chat', cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  private dataArray: string[] = [];

  @SubscribeMessage('event')
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<{ result: any }> {
    // Broadcast the message to all clients except the sender
    socket.broadcast.emit('event', data);

    const result = this.dataArray.push(data);
    console.log(this.dataArray);
    return { result: result };
  }
}
