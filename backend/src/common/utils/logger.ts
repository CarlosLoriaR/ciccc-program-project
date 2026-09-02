type LogMeta = Record<string, unknown>;

function line(level: string, meta: LogMeta | undefined, message: string): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()} ${message}${metaStr}`;
}

export const logger = {
  info(metaOrMessage: LogMeta | string, message?: string): void {
    if (typeof metaOrMessage === 'string') console.log(line('info', undefined, metaOrMessage));
    else console.log(line('info', metaOrMessage, message ?? ''));
  },
  warn(metaOrMessage: LogMeta | string, message?: string): void {
    if (typeof metaOrMessage === 'string') console.warn(line('warn', undefined, metaOrMessage));
    else console.warn(line('warn', metaOrMessage, message ?? ''));
  },
  error(metaOrMessage: LogMeta | string, message?: string): void {
    if (typeof metaOrMessage === 'string') console.error(line('error', undefined, metaOrMessage));
    else console.error(line('error', metaOrMessage, message ?? ''));
  },
};
