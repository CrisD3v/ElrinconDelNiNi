'use client';

import { useState, useEffect } from 'react';
import { Bell, MoreHorizontal, CheckCircle2, Trash2 } from 'lucide-react';
import { useWebSocket } from '@/providers/websocket-provider';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from '@/i18n/navigation';
import { apiGet, apiPatch, apiDelete } from '@/lib/api/client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/lib/toast';

export function NotificationsBell() {
  const { profile } = useAuth();
  const { socket, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // Load initial notifications
  useEffect(() => {
    if (!profile?.id) return;
    
    apiGet<any[]>(`/notifications/user/${profile.id}`).then((data) => {
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.isRead).length);
    }).catch(console.error);
  }, [profile?.id]);

  // Listen to WebSockets
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket, isConnected]);

  const markAsRead = async (id: string) => {
    if (!profile?.id) return;
    try {
      await apiPatch(`/notifications/${id}/read?userId=${profile.id}`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsUnread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.id) return;
    try {
      await apiPatch(`/notifications/${id}/unread?userId=${profile.id}`, {});
      setNotifications((prev) => 
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      setUnreadCount((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.id) return;
    try {
      await apiDelete(`/notifications/${id}?userId=${profile.id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const deletedNotification = notifications.find((n) => n.id === id);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearAll = async () => {
    if (!profile?.id) return;
    try {
      await apiDelete(`/notifications/user/all?userId=${profile.id}`);
      setNotifications([]);
      setUnreadCount(0);
      toast.success({ title: 'Notificaciones', description: 'Todas las notificaciones han sido eliminadas.' });
    } catch (e) {
      console.error(e);
      toast.error({ title: 'Error', description: 'No se pudieron limpiar las notificaciones.' });
    }
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    
    try {
      const comment = await apiGet<any>(`/comments/${n.entityId}`);
      if (comment?.mangaId) {
        router.push(`/series/detail/${comment.mangaId}?tab=comments#comment-${n.entityId}`);
      } else if (comment?.chapterId) {
        router.push(`/reader/${comment.chapterId}?tab=comments#comment-${n.entityId}`);
      }
    } catch (e: any) {
      console.error('No se pudo encontrar el comentario:', e);
      if (e.status === 404) {
        toast.error({ title: 'Error', description: 'Este comentario ha sido eliminado.' });
      } else {
        toast.error({ title: 'Error', description: 'No se pudo cargar el comentario.' });
      }
    }
  };

  if (!profile) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-colors">
          <Bell size={18} />
          {notifications.length > 0 && (
            <span
              className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${
                unreadCount > 0 
                  ? 'bg-gold-500 border-2 border-dark-900 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                  : 'bg-dark-400'
              }`}
            />
          )}
        </button>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-80 bg-dark-800 border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-text-primary text-sm">Notificaciones</span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-text-muted hover:text-red-400 transition-colors bg-dark-800 hover:bg-dark-700 px-2.5 py-1 rounded-md border border-dark-600/50 hover:border-red-500/30"
              >
                Limpiar todas
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto pr-1 -mr-1 space-y-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-text-muted text-sm">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenu.Item
                  key={n.id}
                  onSelect={() => handleNotificationClick(n)}
                  className={`
                    group flex items-start gap-3 p-3 rounded-lg cursor-pointer outline-none transition-colors relative
                    ${n.isRead ? 'opacity-70 hover:bg-dark-700' : 'bg-dark-700/50 hover:bg-dark-700'}
                  `}
                >
                  <Avatar
                    src={n.actor?.profileImage || null}
                    name={n.actor?.username ? `@${n.actor.username}` : 'Usuario'}
                    size="sm"
                    className="w-8 h-8 shrink-0 ring-1 ring-dark-600"
                  />
                  <div className="flex-1 space-y-1 pr-6">
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold">{n.actor?.username ? `@${n.actor.username}` : 'Usuario'}</span>
                      {n.type === 'MENTION' ? ' te ha mencionado en un comentario.' : 
                       n.type === 'LIKE' ? ' le ha dado me gusta a tu comentario.' :
                       ' ha respondido a tu comentario.'}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-2" />
                  )}
                  
                  {/* 3-dots Menu */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-dark-600 text-text-muted hover:text-text-primary transition-all shrink-0 absolute right-2 top-1/2 -translate-y-1/2 bg-dark-800 shadow-sm border border-dark-600/50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={4}
                      className="w-48 p-1 bg-dark-800 border border-dark-600/50 rounded-xl shadow-xl z-[60]"
                    >
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-dark-700 rounded-lg cursor-pointer outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (n.isRead) markAsUnread(n.id, e);
                          else markAsRead(n.id);
                        }}
                      >
                        <CheckCircle2 size={14} />
                        {n.isRead ? 'Marcar como no leído' : 'Marcar como leído'}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer outline-none mt-1"
                        onClick={(e) => deleteNotification(n.id, e)}
                      >
                        <Trash2 size={14} />
                        Borrar
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
