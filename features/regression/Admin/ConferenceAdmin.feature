Feature: ConferenceAdmin

    As a Super Admin
    I should be able to search for and click on a conference
    and go to the conference as the film exchange admin

    Scenario: Admin can search for and click on a conference and go to the conference as a film exchange admin

    	Given I login as "SUPER_ADMIN"
    	When I click "Conferences" tab
    	When I search for conference with code "IWLCA"
    	When I click on the conference
    	Then I should see "IWLCA"
    	When I go to the conference as a film exchange admin
    	Then I should be able to go to the second page of results