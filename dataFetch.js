const fs = require('fs');
const rp = require('request-promise');


const defaultTeams = require("./teamDefaults.json").reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {});



console.log("Downloading schedule");
const schedulePromise = rp('https://api.overwatchleague.com/schedule?locale=en_US').then(data => {
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


Promise.all([schedulePromise, teamsPromise]).then(([scheduleResponse, teamsResponse]) => {
    console.log("Processing");
    try {
        const processed = transformData(JSON.parse(scheduleResponse), JSON.parse(teamsResponse));
        console.log("Finished");

        const target = process.argv[2];
        console.log("Saving result at " + target);
        fs.writeFile(target, JSON.stringify(processed, null, '\t'), (err) => {
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
    scheduleResponse.data.stages[1].matches.forEach(stageMatch => {
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


        if (stageMatch.state !== "PENDING") {
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
            });
            const wins = stageMatch.wins;
            if (wins[0] > wins[1]) {
                team1.won++;
                team2.lost++;
            } else if (wins[0] < wins[1]) {
                team2.won++;
                team1.lost++;
            }

            const draws = stageMatch.games.filter(game => game.points[0] === game.points[1]).length;
            team1.mapPoints.won += wins[0];
            team1.mapPoints.lost += wins[1];
            team1.mapPoints.draws += draws;
            team2.mapPoints.won += wins[1];
            team2.mapPoints.lost += wins[0];
            team2.mapPoints.draws += draws;

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
                return 0;
            }),
        upcomingMatches,
        matches
    }
}