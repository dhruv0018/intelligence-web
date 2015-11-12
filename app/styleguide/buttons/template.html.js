export default `

    <div class="buttons">

        <!-- Boilerplate
        <h2>Buttons</h2>

        <button class="btn btn-primary">Primary Button</button>
        <button class="btn-lg">Large Button</button>
        <button class="btn-sm">Small Button</button>
        <button class="btn-xs">Extra Small Button</button>
        <br/>
        <button class="btn-success">Success Button</button>
        <button class="btn-info">Info Button</button>
        <button class="btn-warning">Warning Button</button>
        <button class="btn-danger">Danger Button</button>
        <br/>
        <button class="btn-default">Default Button</button>
        <button class="btn-link">Link Button</button>
        <button class="btn-toolbar">Toolbar Button</button>
        <button class="navbar-btn">Nav Button</button>
        <br/>
        <button class="btn-block">Block Button</button>
        -->

        <h3>Priority Label Icons</h3>
        <krossover-priority-label-icon
            ng-repeat="priority in PRIORITIES"
            priority="priority"
        ></krossover-priority-label-icon>

    </div>
`;
