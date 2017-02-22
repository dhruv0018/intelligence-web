@ignore
Feature: Game Roster Film Exchange

    As a Coach(INTWEB-413)
    I should be able to copy a regular or scouting game from a film exchange that I was involved in
    and view my game roster
    amd view the opposing team roster

    Rules:
    - Both teams involved in the game must be canonical teams

    Scenario: Upload a regular game as a canonical team and share it to a film exchange
        
        Given I login as "Coach"
        When I switch to role "Girls lax Andrew"
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Regular Game"
        When I upload a game
        When I add opposing team "Northwestern W Test"
        Then I should see rosters on homeTeam
        Then I should see rosters on awayTeam
        When I go to film home
        When I click "share" on the first game
        When I click "your league or conference film exchange"
        When I select film exchange "Big1G"
        Then I should see a "film shared" confirmation

    Scenario: Copy a regular game from a film exchange that my team was involved in and view my game roster

        Given I login as "NORTHWESTERNWTEST_COACH"
        When I switch to role "Northwestern W Test"
        When I go to film exchange "Big1G"
        When I copy the first game
        When I go to film home
        Then I should see the copied game from the film exchange
        When I click on the copied game
        When I click Game Info
        When I click on my team name
        Then I should see the same roster for my team from when the game was uploaded
        When I click on opposing team name
        Then I should see the same roster for opposing team from when the game was uploaded

    Scenario: Upload a scouting game as a canonical team and share it to a film exchange
        
        Given I login as "Coach"
        When I switch to role "Girls lax Andrew"
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Scouting Game"
        When I upload a game
        When I add team "Girls lax Andrew"
        When I add opposing team "Northwestern W Test"
        Then I should see rosters on homeTeam
        Then I should see rosters on awayTeam
        When I go to film home
        When I click "share" on the first game
        When I click "your league or conference film exchange"
        When I select film exchange "Big1G"
        Then I should see a "film shared" confirmation

    Scenario: Copy a scouting game from a film exchange that my team was involved in and view my game roster

        Given I login as "NORTHWESTERNWTEST_COACH"
        When I switch to role "Northwestern W Test"
        When I go to film exchange "Big1G"
        When I copy the first game
        When I go to film home
        Then I should see the copied game from the film exchange
        When I click on the copied game
        When I click Game Info
        When I click on my team name
        Then I should see the same roster for my team from when the game was uploaded
        When I click on opposing team name
        Then I should see the same roster for opposing team from when the game was uploaded

Scenario: Upload a scouting game that involves two canonical teams, but does not involve my team and share it to a film exchange

        Given I login as "Coach"
        When I switch to role "Girls lax Andrew"
        When I click add film
        Then I should see the "coach/add-film" page
        When I click on "Scouting Game"
        When I upload a game
        When I add team "Nittany Lions"
        When I add opposing team "Northwestern W Test"
        Then I should see rosters on homeTeam
        Then I should see rosters on awayTeam
        When I go to film home
        When I click "share" on the first game
        When I click "your league or conference film exchange"
        When I select film exchange "Big1G"
        Then I should see a "film shared" confirmation

    Scenario: Copy a scouting game from a film exchange that my team was involved in and view my game roster

        Given I login as "NORTHWESTERNWTEST_COACH"
        When I switch to role "Northwestern W Test"
        When I go to film exchange "Big1G"
        When I copy the first game
        When I go to film home
        Then I should see the copied game from the film exchange
        When I click on the copied game
        When I click Game Info
        When I click on my team name
        Then I should see the same roster for my team from when the game was uploaded
        When I click on opposing team name
        Then I should see the same roster for opposing team from when the game was uploaded
