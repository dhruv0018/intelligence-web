Feature: Sign in as an Admin User
    As an Admin, I want to Sign In

    Scenario: Successfuly Sign In As A Type of User
        Given I have gone to the Home Page "login" and I'm not Signed In
        When I enter my correct email address "superadmin@krossover.com"
        And I enter my correct password "superadmin"
        And I press 'Sign In'
        Then I should see the page "users"


