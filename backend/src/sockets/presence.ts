const userSockets = new Map<string, Set<string>>();

/** Returns true if this is the user's first active connection (they just came online). */
export function addSocket(userId: string, socketId: string): boolean {
  const wasOffline = !userSockets.has(userId) || userSockets.get(userId)!.size === 0;
  const sockets = userSockets.get(userId) ?? new Set<string>();
  sockets.add(socketId);
  userSockets.set(userId, sockets);
  return wasOffline;
}

/** Returns true if this was the user's last connection (they just went offline). */
export function removeSocket(userId: string, socketId: string): boolean {
  const sockets = userSockets.get(userId);
  if (!sockets) return false;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    userSockets.delete(userId);
    return true;
  }
  return false;
}

export function isOnline(userId: string): boolean {
  return userSockets.has(userId);
}
