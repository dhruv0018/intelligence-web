const BLACKLISTED_ERRORS = {
    "500": {
        "/coach/team/roster": {
            "POST": true
        },
        "/games/*/information": {
            "POST": true
        }
    },
    "400": {
        "/games/*/raw-film": {
            "POST": true
        }
    }
};

export default BLACKLISTED_ERRORS;
