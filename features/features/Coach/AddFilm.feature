Feature: AddFilm

    As a coach
    I should be able to upload game
    and create game roster
    and choose breakdown for the game

    Rules:
    - To upload regular game, coach's team must have an active roster
    - To copy team roster into game roster, coach's team must be a canonical team

    Scenario: Coach once login should see the film home page

        #Given There is a "COACH"
        Given I navigate to the "login" page
        Given I am a "COACH"
        When I authenticate with valid credentials
        Then I should see the "film-home" page

    Scenario: Coach can upload regular game

        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Regular Game"
        Then I upload a game
        Then I should see the "information" page

    @tag1
    Scenario: Coach can save game and create game roster
        When I add opposingTeam "test"
        Then I should see rosters on homeTeam
