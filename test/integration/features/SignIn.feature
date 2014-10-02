# Feature: Page Restrictions

#     As a user that is unauthenticated, I should be redirected to the login page when visiting 
#     restricted pages.

#     Also, as a user that is logged in, I should be redirected accordingly if
#     visiting restricted pages.

#     Scenario: Redirect unauthenticated user to login page when visiting restricted page
#         When I visit a restricted page
#         Then I should be shown the "login" page


# Feature: Authentication

#     As a user, I should be able to sign-in and be redirected accordingly.

#     However, if I do not provide adequate credentials, then I will not be redirected.

#     Once signed-in, I should be able to sign-out and be redirected to the login page again.

#     Background:
#         Given I navigate to "login"

#     Scenario Outline: An unauthenticated user signing in with valid credentials and signing out     
#         Given I am a "<User>"
#         When I authenticate with valid credentials
#         Then I should be shown the "<Landing Page>" page
#         And I sign out
#         Then I should be shown the "login" page

#         Examples: Different user types should landing on a unique url
#             | User  | Landing Page |  
#             | Admin | users        |  

#     @Admin
#     Scenario: An unauthenticated Admin signing in with inadequate credentials
        
#         Only test the admin since all users should see the same result.
#         If the Admin doesn't get the correct result, no user will.

#         Given I am a "Admin"
#         When I authenticate with an invalid password
#         Then I should be shown the "login" page

@ADMIN
Feature: Queue
    
    Scenario: Searching on the Queue page
    
        Given I navigate to "schools"
        Then I should be shown the "schools" page

# Feature: Athlete Profile

# OLD LOGIN TEST
# Scenario: Successfully Sign In As An Admin User
#     Given I have gone to the Home Page "login"
#     When I am not logged in
#     And I enter my correct email address "superadmin@krossover.com"
#     And I enter my correct password "superadmin"
#     And I press the 'Sign-In' button
#     Then I should see the page "users"
    # Then I should see no console errors

# Feature: Plans and Packages
    
#     Scenario: Add new plan

#         Given I have no plans 
#         When I add a new plan
#         Then I should be prompted to add a new plan
        
        


# Scenario: Unsuccessfully Sign In As An Admin User
#     Given I have gone to the Home Page "login" and I'm not Signed In
#     When I enter my correct email address "superadmin@krossover.com"
#     And I enter an incorrect password "incorrect"
#     And I press the 'Sign-In' button
#     Then I should see "Wrong password, try again." below the password field
#     # Then I should see no console errors