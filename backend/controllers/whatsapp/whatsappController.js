

exports.sendWhatsapp = async (req, res) => {
    try {
      

        console.log(message.sid);
        return res.status(200).json({ error: false, sid: message.sid });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
};