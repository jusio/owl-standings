const fs = require('fs');
const rp = require('request-promise');
const crypto = require('crypto');

const hash = crypto.createHash('sha256');


const defaultTeams = require("./teamDefaults.json").reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {});


console.log("Downloading schedule");

function fetchVods(matchId) {
    return rp("https://api.overwatchleague.com/vods?tag=esports-match-" + matchId + "&locale=en-us")
}


const schedulePromise = rp('https://api.overwatchleague.com/schedule?locale=en_US')
    .then(data => {
        console.log("Schedule downloaded");
        return data;
    }).catch(e => {
        console.error("Failed to download schedule", e);
        throw e;
    });
console.log("Downloading teams");


const teamsPromise = rp('https://api.overwatchleague.com/teams?expand=team.content&locale=en_us')
    .then(data => {
        console.log("Teams downloaded");
        return data;
    })
    .catch(e => {
        console.error("Failed to download teams", e);
        throw e;
    });

async function printVods(matches) {
    const vods = await Promise
        .all(matches.map(match => fetchVods(match.id)
            .then(vod => {
                vod.matchId = match.id;
                return vod;
            })));
    vods.map(data => JSON.parse(data))
        .filter(vodData => vodData.data)
        .forEach((vodData,index) => {


            const sorted = vodData.data
                .sort((vod1, vod2) => {
                    const title1 = vod1.title.trim();
                    const title2 = vod2.title.trim();
                    if (title1 > title2) return 1;
                    if (title1 < title2) return -1;
                    return 0;
                });
            const hasFullGame =  sorted.some(vod=>vod.title.indexOf("Full Match") > -1);
            if(!hasFullGame){
                console.log("\n NO FULL MATCH VOD FOR " + sorted[0].title.substring(7,17) + "\n")
            }

            sorted
                .forEach(vod => console.log("* [" + vod.title.trim() + "](" + vod.share_url + ")"));


            //FAKE 5th game if needed
            if(sorted.length === (hasFullGame ? 5:4)){
                console.log("* [Game 5 " + sorted[1].title.substring(7) + "](http://overwatch.eventvods.com/#uUMS)");
            }
        });
}

Promise.all([schedulePromise, teamsPromise]).then(([scheduleResponse, teamsResponse]) => {
    console.log("Processing");
    try {
        const processed = transformData(JSON.parse(scheduleResponse), JSON.parse(teamsResponse));
        console.log("Finished");
        printVods(processed.matches);

        const target = process.argv[2];
        console.log("Saving result at " + target);


        const dataToWrite = JSON.stringify(processed, null, '\t');
        hash.update(dataToWrite);

        const sha = hash.digest("hex");
        fs.writeFile(".env", "REACT_APP_DATA_VERSION=" + sha, (err) => {
            if (err) {
                return;
            }
            console.log("Data hash " + sha);
        });


        fs.writeFile(target, dataToWrite, (err) => {
            if (err) {
                console.error("Failed to save file to " + target + " cause of ", err);
                return;
            }
            console.log("Success! Result saved at " + target);

        })


    } catch (e) {
        console.error("Processing error", e);
    }

});


// request('https://api.overwatchleague.com/schedule?locale=en_US', (error, response, body) => {
//     if (error) {
//         console.error("Failed to fetch data", error);
//         return;
//     }
//     let parsed;
//     try {
//         parsed = JSON.parse(body);
//     } catch (e) {
//         console.error("Failed to parse response from the server", e);
//         return;
//     }
//     const transformed = transformData(parsed);
//     console.log(JSON.stringify(transformed, null, '\t'));
//     const target = process.argv[2];
//     fs.writeFile(target, JSON.stringify(transformed, null, '\t'), (err) => {
//         if (err) {
//             console.error("Failed to save file to " + target + " cause of ", err)
//             return;
//         }
//         console.log("Info file is saved at " + target);
//     })
// });


const translation = {
    "horizon-lunar-colony": "Horizon",
    "temple-of-anubis": "Anubis"
};

function transformMapName(mapName) {
    if (translation[mapName]) {
        return translation[mapName]
    }
    return mapName;
}

function toEmptyArrayIfNull(val) {
    return val == null ? [] : val;
}


