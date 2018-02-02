const cheerio = require('cheerio');
const fs = require('fs');
const rp = require('request-promise');


fs.readFile("testResources/predictor.html","utf-8",(err,data)=>{

    if(err){
        console.error("Failed to read file",err);
        return;
    }
    console.log(parsePredictions(data));

});

function parsePredictions(data){
    const $ = cheerio.load(data);

    $("body>div.container").find("div[id^=match]").each((index,element)=>{
        const $2 = $(element);
        const idAttr = $2.attr("id");
        const id = idAttr.substring(6,idAttr.length);
        const team1 = $2.find("div:nth-child(2)>div").text();
        const team2 = $2.find("div:nth-child(4)>div").text();
        const dataAttr = $("div#chart-"+id).attr("data-stats");
        console.log(team1);
        console.log(team2);
        console.log(dataAttr);


    });
}