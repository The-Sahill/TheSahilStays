require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

exports.sendWhatsapp = async (req, res) => {
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            contentSid: process.env.CONTENTSID,
            contentVariables: JSON.stringify({ "1": "12/1", "2": "3pm" }),
            to: 'whatsapp:+962782407533'
        });

        console.log(message.sid);
        return res.status(200).json({ error: false, sid: message.sid });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
};