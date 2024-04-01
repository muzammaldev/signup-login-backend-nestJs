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
  socket: Socket;
  private dataArray: string[] = [];
  private clients: Set<Socket> = new Set();

  @SubscribeMessage('event')
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<{ result: any }> {
    console.log(client.id, 'client Id');

    this.server.except(client.id).emit('event', data);

    const result = this.dataArray.push(data);
    console.log(this.dataArray);
    return { result: result };
  }
}
