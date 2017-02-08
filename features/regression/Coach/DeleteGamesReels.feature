@ignore
Feature: Delete Games and Reels

    As a coach
    I should be able to delete games and reels

    Rules:
    - Breakdown must exist on coach's account in order to create a reel

    Scenario: Upload a game 

        Given I login as "INDIABASKETBALL_COACH"
        When I switch to role "India Basketball"
        When I click add film
        When I click on "Regular Game"
        When I upload a game
        When I add a home game
        When I add new canonical team "IntegrationTestTeam"
        When I go to film home
        Then I should see the "film-home" page
        Then I should see the game involving "IntegrationTestTeam" on film home

    Scenario: Delete the game that was uploaded

        When I select "IntegrationTestTeam" game
        When I delete the game
        When I confirm the deletion
        Then I should see the "film-home" page
        Then I should see a confirmation that the game was deleted
        Then I should not see the game involving "IntegrationTestTeam" on film home

    Scenario: Create a reel

        When I filter and select first breakdown
        Then I should see the "breakdown" page
        When I refresh the page
        When I select the first play
        When I click Add to Reel
        When I click Create New Reel
        When I create the reel with name "IGTest Reel"
        When I go to film home
        When I click "Reels" tab on film home
        Then I should see a reel with name "IGTest Reel" on film home

    Scenario: Delete a reel

        When I select first reel
        When I delete the reel
        When I confirm the reel deletion
        Then I should see the "film-home" page
        Then I should be on the Reels tab
        Then I should not see the reel involving "IGTest Reel" on film home