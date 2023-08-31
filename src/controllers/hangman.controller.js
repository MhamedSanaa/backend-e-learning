const hangmanService = require("../services/hangman.service")
exports.createRoom = async (req, res) => {

    const userId = req.user.uid
    let result = await hangmanService.createRoom(userId)
    res.status(200).send(result);
}


exports.joinRoom = async (req, res) => {
    const userId = req.user.uid

    const code = req.body.code;
    const joined = await hangmanService.joinRoom(userId,code)
    if(joined.joined){
        res.status(200).send(joined);
    }
    else{
        res.status(404).send(joined)
    }

    
}
exports.sendResponse = async (req, res) => {
    const userId = req.user.uid;
    const code = req.body.code;
    const message = req.body.response;
    const sent = await hangmanService.sendResponse(userId,code,message)

    if(sent)
        res.status(200).send({sent : sent})
    else
        res.status(404).send({sent : sent})

}