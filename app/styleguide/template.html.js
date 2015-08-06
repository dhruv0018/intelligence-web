export default `

    <section class="styleguide">

        <aside class="sidebar">

            <nav role="navigation">

                <ul class="nav nav-pills nav-stacked">

                    <li ui-sref-active="active"><a href ui-sref="Styleguide.Colors">Colors</a></li>
                    <li ui-sref-active="active"><a href ui-sref="Styleguide.Typography">Typography</a></li>
                    <li ui-sref-active="active"><a href ui-sref="Styleguide.Buttons">Buttons</a></li>
                    <li ui-sref-active="active"><a href ui-sref="Styleguide.Forms">Forms</a></li>

                </ul>

            </nav>

        </aside>

        <main class="content" ui-view="content">

            <h1>Krossover Intelligence Styleguide</h1>

            <p>Marty there's a problem in the past! You have to go back! It's Tory, he's written a styleguide in the year 2014, but it was never published. If we don't go back in time and publish that styleguide... you will never exist!</p>

        </main>

    </section>
`;
