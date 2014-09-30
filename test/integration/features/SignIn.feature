Feature: Page Restrictions
    As a user that is unauthenticated, I should be redirected to the login page when visiting 
    restricted pages.

    Also, as a user that is logged in, I should be redirected accordingly if
    visiting restricted pages.

    Scenario: Redirect unauthenticated user to login page when visiting restricted page
        When I visit a restricted page
        Then I should be shown the "login" page

Feature: Authentication

    As a user, I should be able to sign-in and be redirected accordingly.

    However, if I do not provide adequate credentials, then I will not be redirected.

    Once signed-in, I should be able to sign-out and be redirected to login page again.

    Background:
        Given I navigate to "login"
    
    @logout
    Scenario Outline: An unauthenticated user signing in with valid credentials
        Given I am a "<User>"
        When I authenticate with the password "<Password>"
        Then I should be shown the "<Landing Page>" page
        Then I should see no console errors

        Examples: Different user types should landing on a unique url
            | User    | Landing Page | Password |
            | Admin   | users        | superadmin |

    Scenario: An unauthenticated user signing in with inadequate credentials
        Given I have an account
        When I authenticate with an invalid password
        Then I should be shown the "login" page

    Scenario Outline: An authenticated user signing out
        Given I am a "<User>"
        And I authenticate with the password "<Password>"
        And I sign out
        Then I should be shown the "login" page
        Then I should see no console errors

        Examples: Different user types
            | User    | Password   |
            | Admin   | superadmin |

#OLD LOGIN TEST
# Scenario: Successfully Sign In As An Admin User
#     Given I have gone to the Home Page "login"
#     When I am not logged in
#     And I enter my correct email address "superadmin@krossover.com"
#     And I enter my correct password "superadmin"
#     And I press the 'Sign-In' button
#     Then I should see the page "users"
#     # Then I should see no console errors

# Scenario: Unsuccessfully Sign In As An Admin User
#     Given I have gone to the Home Page "login" and I'm not Signed In
#     When I enter my correct email address "superadmin@krossover.com"
#     And I enter an incorrect password "incorrect"
#     And I press the 'Sign-In' button
#     Then I should see "Wrong password, try again." below the password field
#     # Then I should see no console errors