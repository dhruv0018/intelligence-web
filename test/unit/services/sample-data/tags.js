const tags = {
    "22": {
        "id": 22,
        "name": "Kickoff",
        "indexerScript": [
            "Kickoff by ",
            {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " and is ",
            {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": ["Normal", "Onside"],
                "formations": {},
                "index": 2
            }
        ],
        "userScript": [
            "(",
            {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": ["Normal", "Onside"],
                "formations": {},
                "index": 2
            },
            ") Kickoff by ",
            {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            }
        ],
        "shortcutKey": "K",
        "description": "",
        "isStart": true,
        "isEnd": false,
        "tagSetId": 2,
        "children": [
            35,
            50,
            54,
            55,
            59,
            60
        ],
        "tagVariables": {
            "1": {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            "2": {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": ["Normal", "Onside"],
                "formations": {},
                "index": 2
            }
        },
        "pointsAssigned": null,
        "assignThisTeam": null,
        "isPeriodTag": false,
        "summaryPriority": 2,
        "summaryScript": [
            "Kickoff"
        ],
        "buffer": -1
    },
    "59": {
        "id": 59,
        "name": "Tackle",
        "indexerScript": [
            "Tackle by ",
            {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " at ",
            {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            },
            " yard line"
        ],
        "userScript": [
            "Tackle by ",
            {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " at ",
            {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            },
            " yard line"
        ],
        "shortcutKey": "T",
        "description": "",
        "isStart": false,
        "isEnd": true,
        "tagSetId": 2,
        "children": [],
        "tagVariables": {
            "1": {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            "2": {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            }
        },
        "pointsAssigned": null,
        "assignThisTeam": null,
        "isPeriodTag": false,
        "summaryPriority": null,
        "summaryScript": null,
        "buffer": 4
    }
};

export default tags;
