export default `
<button
    class="control-button"
    ng-click="onClickPlayPause()"
    aria-label="Play/Pause"
    type="button"
    tooltip="Play/Pause"
>
    <i class="icon icon-{{ playPauseIcon.play ? 'play' : 'pause' }}"></i>
</button>
`;
