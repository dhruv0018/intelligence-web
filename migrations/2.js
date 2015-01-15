module.exports = function(db, options) {

    db.deleteObjectStore('storage');

    db.createObjectStore('tagsets', options);
    db.createObjectStore('filtersets', options);
    db.createObjectStore('positionsets', options);
    db.createObjectStore('users', options);
    db.createObjectStore('plans', options);
    db.createObjectStore('sports', options);
    db.createObjectStore('leagues', options);
    db.createObjectStore('schools', options);
    db.createObjectStore('players', options);
    db.createObjectStore('teams', options);
    db.createObjectStore('games', options);
    db.createObjectStore('reels', options);
    db.createObjectStore('plays', options);
};

