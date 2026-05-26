Feature: Add a comment to a portfolio project

  As a user viewing a portfolio project
  I want to be able to add a comment
  So that I can share my feedback or thoughts

  Scenario: Successfully opening the comment modal and submitting a comment
    Given I am viewing a portfolio project page
    When I click on the "Add a comment" button at the bottom of the page
    Then a modal window with a comment form should open
    When I fill in the following details:
      | First Name | John                         |
      | Last Name  | Doe                          |
      | Comment    | This is an amazing project! |
    And I submit the form
    Then my comment should be successfully added to the project

