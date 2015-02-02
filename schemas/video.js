{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Video Schema",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "guid": {
            "type": "string"
        },
        "status": {
            "type": "integer"
        },
        "videoTranscodeProfiles": {
            "type": "array",
            "items": { "$ref": "transcodeProfile" }
        },
        "duration": {
            "type": "number"
        },
        "thumbnail": {
            "type": "string"
        }
    },
    "additionalProperties": false
}
