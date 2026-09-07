import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommentsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to CommentsGateway: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from CommentsGateway: ${client.id}`);
  }

  @SubscribeMessage('join-manga-room')
  handleJoinMangaRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() mangaId: string,
  ) {
    if (!mangaId) {
      this.logger.warn(`Client ${client.id} tried to join manga room without ID`);
      return;
    }
    client.join(`manga-${mangaId}`);
    this.logger.log(`Client ${client.id} joined room manga-${mangaId}`);
  }

  @SubscribeMessage('leave-manga-room')
  handleLeaveMangaRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() mangaId: string,
  ) {
    client.leave(`manga-${mangaId}`);
    this.logger.log(`Client ${client.id} left room manga-${mangaId}`);
  }

  @SubscribeMessage('join-chapter-room')
  handleJoinChapterRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() chapterId: string,
  ) {
    if (!chapterId) {
      this.logger.warn(`Client ${client.id} tried to join chapter room without ID`);
      return;
    }
    client.join(`chapter-${chapterId}`);
    this.logger.log(`Client ${client.id} joined room chapter-${chapterId}`);
  }

  @SubscribeMessage('leave-chapter-room')
  handleLeaveChapterRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() chapterId: string,
  ) {
    client.leave(`chapter-${chapterId}`);
    this.logger.log(`Client ${client.id} left room chapter-${chapterId}`);
  }

  emitNewComment(comment: any) {
    if (comment.mangaId) {
      this.server.to(`manga-${comment.mangaId}`).emit('new-comment', comment);
    } else if (comment.chapterId) {
      this.server.to(`chapter-${comment.chapterId}`).emit('new-comment', comment);
    }
  }

  emitDeleteComment(commentId: string, mangaId?: string, chapterId?: string) {
    if (mangaId) {
      this.server.to(`manga-${mangaId}`).emit('delete-comment', commentId);
    } else if (chapterId) {
      this.server.to(`chapter-${chapterId}`).emit('delete-comment', commentId);
    }
  }

  emitUpdateComment(comment: any) {
    if (comment.mangaId) {
      this.server.to(`manga-${comment.mangaId}`).emit('update-comment', comment);
    } else if (comment.chapterId) {
      this.server.to(`chapter-${comment.chapterId}`).emit('update-comment', comment);
    }
  }
}
