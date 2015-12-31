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
    ><a ng-href="{{MOBILE_APP_URLS.COACH.ANDROID}}">Coach</a> and <a ng-href="{{MOBILE_APP_URLS.ATHLETE.ANDROID}}">Athlete</a> Android apps are also available.</p>

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
    ><a ng-href="{{MOBILE_APP_URLS.COACH.IOS}}">Coach</a> and <a ng-href="{{MOBILE_APP_URLS.ATHLETE.IOS}}">Athlete</a> iOS apps are also available.</p>

</section>
`;
