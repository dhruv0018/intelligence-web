if (window.applicationCache) {

    window.applicationCache.addEventListener('updateready', function() {

        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {

            window.location.reload();
        }
    });
}
