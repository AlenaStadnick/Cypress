import { expect } from 'chai';
import { cy } from 'cypress';

const token: string = 'pk_42467672_YZAPGFF3Y4C5GWKC7GSVTH5NWQEO8U1T';
const teamId: string = '9015733476';
const baseUrl: string = 'https://api.clickup.com/api/v2/';

describe('ClickUp Goals API Tests', () => {
  let createdGoalId: string = '';
  let copiedGoalId: string = '';
  let createdKeyResultId: string = '';

  it('Get Goals', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}team/${teamId}/goal`,
      headers: {
        'Authorization': token
      },
      qs: {
        include_completed: true
      }
    }).then((response: Cypress.Response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('goals').that.is.an('array');
    });
  });

  it('Create Goal, Get Goal by ID, Update Goal, Delete Goal, Create Copy, Create Key Result, Edit Key Result, Delete Key Result', () => {
    // Create Goal
    cy.request({
      method: 'POST',
      url: `${baseUrl}team/${teamId}/goal`,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: {
        "name": "My Test Goal Name",
        "due_date": 1568036964079,
        "description": "Goal Description Lorem Ipsum",
        "multiple_owners": true,
        "owners": [183],
        "color": "#32a852"
      }
    }).then((response: Cypress.Response) => {
      expect(response.status).to.eq(200);
      createdGoalId = response.body.id;

      // Get Goal by ID
      return cy.request({
        method: 'GET',
        url: `${baseUrl}goal/${createdGoalId}`,
        headers: {
          'Authorization': token
        }
      }).then((getResponse: Cypress.Response) => {
        expect(getResponse.status).to.eq(200);
        // Check that the retrieved goal has the expected ID and name
        expect(getResponse.body).to.have.property('id').that.is.equal(createdGoalId);
        expect(getResponse.body).to.have.property('name').that.is.a('string').and.not.empty;
        expect(getResponse.body).to.have.property('description').that.is.a('string').and.not.empty;

        // Update Goal
        return cy.request({
          method: 'PUT',
          url: `${baseUrl}goal/${createdGoalId}`,
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: {
            "name": "Updated Goal Name NEW Test",
            "due_date": 1568036964079,
            "description": "Goal Description Lorem Ipsum",
            "rem_owners": [], // Empty array if no owners to remove
            "add_owners": [184], // New owners to add
            "color": "#32a852"
          }
        }).then((updateResponse: Cypress.Response) => {
          expect(updateResponse.status).to.eq(200);
          // Check that the update was successful
          expect(updateResponse.body).to.have.property('name').that.is.equal('Updated Goal Name NEW Test');
          expect(updateResponse.body).to.have.property('description').that.is.equal('Goal Description Lorem Ipsum');

          // Delete Goal
          return cy.request({
            method: 'DELETE',
            url: `${baseUrl}goal/${createdGoalId}`,
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          }).then((deleteResponse: Cypress.Response) => {
            expect(deleteResponse.status).to.eq(200);
            // Check that the goal was successfully deleted
            expect(deleteResponse.body).to.have.property('status').that.is.equal('success');

            // POST request to create a copy of the deleted Goal
            return cy.request({
              method: 'POST',
              url: `${baseUrl}team/${teamId}/goal`,
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
              },
              body: {
                "name": "Copy of Original Goal",
                "due_date": 1568036964079,
                "description": "Goal Description Copy",
                "multiple_owners": true,
                "owners": [183],
                "color": "#32a852"
              }
            }).then((copyResponse: Cypress.Response) => {
              expect(copyResponse.status).to.eq(200);
              copiedGoalId = copyResponse.body.id;

              // Create Key Result under the copied Goal
              return cy.request({
                method: 'POST',
                url: `${baseUrl}goal/${copiedGoalId}/key_result`,
                headers: {
                  'Authorization': token,
                  'Content-Type': 'application/json'
                },
                body: {
                  "name": "New Key Result Name",
                  "owners": [183],
                  "type": "number",
                  "steps_start": 0,
                  "steps_end": 10,
                  "unit": "km",
                  "task_ids": [],
                  "list_ids": []
                }
              }).then((keyResultResponse: Cypress.Response) => {
                expect(keyResultResponse.status).to.eq(200);
                createdKeyResultId = keyResultResponse.body.id;

                // Ensure the Key Result has been created successfully
                expect(keyResultResponse.body).to.have.property('name').that.is.equal('New Key Result Name');
                expect(keyResultResponse.body).to.have.property('type').that.is.equal('number');
                expect(keyResultResponse.body).to.have.property('steps_start').that.is.equal(0);
                expect(keyResultResponse.body).to.have.property('steps_end').that.is.equal(10);
                expect(keyResultResponse.body).to.have.property('unit').that.is.equal('km');

                // Edit Key Result
                return cy.request({
                  method: 'PUT',
                  url: `${baseUrl}key_result/${createdKeyResultId}`,
                  headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                  },
                  body: {
                    "steps_current": 5,
                    "note": "Target achieved"
                  }
                }).then((editKeyResultResponse: Cypress.Response) => {
                  expect(editKeyResultResponse.status).to.eq(200);
                  // Check that the key result was updated successfully
                  expect(editKeyResultResponse.body).to.have.property('steps_current').that.is.equal(5);
                  expect(editKeyResultResponse.body).to.have.property('note').that.is.equal('Target achieved');

                  // Delete Key Result
                  return cy.request({
                    method: 'DELETE',
                    url: `${baseUrl}key_result/${createdKeyResultId}`,
                    headers: {
                      'Authorization': token,
                      'Content-Type': 'application/json'
                    }
                  }).then((deleteKeyResultResponse: Cypress.Response) => {
                    expect(deleteKeyResultResponse.status).to.eq(200);
                    // Check that the key result was successfully deleted
                    expect(deleteKeyResultResponse.body).to.have.property('status').that.is.equal('success');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
