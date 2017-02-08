Feature: ConferenceAssociations

    As a Super Admin
    I should be able to create an association, competition level, conference, sport and film exchange
    and add a conference to a team
    and verify that the team can access the film exchange

    Rules:
    -Association name + code must be unique
    -Competition level code + name must be unique within the association
    -Conference code + name must be unique within the association

    Scenario: Create an association

        Given I login as "SUPER_ADMIN"
        When I go to the "associations" page
        When I click add a new association
        When I enter association code "IGT"
        When I enter association name "IntegrationTest"
        When I enter association acronym "IGT"
        When I pick option "United States" from dropdown "association.country"
        When I pick option "Other" from dropdown "association.type"
        When I pick option "Primary" from dropdown "association.ageLevel"
        When I pick option "Both" from dropdown "association.amateurPro"
        When I save the association
        Then The association should be created

    Scenario: Create a competition level

        When I click Competition Levels tab
        When I enter competition code "IGT"
        When I enter competition name "IGT Competition Level"
        When I click Add Competition Level
        Then The competition level should be created

    Scenario: Create a conference

        When I click Conferences tab
        When I enter conference code "IGT"
        When I enter conference name "IGT Conference"
        When I click Add Conference
        Then The conference should be created

    Scenario: Add a sport to a conference

        When I click the Add Sport link
        When I pick option value "Male" from dropdown "newConferenceSport.gender"
        When I pick option "basketball" from dropdown "newConferenceSport.sportId"
        When I click Add Sport
        Then The sport should be added

    Scenario: Add film exchange

        When I click Film Exchanges tab
        When I select a conference gender sport
        When I make it visible to teams
        When I click Add Film Exchange
        Then The film exchange should be added

    Scenario: Add a conference to a team

        When I click "teams" on Admin menu
        When I search for team "India Basketball"
        When I click on the team "India Basketball"
        When I go to the Conferences tab
        When I search for the conference "IGT Conference"
        When I add the conference
        When I save the conference

    Scenario: Verify coach can access visible film exchange

        Given I sign out
        Given I navigate to the "login" page
        Given I login as "INDIABASKETBALL_COACH"
        When I switch to role "India Basketball"
        Then I should have access to the "IGT" film exchange

    Scenario: Verify coach cannot access invisible film exchange

        When I switch to role "Super Admin"
        When I go to the "associations" page
        When I click on association with name "IntegrationTest"
        When I click Film Exchanges tab
        When I edit the film exchange
        When I make the film exchange invisible to teams
        When I save
        When I switch to role "India Basketball"
        Then I should NOT have access to the "IGT" film exchange

    Scenario: Clean up data

        When I switch to role "Super Admin"
        When I click "teams" on Admin menu
        When I search for team "India Basketball"
        When I click on the team "India Basketball"
        When I go to the Conferences tab
        When I remove the conference from the team
        When I save the conference
        When I go to the "associations" page
        When I click on association with name "IntegrationTest"
        When I click Conferences tab
        When I delete the "conference"
        When I click Competition Levels tab
        When I delete the "competition level"
        When I click Association Information tab
        When I delete the association
        Then The association should be deleted
