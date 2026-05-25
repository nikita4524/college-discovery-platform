export type NotificationType = "save" | "compare" | "success" | "error";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

const notifications = new Map<string, Notification[]>();

export function addNotification(
  userId: string,
  message: string,
  type: NotificationType
): Notification {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId,
    message,
    type,
    read: false,
    createdAt: new Date(),
  };
  const userNotifs = notifications.get(userId) ?? [];
  userNotifs.unshift(notification);
  notifications.set(userId, userNotifs.slice(0, 50));
  return notification;
}

export function getUnreadCount(userId: string): number {
  return (notifications.get(userId) ?? []).filter((n) => !n.read).length;
}

export function markAllRead(userId: string): void {
  const userNotifs = notifications.get(userId) ?? [];
  userNotifs.forEach((n) => {
    n.read = true;
  });
}
