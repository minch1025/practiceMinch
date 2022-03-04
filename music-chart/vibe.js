const cheerio = require('cheerio');
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');  


let vibeSummaryDataTool = [];
let vibeMusicSummary = {
  'rank':'',
  'album':'',
  'singer':'',
  'song':'',
  
}


//바이브의 경우엔, 동적 스크롤링을 요하고 있기에, axios cheerio 세트가 아닌 selenium cheerio 세트로 작성 했습니다. 
//cheerio로 각 곡, 순위, 가수명을 가지고 오는 부분입니다. 
const getVibeMusicSummary = async () => { 
	// 1. chromedriver 경로 설정 
	// chromedriver가 있는 경로를 입력 
	const service = new chrome.ServiceBuilder('./chromedriver').build(); 
	chrome.setDefaultService(service); 
	// 2. chrome 브라우저 빌드 
	const driver = await new webdriver.Builder() .forBrowser('chrome') .build(); 
	// 3. google 사이트 열기 
  await driver.get('https://vibe.naver.com/chart/total') 
  const source = await driver.getPageSource();
  //cheerio.load expects a string.
  const $ = await cheerio.load(String(source));
   await $('tbody tr').map( (i,element) => {
    // console.log(element)
    vibeMusicSummary['rank'] = String($(element).find('td.rank span.text').text())
    vibeMusicSummary['album'] = String($(element).find('td.option a.ly_info_album').text())
    vibeMusicSummary['singer'] = String($(element).find('td.song div.artist_sub span.text').text())
    vibeMusicSummary['song'] = String($(element).find('td.song a.link_text').text())
    vibeSummaryDataTool.push(vibeMusicSummary);
    vibeMusicSummary = {}
    i++;
    const musicdataResultJSON = JSON.stringify(vibeSummaryDataTool);
    fs.writeFileSync('vibesummary-json.json',musicdataResultJSON)
    
  });
	// 4. 브라우저 종료 
	setTimeout(async () => { 
              await driver.quit(); process.exit(0); }); } 
  

  let vibeDetailDataTool = [];
  let vibeMusicDetail = {
    'publisher':'',
    'agency':'',
  }
  
  //바이브의 경우엔, 동적 스크롤링을 요하고 있기에, axios cheerio 세트가 아닌 selenium cheerio 세트로 작성 했습니다. 
  //cheerio로 각 곡, 순위, 가수명을 가지고 오는 부분입니다. 
  const getVibeMusicDetail = async () => { 
    // 1. chromedriver 경로 설정 
    // chromedriver가 있는 경로를 입력 
    const service = new chrome.ServiceBuilder('./chromedriver').build(); 
    chrome.setDefaultService(service); 
    // 2. chrome 브라우저 빌드 
    const driver = await new webdriver.Builder() .forBrowser('chrome') .build(); 
    // 3. google 사이트 열기 
    await driver.get('https://vibe.naver.com/chart/total') 
    const source = await driver.getPageSource();
    //cheerio.load expects a string.
    const $ = cheerio.load(String(source));
     $('tbody tr').map( (i,element) => {
      // console.log(element)
      vibeMusicDetail['publisher'] = String($(element).find('td.rank span.text').text())
      vibeMusicDetail['agency'] = String($(element).find('td.option a.ly_info_album').text())
      vibeDetailDataTool.push(vibeMusicDetail);
      vibeMusicDetail = {}
      i++;
      const musicdataResultJSON = JSON.stringify(vibeDetailDataTool);
      fs.writeFileSync('vibedetail-json.json',musicdataResultJSON)
      
    });
    // 4. 브라우저 종료 
    setTimeout(async () => { await driver.quit(); process.exit(0); }); 
  } 
  
module.exports  = {  
getVibeMusicSummary,
getVibeMusicDetail



}





