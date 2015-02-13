
/* TelestrationValue Object */

var TelestrationValue = function TelestrationValue(gameId, time) {

    if (!gameId) throw new Error('telestration object requires gameId');
    if (!time) throw new Error('telestration object requires time');

    var telestrationValue = {
        gameId: gameId,
        time: time,
    };

    return telestrationValue;
};

/* PlayTelestrationValue Object - Extends TelestrationValue */

var PlayTelestrationValue = function PlayTelestrationValue(gameId, time, playId) {

    if (!playId) throw new Error('telestration object requires playId');

    var playTelestrationValue = TelestrationValue(gameId, time);

    playTelestrationValue.playId = playId;

    return playTelestrationValue;
};

/* RawTelestrationValue Object - Extends RawTelestrationValue */

var RawTelestrationValue = function RawTelestrationValue(gameId, time) {

    var rawTelestrationValue = TelestrationValue(gameId, time);

    return rawTelestrationValue;

};

module.exports = {
    TelestrationValue: TelestrationValue,
    PlayTelestrationValue: PlayTelestrationValue,
    RawTelestrationValue: RawTelestrationValue
};
