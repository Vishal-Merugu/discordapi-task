const path = require('path')
const axios = require('axios')
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { channel } = require('diagnostics_channel');

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/auth/discord/login', async (req, res, next)=>{
    const url  = "https://discord.com/api/oauth2/authorize?client_id=1127517265215107222&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds"

    res.json({url : url})
})

async function  auth(req){
    const {code} = req.query
        const params = new URLSearchParams({
            client_id : process.env.DISCORD_CLIENT_ID,
            client_secret : process.env.DISCORD_CLIENT_SECRET ,
            grant_type : "authorization_code",
            code,
            redirect_uri : process.env.DISCORD_REDIRECT
        })
        const headers = {
            'Content-Type' : 'application/x-www-form-urlencoded',
            "Accept-Encoding" : 'application/x-www-form-urlencoded'
        }
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            params,
            {
                headers 
            }
        );
        return response.data.access_token
}

app.get('/auth/discord/callback' , async (req, res, next) => {
    try{

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers : {
                Authorization : `Bearer ${access_token}`
            }
        });
        
        res.json(userResponse.data)
    }
    catch(err){
        console.log(err);
    }
})


app.get('/auth/discord/channels',async () => {
    try{
        let access_token = await auth(req)
        const channels = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers : {
                Authorization : `Bearer ${access_token}`
            }
        })

        channelDetails = channels.data.map(channel => {
            return {name : channel.name,
                    id : channel.id,
                    owner : channel.owner}
        })
        console.log(channelDetails)
    }
    catch(err){
        console.log(err);
    }
})

app.use((req,res) => {
    let url = req.url
    res.header('Content-Security-Policy', "img-src 'self'");
    if(url == "/"){
        url = "login.html"
        res.sendFile(path.join(__dirname, `public/${url}`))
    }
})

app.listen(3000)
