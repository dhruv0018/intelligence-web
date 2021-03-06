export default `

<!-- iOS Download Links -->
<section
    id="login-ios-app-links"
    ng-if="DEVICE.IOS"
>

    <a
        ng-href="{{MOBILE_APP_URLS.COACH.IOS}}"
        class="app-download-cta"
    >Download our iOS Coach app <i class="icon icon-download"></i></a>
    <a
        ng-href="{{MOBILE_APP_URLS.ATHLETE.IOS}}"
        class="app-download-cta app-download-cta--athlete"
    >Download our iOS Athlete app <i class="icon icon-download"></i></a>

    <p
        class="other-app-platform-links"
    >
        <a
            ng-href="{{MOBILE_APP_URLS.COACH.ANDROID}}"
            target="_blank"
        >Coach</a>
        and
        <a
            ng-href="{{MOBILE_APP_URLS.ATHLETE.ANDROID}}"
            target="_blank"
        >Athlete</a>
        Android apps are also available.
    </p>

</section>

<!-- Android Download Links -->
<section
    id="login-android-app-links"
    ng-if="DEVICE.ANDROID"
>

    <a
        ng-href="{{MOBILE_APP_URLS.COACH.ANDROID}}"
        class="app-download-cta"
    >Download our Android Coach app <i class="icon icon-download"></i></a>
    <a
        ng-href="{{MOBILE_APP_URLS.ATHLETE.ANDROID}}"
        class="app-download-cta app-download-cta--athlete"
    >Download our Android Athlete app <i class="icon icon-download"></i></a>

    <p
        class="other-app-platform-links"
    >
        <a
            ng-href="{{MOBILE_APP_URLS.COACH.IOS_PUBLIC}}"
            target="_blank"
        >Coach</a>
        and
        <a
            ng-href="{{MOBILE_APP_URLS.ATHLETE.IOS_PUBLIC}}"
            target="_blank"
        >Athlete</a>
        iOS apps are also available.
    </p>

</section>
`;
