export default `

    <div class="forms">

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

    </div>
`;
