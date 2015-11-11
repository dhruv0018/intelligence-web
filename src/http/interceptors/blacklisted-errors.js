const BLACKLISTED_ERRORS = {
    "500": {
        "/coach/team/roster": {
            "POST": true
        },
        "/games/*/information": {
            "POST": true
        }
    }
};

export default BLACKLISTED_ERRORS;
