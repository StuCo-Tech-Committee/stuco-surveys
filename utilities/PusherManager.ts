import Pusher from 'pusher';

// DONT PUSH THIS YET
const pusher = new Pusher({
  appId: '1414720',
  key: '3800fa093dc2b07f5524',
  secret: '4f8ac8799c7769909c2c',
  cluster: 'us2',
  useTLS: true,
});

class PusherManager {
  static async push(channel: string, event: string, data: any) {
    pusher.trigger(channel, event, data);
  }
}

export default PusherManager;
