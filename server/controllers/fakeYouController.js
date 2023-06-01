import FakeYou from "fakeyou.js";

var fy = null;

export const init = async (req, res) => {
  try {
    fy = new FakeYou.Client({
      usernameOrEmail: 'coelacanthland',
      password: 'passkeyfakeyou'
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


export const getTTS = async (req, res) => {
  try {
    var resultResponse = {
      state: false,
      path: ''
    };
    if (fy != null) {
      const resultTTS = await fy.makeTTS('Rick Sanchez (Version 1.0)', req.body.message);

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
