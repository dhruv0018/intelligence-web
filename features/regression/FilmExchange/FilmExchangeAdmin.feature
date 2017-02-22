Feature: FilmExchangeAdmin

    As a Film Exchange Admin
    I should be able to search for a game within a film exchange
    and view the raw film of a game
    and suspend a team from the film exchange

    Rules:
    - To suspend a team, the team must already be part of the film exchange

    Scenario: Upload a game and share it to a film exchange

        Given I login as "LACROSSE_COACH"
        When I switch to role "Lacrosse Test"
        When I click add film
        When I click on "Regular Game"
        When I upload a game
        When I add canonical team "Girls Lax Andrew"
        When I go to film home
        When I share the first game with "Test" film exchange

    Scenario: Search for a game by away team and date played within the film exchange

        When I switch to role "Film Exchange Admin"
        Then I should see the "film-exchange" page
        When I go to the "Test" film exchange
        When I search for games with team name "Girls Lax Andrew"
        Then I should see all games that involved team "Girls Lax Andrew"
        When I click to reset search results
        When I search for games that were played today
        Then I should see the game that I uploaded today
        Then I should only see games that were played today

    Scenario: Click on a game in a film exchange view the raw film

        When I click to reset search results
        When I click on a game in the film exchange
        When I click to play the raw film
        Then I should see a pause button
        When I close the modal

    Scenario: Suspend a team from a film exchange and verify that team's coach cannot access it

        When I click to manage team access
        Then I should see a modal to manage access for teams in the film exchange
        When I suspend the team "Lacrosse Test"
        When I close the modal
        When I switch to role "Lacrosse Test"
        Then the team's coach should not be able to access the "Test" film exchange

    Scenario: Enable team from film exchange and verify team's coach can access it

        When I switch to role "Film Exchange Admin"
        When I go to the "Test" film exchange
        When I click to manage team access
        When I enable the team "Lacrosse Test"
        When I close the modal
        When I switch to role "Lacrosse Test"
        Then the team's coach should be able to access the "Test" film exchange