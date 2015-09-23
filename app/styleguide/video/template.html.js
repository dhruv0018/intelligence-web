export default `

    <div class="video">

        <h2>Krossover Video Player</h2>

        <h3>Mobile Friendly Video Player With Clips Navigation</h3>

        <div class="video-container">

            <video-player
                poster-image="posterImage"
                video="video"
                play-id="currentPlayId"
            ></video-player>

            <clips-navigation
                video="video"
                plays="plays"
            ></clips-navigation>

        </div>

    </div>
`;
