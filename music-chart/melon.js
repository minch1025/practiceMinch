const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let melonSummaryDataTool = [];
let melonMusicSummary = {
  'rank':'',
  'album':'',
  'singer':'',
  'song':'',
}

//Melon 페이지에서 순위 / 앨범 / 가수명 / 곡 크롤링
const getMelonMusicSummary = async () => {
        await axios.get('https://www.melon.com/chart/index.htm')
          .then( async (response) => {
            const $ = cheerio.load(response.data);
             $('tbody tr').map( (i,element) => {
              // console.log(element)
              melonMusicSummary['rank'] = String($(element).find('td div.wrap.t_center span.rank').text())
              melonMusicSummary['album'] = String($(element).find('td div.wrap_song_info div.ellipsis.rank03 a').text())
              melonMusicSummary['singer'] = String($(element).find('td div.wrap_song_info div.ellipsis.rank02 a').text())
              melonMusicSummary['song'] = String($(element).find('td div.wrap_song_info div.ellipsis.rank01 a').text())
      
              melonSummaryDataTool.push(melonMusicSummary);
              melonMusicSummary = {}
              i++;
              const melonSummaryJSON = JSON.stringify(melonSummaryDataTool);
                fs.writeFileSync('melonsummary-json.json',melonSummaryJSON)
            });
          })
          .catch(err => console.log(err))
}


let melonDetailDataTool = [];
let melonMusicDetail = {
  'publisher':'',
  'agency':'',
}

const getMelonMusicDetail = async () => {
  await axios.get('https://www.melon.com/chart/index.htm')
    .then( async (response) => {
      const $ = cheerio.load(response.data);
        $('tbody tr').map( (i,element) => {
        melonMusicDetail['publisher'] = String($(element).find('td div.wrap_song_info div.ellipsis.rank02 a.href').text())
        melonMusicDetail['agency'] = String($(element).find('td div.wrap_song_info div.ellipsis.rank01 a').text())
        melonDetailDataTool.push(melonMusicDetail);
        melonMusicDetail = {}
        i++;
        const melonDetailJSON = JSON.stringify(melonDetailDataTool);
        fs.writeFileSync('melondetail-json.json', melonDetailJSON)
      });
    })
    .then(res => { 
      return res 
    })
    .catch(err => console.log(err))
}

 


module.exports  = {  
 getMelonMusicSummary,
 getMelonMusicDetail
}
