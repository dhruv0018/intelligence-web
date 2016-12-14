Feature: Admin

    As Admin, I should be able to sign-in and perform related actions.

    Scenario: An authenticated Admin signing in with valid credentials

        Given I login as "ADMIN"
        Then I should see the "users" page

    Scenario: Admin can not add team without valid postal code

        Given Admin click "schools" on Admin menu
        When Admin click add a new school
        When I pick option "High School" from dropdown "type"
        When I enter "Test" for Input name "name"
        When I enter "New York" for Input name "city"
        When I enter "US" for Input name "country"
        When I enter "NY" for Input name "state"
        Then The save school button should be disabled
