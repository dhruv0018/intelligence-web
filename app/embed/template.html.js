export default `

    <section class="embed-player-area">

        <div class="embed-body">

                <video-player
                    class="embed-video-container"
                    poster-image="posterImage"
                    video="video"
                    cue-points="cuePoints"
                    telestrations="telestrationsEntity"
                    telestrations-permissions="telestrationsPermissions"
                    play-id="currentPlayId"
                >
                </video-player>

                <clips-navigation
                    video="video"
                    plays="plays"
                ></clips-navigation>

        </div>

    </section>
`;
