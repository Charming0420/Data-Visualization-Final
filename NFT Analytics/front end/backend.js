const express = require("express")
const path = require("path");
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const app = express()
//cors
const cors = require("cors");
app.use(cors({
  origin: true,
  credentials: true,
}))

app.use(bodyParser.json())
app.use(urlencodedParser)
app.use(express.json())
app.use(express.static("./uploads"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonParser)

function pythonProcess(req, res) {

  const address = req.body.address;
  let spawn = require("child_process").spawn

  let process = spawn('python', [
    "test_111.py",
    address
  ])

  process.stdout.on('data', (data) => {
    const parsedString = JSON.parse(data);
    res.send(parsedString)
  })
}

app.post("/api/listingCount",pythonProcess)

//-------------------listen-----------------------------
app.listen(3001, () => {
  console.log("running server 3001")
})