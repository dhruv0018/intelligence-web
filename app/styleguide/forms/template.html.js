export default `

    <div class="forms">

        <H2>Forms</h2>

        <!-- Boilerplate
        <form>

            <div class="form-group">
                <label>Text input</label>
                <input type="text" class="form-control"/>
                <br/>
                <input type="text" class="form-control" placeholder="Field with placeholder text"/>
                <br/>
                <textarea cols="30" rows="5" placeholder="Text area"></textarea>
                <br/>
                <label>Select Field</label>
                <select class="form-control">
                    <option value="0">One option</option>
                    <option value="1">Another option</option>
                    <option value="2">Yet another option</option>
                </select>
                <br/>
                <label>Radio Input</label>
                <input type="radio" name="rad" class="fom-control"/>
                <br/>
                <label>Date Input</label>
                <input class="form-control" type="date"/>
            </div>
        </form>
        -->

        <pre>team: {{ team }}</pre>

        <h3 id="priority-select">Team (& Game) Priority Select</h3>
        <krossover-priority-select
            priority="team.priority"
        ></krossover-priority-select>

        <h3 id="label-select">Team Label Select</h3>
        <krossover-label-select
            label="team.label"
        ></krossover-label-select>

        <h3 id="team-label-icons">Team Label Icons</h3>
        <div ng-repeat="label in LABELS">
            <krossover-team-label-icon
                label="label"
            ></krossover-team-label-icon>
            {{ label.name }}
        </div>
    </div>
`;
