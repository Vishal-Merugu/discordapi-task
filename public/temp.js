document.querySelector("form").onsubmit(async() =>{
    const response = await axios.get("http://localhost:3000//auth/discord/login")
    console.log(response.data.url);
})