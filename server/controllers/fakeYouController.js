const FakeYou = require("fakeyou.js")

var fy = null;

const init = async (req, res) => {
  try {
    fy = new FakeYou.Client({
      usernameOrEmail: global.env.FAKEYOU_USERNAME,
      password: global.env.FAKEYOU_PASSWORD
    });
    let result = false;
    if (fy != null) {
      result = (await fy.start()).isReady; //required
    }
    res.status(200).json({ result: result });
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false });
  }
}


const getTTS = async (req, res) => {
  try {
    var resultResponse = {
      state: false,
      path: ''
    };
    if (fy != null) {
      const resultTTS = await fy.makeTTS(global.env.TTS_MODEL, req.body.message);

      if (resultTTS.audioPath != null && resultTTS.audioPath !== "") {
        resultResponse = {
          state: true,
          path: resultTTS.audioPath
        }
      }
    }

    res.status(200).json({ result: resultResponse });
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  init,
  getTTS
}
