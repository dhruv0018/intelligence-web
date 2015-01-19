{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Event Schema",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "time": {
            "type": "number"
        },
        "tagId": {
            "type": "integer"
        },
        "playId": {
            "type": "integer"
        },
        "variableValues": {
            "patternProperties": {
                "[0-9]": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": ["null", "string"],
                            "options": ["null", "Team", "Player"]
                        },
                        "value": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "additionalProperties": false
}
