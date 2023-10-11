import pusher from '@/utilities/PusherClient';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

export default function useChannel(channelName: string) {
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    const _channel = pusher.subscribe(channelName);
    setChannel(_channel);
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName]);

  return channel;
}
