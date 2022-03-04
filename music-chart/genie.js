const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let genieSummaryDataTool = [];
let genieMusicSummary = {
  'rank':'',
  'album':'',
  'singer':'',
  'song':''
}

const getGenieMusicSummary = async () => {
  await axios.get('https://www.genie.co.kr/chart/top200')
    .then( async (response) => {
      const $ = cheerio.load(response.data);
       $('tbody tr').map( (i,element) => {
       
        genieMusicSummary['rank'] = String($(element).find('td.number').text().trim().replace(/[^0-9]/g, ''))
        genieMusicSummary['album'] = String($(element).find('td.info a.albumtitle.ellipsis').text().trim())
        genieMusicSummary['singer'] = String($(element).find('td.info a.artist.ellipsis').text())
        genieMusicSummary['song'] = String($(element).find('td.info a.title.ellipsis').text().trim())
          genieSummaryDataTool.push(genieMusicSummary);
          genieMusicSummary = {}
          i++;
          const musicdataResultJSON = JSON.stringify(genieSummaryDataTool);
          fs.writeFileSync('geniesummary-json.json',musicdataResultJSON)

      });
    })
    .then(res => { 
   
      return res 
    })
 .catch(err => console.log(err))
}



let genieDetailDataTool = [];
let genieMusicDetail = {
  'publisher':'',
  'agency':'',
}

const getGenieMusicDetail = async () => {
  await axios.get('https://www.genie.co.kr/chart/top200')
    .then( async (response) => {
   
      const $ = cheerio.load(response.data);
       $('tbody tr').map( (i,element) => {   
        genieMusicDetail['publisher'] = String($(element).find('td.number').text().trim().replace(/[^0-9]/g, ''))
        genieMusicDetail['agency'] = String($(element).find('td.info a.albumtitle.ellipsis').text().trim())
        genieDetailDataTool.push(genieMusicDetail);
        genieMusicDetail = {}
          i++;
          const musicdataResultJSON = JSON.stringify(genieDetailDataTool);
          fs.writeFileSync('geniedetail-json.json',musicdataResultJSON)
      });
    })
    .then(res => { 
      return res 
    })
    .catch(err => console.log(err))
}






 



module.exports  = {  
getGenieMusicSummary,
getGenieMusicDetail,
}

