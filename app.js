const express = require('express');
const fs = require('fs');
const cron = require('node-cron');
const app = express();
const genie = require('./music-chart/genie');
const melon = require('./music-chart/melon');
const vibe = require('./music-chart/vibe');
app.use(express.json());


//Melon cron 
cron.schedule("*/30 * * * *", async () => {
  console.log()
  console.log("Melon Music chart data update start every 30 minutes");
  await melon.getMelonMusicSummary();
  await melon.getMelonMusicDetail();
})
//Genie cron
cron.schedule("*/32 * * * *", async () => {
  console.log("Genie Music chart data update start every 32 minutes");
  await genie.getGenieMusicSummary();
  await genie.getGenieMusicDetail();
})
//Vibe cronb
// selenium 을 작동시켰을 때, 계속 cron이 멈추는 이슈가 있음. 
cron.schedule("*/34 * * * *", async () => {
  console.log("Vibe Music chart data update start every 34 minutes");
  await vibe.getVibeMusicSummary();
  await vibe.getVibeMusicDetail();
})


app.get('/music-chart/:vendor/summary', function (req, res) {
  let vendor = req.params.vendor;
  fs.readFile( __dirname + "/" + `${vendor}summary-json.json`, 'utf8', function (err, data) {
      console.log( data );
      //한글 깨짐 현상 개선
      res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
      res.end( data );
  });
})

// 상세페이지를 찾는데 이슈가 있었습니다. (개선 필요)
app.get('/music-chart/:vendor/song/detail', async (req, res)  =>  {
  //음원차트만 불러오기
  let vendor = req.params.vendor;
  fs.readFile( __dirname + "/" + `${vendor}detail-json.json`, 'utf8', function (err, data) {
      console.log( data );
      res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
      res.end( data );
  });
  })
 // 두가지를 한꺼번에 가져오는 이슈 
  app.get('/music-chart/:vendor/songs', async (req, res)  =>  {
  //전체 내용 불러오기
  let vendor = req.params.vendor;
  fs.readFile( __dirname + "/" + `${vendor}summary-json.json`, 'utf8', function (err, data) {
      console.log( data );
      res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
      res.end( data );
  });
  fs.readFile( __dirname + "/" + `${vendor}detail-json.json`, 'utf8', function (err, data) {
    console.log( data );
    res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    res.end( data );
});
  
  })



app.listen(3000, () => {
  console.log('서버에 정상적으로 접속되었습니다.');
});
