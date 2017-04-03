@ignore
Feature: Athlete Recruit

    As an Athlete
    I should be able to create a recruit profile

    Rules:
    -Athlete must be part of a basketball team
    -Athlete must be part of a breakdown customer team

    Scenario: Athlete can fill out basic information

        Given I login as "BASKETBALL_ATHLETE"
        When I click Recruit tab
        Given I haven't created a recruit profile
        When I click "Create my profile"
        When I view basic information
        Then the first name, last name and email should be autofilled
        When I select "male" for the gender
        And I select "" for the month, "" for the day and "" for the year
        And I click Next
        Then I should be directed to the Parent/Guardian Info page

    Scenario: Athlete cannot enter the same email address in basic and parent information sections

        Given athlete's email is ""
        When I enter email "" for parent/guardian info
        And I click Next
        Then I should see error text 

    Scenario: Athlete can fill out parent/guardian information

        When I enter first name ""
        And I enter last name ""
        And I enter email "" for parent/guardian info
        And I click Next
        Then I should be directed to the School Info page

    Scenario: Athlete can fill out school information

        When I view the primary sport field
        Then I should see "Basketball" as the selected option
        When I view the current school info
        Then location and school name should be autofilled
        When I pick option "" from dropdown "grad year"
        And I pick option "" from dropdown "GPA"
        And I click Next
        Then I should be directed to the Vitals page

    Scenario: Athlete can fill out vitals

        When I view the vitals page
        Then positions should be autofilled
        When I pick option "" from dropdown "height"
        And I pick option "" from dropdown "weight"
        And I click Next
        Then I should be directed to the Preferences page

    Scenario: Athlete can fill out preferences

        When I pick option "" from dropdown "desired region"
        And I pick option "" from dropdown "desired school size"
        And I pick option "" from dropdown "desired major"
        And I click Next
        Then I should be directed to the Interests page

    Scenario: Athlete can fill out interests

        When I select options ""
        And I enter option "" for other interests
        And I click Next
        Then I should be directed to the Photo page

    Scenario: Athlete can upload a profile photo

        When I upload a photo
        Then I should see the edit photo and remove photo options

    Scenario: Athlete can remove profile photo

        When I remove the photo
        Then I should see the option to upload a photo