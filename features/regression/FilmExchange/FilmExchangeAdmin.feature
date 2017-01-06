@ignore
Feature: FilmExchangeAdmin

    As a Film Exchange Admin
    I should be able to search for a game within a film exchange
    and view the raw film of a game
    and suspend a team from the film exchange

    Rules:
    - To suspend a team, the team must already be part of the film exchange
 
 	Scenario: Search for a game by away team and date played within the film exchange

 		Given I login as "FILM_EXCHANGE_ADMIN" 
 		When I switch to role "Film Exchange Admin"
 		When I go to the "Big8" film exchange
 		#When I search for games with team name ""
 		#Then I should see all games that involed team ""
 		#When I search for games that were played on ""
 		#Then I should see all games that were played on ""

 	Scenario: Click on a game in a film exchange view the raw film

 		#Given I click on a game in the film exchange
 		#Then I should see a modal with the game information
 		#Then I should be able to play the raw film
 		#Then I should be able to close the modal

 	Scenario: Suspend a team from a film exchange and verify that team's coach cannot access it

 		#When I click to manage team access
 		#Then I should see a modal to manage access for teams in the film exchange
 		#When I suspend the team "Northwestern W Test"
 		#When I close the modal
 		#When I switch to role "Northwestern W Test"
 		#When I click the Film Exchange menu
 		#Then the team's coach should not be able to access the film exchange