function transformData(scheduleResponse, teamsResponse) {
    const teams = defaultTeams;
    const matches = [];
    const upcomingMatches = [];
    scheduleResponse.data.stages[2].matches
        .sort((match1, match2) => {
            if (match1.startDate > match2.startDate) return 1;
            if (match1.startDate < match2.startDate) return -1;
            return 0;
        })
        .forEach((stageMatch) => {
            const competitors = stageMatch.competitors;
            if (competitors.some(comp => comp === null)) {
                return;
            }
            competitors.forEach(competitor => {
                const teamId = competitor.abbreviatedName;
                if (!teams[teamId]) {
                    teams[teamId] = {"id": teamId};
                }
                const team = teams[teamId];
                if (!team.name)
                    team.name = competitor.name;
                if (!team.icon)
                    team.icon = competitor.secondaryPhoto;
                if (!team.color)
                    team.color = competitor.primaryColor;
                if (!team.secondaryColor)
                    team.secondaryColor = competitor.secondaryColor;
            });

            const match = {
                id: stageMatch.id,
                teams: competitors.map(comp => comp.abbreviatedName),
                mapData: stageMatch.games.map(game => {
                    return [game.id, transformMapName(game.attributes.map)].concat(toEmptyArrayIfNull(game.points).filter(val => val !== null));
                }),
                date: stageMatch.startDate
            };


            if (stageMatch.state === "CONCLUDED") {
                const team1 = teams[match.teams[0]];
                const team2 = teams[match.teams[1]];
                [team1, team2].forEach(team => {
                    if (!team.mapPoints) {
                        team.mapPoints = {
                            won: 0,
                            lost: 0,
                            draws: 0
                        };
                        team.won = 0;
                        team.lost = 0;
                    }
                    if (!team.mapStats) {
                        team.mapStats = {};
                    }


                });
                const wins = stageMatch.wins;
                if (wins[0] > wins[1]) {
                    team1.won++;
                    team2.lost++;
                } else if (wins[0] < wins[1]) {
                    team2.won++;
                    team1.lost++;
                }

                const draws = stageMatch.games.filter(game => game.points && game.points[0] === game.points[1]).length;
                team1.mapPoints.won += wins[0];
                team1.mapPoints.lost += wins[1];
                team1.mapPoints.draws += draws;
                team2.mapPoints.won += wins[1];
                team2.mapPoints.lost += wins[0];
                team2.mapPoints.draws += draws;

                const updateMapStats = (team, map, win, loss, draw) => {
                    const mapStats = team.mapStats;
                    if (!mapStats[map]) {
                        mapStats[map] = [0, 0, 0]
                    }
                    [currentWins, currentLosses, currentDraws] = mapStats[map];
                    if (win) {
                        mapStats[map][0]++;
                    }
                    if (loss) {
                        mapStats[map][1]++;
                    }
                    if (draw) {
                        mapStats[map][2]++;
                    }

                };
                stageMatch.games.forEach(game => {
                    if(!game.points){
                        console.log(JSON.stringify(game,null,"\t"));
                        return;
                    }
                    const mapName = transformMapName(game.attributes.map);
                    updateMapStats(team1, mapName, game.points[0] > game.points[1], game.points[1] > game.points[0], game.points[0] === game.points[1]);
                    updateMapStats(team2, mapName, game.points[0] < game.points[1], game.points[1] < game.points[0], game.points[0] === game.points[1]);
                });


                matches.push(match);
            } else {
                upcomingMatches.push(match);
            }
        });
    teamsResponse.competitors.forEach(({competitor}) => {
        teams[competitor.abbreviatedName].website = competitor.content.teamWebsite;
    });

    return {
        teams: Object
            .keys(teams)
            .map(key => teams[key])
            .sort((team1, team2) => {
                if (team1.won !== team2.won) {
                    return team2.won - team1.won
                }
                if (team1.lost !== team2.lost) {
                    return team1.lost - team2.lost;
                }
                if (team1.mapPoints.won !== team2.mapPoints.won) {
                    return team2.mapPoints.won - team1.mapPoints.won;
                }
                if (team1.mapPoints.lost !== team2.mapPoints.lost) {
                    return team1.mapPoints.lost - team2.mapPoints.lost;
                }
                if(team1.mapPoints.draws !== team2.mapPoints.draws){
                    return team2.mapPoints.draws - team1.mapPoints.draws;
                }
                return 0;
            }),
        upcomingMatches,
        matches
    }
}