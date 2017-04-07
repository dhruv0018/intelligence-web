Feature: Game Roster

    As a Coach
    I should be able to create a new non-canonical teams
    add existing canonical teams
    create new canonical teams 
    when uploading a regular or scouting game
    and view my game roster
    and view the opposing team roster

    Rules:
    - Uploading team must have a roster
    - Opposing canonical team must have a roster

    Scenario: Create a non-canonical team when uploading a regular game
        
        Given I login as "NORTHWESTERNWTEST_COACH"
        When I switch to role "Northwestern W Test"
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Regular Game"
        When I upload a game
        When I add new canonical team "IGTest"
        Then I should see a roster for the "home" team
        When I click on the Opposing Team tab
        Then I should NOT see a roster for the new non-canonical team
        When I click Game Info tab
        When I delete the game
        When I confirm the deletion
        Then I should see the "film-home" page
        Then I should see a confirmation that the game was deleted
 
 @ignore
    Scenario: Enter an existing canonical team as the away team when uploading a regular game

        When I go to film home
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Regular Game"
        When I upload a game
        When I add canonical team "Girls Lax Andrew"
        Then I should see a roster for the "home" team
        When I click on the Opposing Team tab
        Then I should see a roster for the "existing canonical" team
        When I click Game Info tab
        When I delete the game
        When I confirm the deletion
        Then I should see the "film-home" page
        Then I should see a confirmation that the game was deleted

    Scenario: Create a scouting game with the same canonical team for both home and away
        
        When I go to film home
        When I click add film
        When I click on "Scouting/Scrimmage"
        When I upload a game
        When I add home scouting canonical team "Northwestern W Test" and opposing scouting canonical team "Northwestern W Test"
        Then I should see a roster for the "home" team
        When I click on the Opposing Team tab
        Then I should see a roster for the "existing canonical" team
        When I click Game Info tab
        When I delete the game
        When I confirm the deletion
        Then I should see the "film-home" page
        Then I should see a confirmation that the game was deleted

    Scenario: Create a canonical team, add players, edit the team name

        When I go to film home
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Regular Game"
        When I upload a game
        When I add new canonical team "IGTest"
        Then I should see a roster for the "home" team
        When I click on the Opposing Team tab
        Then I should NOT see a roster for the new non-canonical team
        When I click Add New Player
        When I enter jersey number "15"
        When I enter first name "IG"
        When I enter last name "test"
        When I click Game Info tab
        When I edit the name of the team to "UPDATED"
        When I click on the Opposing Team tab
        Then I should still see the player I added with jersey number "15" first name "IG" and last name "test"
        When I click Game Info tab
        When I delete the game
        When I confirm the deletion
        Then I should see the "film-home" page
        Then I should see a confirmation that the game was deleted