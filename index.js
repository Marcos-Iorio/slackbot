const { App } = require('@slack/bolt')
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_TOKEN
});

const boca = ["https://imgur.com/MW4zdiA.png", "https://imgur.com/riL4WUY.png", "https://imgur.com/Qbvaevv.png", "https://imgur.com/cJRRTgA.png", "https://imgur.com/XiM7gGc.png", "https://imgur.com/iCs5PQU.png", "https://imgur.com/PBElkZ0.png", "https://imgur.com/3frkUvM.png", "https://imgur.com/nbAuGtd.png", "https://imgur.com/aG0BPWa.png", "https://i.imgur.com/ZD4OxyN.jpg"]

//Procesa un JSON, dividiendo dia/mes/año en dates para facilitar el manejo de las fechas.
function checkBday(){
  const data = require('./bdays.json');
  const date = new Date();
  const bdayBoy = data.filter((person) =>{
      const splittedBday = person.birthDate.split('/');
      return (date.getDate() == splittedBday[0] && date.getMonth('mm') +  1 == splittedBday[1]);
  })
  if(bdayBoy.length > 0){
      const splittedBday = bdayBoy[0].birthDate.split('/');
      const bday = { 
        name: bdayBoy[0].id,
        age: date.getFullYear('YYYY') - splittedBday[2],
        position: bdayBoy[0].puesto,
        department: bdayBoy[0].departamento,
        img: bdayBoy[0].img
      }
      return bday;
  }
}

const testBot = "C03EB50HT4Y";
const general = "C01UQUESV0B";

//Cron que corre todos los días a las 10:00AM ARG
cron.schedule('00 00 10 * * *',() =>{
  const response = checkBday();
  if(response != undefined || response != null){
    const result = app.client.chat.postMessage({
      // The token you used to initialize your app
      channel: general,
      text: '<!channel>',
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `<!channel>. Hoy cumple años <@${response.name}>. Felicidades!!!🎉🎉🎉🎉. \n Para conocerlo aún más, está cumpliendo ${response.age}, labura en ${(response.department == 'Redes - Diseño') ? '🎨🎨(Redes - diseño)'
                  : (response.department == 'Desarrollo') ? '💻💻(Los cra\')' : (response.department == 'Brand') ? '🕵️🕵️(Brand)' : (response.department == 'Comercial') ? '💸💸(Comercial)' : '... o simplemente no labura. (ñoqui) ☠️☠️☠️'}
                  ${response.position !== undefined ? `\nEs *${response.position} en la empresa*` : ''}. ${response.name === 'U023T3WNXH6' ? '👵👵 Cuidado, gaga is behind you!!' : ''}\nDe parte todo Lund, que lo pases hermoso!`
          }
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "image1",
            "emoji": true
          },
          "image_url": `${response.img !== "" ? response.img : "https://i.imgur.com/4zrESPB.jpeg"}`,
          "alt_text": "Foto de cumpleaños"
        }
      ]
    });
  }
},
{
  scheduled: true,
  timezone: "America/Argentina/Buenos_Aires"
});


app.command('/boke', async ({ command, ack, say }) => {
    const randomValue = boca[Math.floor(Math.random() * boca.length)];
    
    // Acknowledge command request
    await ack();
    const result = await app.client.chat.postMessage({
        channel: general,
        text: `<@${command.user_name}> dijo UOOOOOOOCA y acá lo tenés:`,
        "blocks": [
            {
                "type": "image",
                "title": {  
                    "type": "plain_text",
                    "text": `<@${command.user_name}>`
                },
                "block_id": "image4",
                "image_url": `${randomValue}`,
                "alt_text": "Meme.",
            }
        ]   
    });
});

//Trae el id y nombre de todos los que esten en el workspace
/* let usersStore = [];

try {
  // Call the users.list method using the WebClient
  const result =  app.client.users.list();
  const members = result.then((response) => { return response.members}).then((result) => {
    result.forEach((member) => {
      usersStore.push({"name":member.real_name, id: member.id});
    })
    console.log(usersStore)
  }) 
}
catch (error) {
  console.error(error);
} */


  
(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();