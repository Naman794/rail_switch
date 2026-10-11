import { api } from 'sdk';
export default async function(message) {
  const chat_id = message?.chat?.id;
  if (!chat_id) return;
  const cmd = (message.text || '').split(' ')[0].split('@')[0];
  if (['/start','/play','/help'].includes(cmd)) {
    await api.sendMessage({chat_id,text:'🚂 Rail Switch! Open the Mini App from the bot menu to route trains to matching stations.'});
  }
}
