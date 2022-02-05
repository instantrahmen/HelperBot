import config from '../bot/config';

const generateInviteLink = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauthenticate&response_type=code&scope=guilds%20bot%20applications.commands`;
};

console.log('Invite bot to server: ');
console.log(generateInviteLink());
