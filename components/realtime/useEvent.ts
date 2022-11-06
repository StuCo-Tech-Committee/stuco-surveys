import { Channel } from 'pusher-js';
import { useEffect } from 'react';

export default function useEvent<D>(
  channel: Channel | undefined,
  eventName: string,
  callback: (data?: D, metadata?: { user_id: string }) => void
) {
  useEffect(() => {
    if (!channel) return;

    channel.bind(eventName, callback);
    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
