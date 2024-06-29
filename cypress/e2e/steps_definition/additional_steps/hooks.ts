// import {User} from '@test-data/data-objects/users/user';
//
import {User} from '@test-data/data-objects/users/user';
import { When} from "@badeball/cypress-cucumber-preprocessor";

When('Read users from file', () => {
  if (Cypress.env('users') === ''){
  cy.fixture('users.csv').then((txt) => {
    // Split the file content into rows (assuming it's comma-separated)
    const rows = txt.split('\n');

    // Process each row
    const users: User[] = [];
    rows.map((row) => {
      const columns = row.split(',');
      let user: User = {
        deviceId: columns[1],
        phone: columns[2],
        secretAnswer: columns[3],
        secretQuestion: columns[4],
        hint: columns[5],
        password: columns[6],
        bvn: columns[7],
        nin: columns[8],
        image: columns[9],
        pin: columns[10]
      }
      users.push(user)

    });
    Cypress.env('users', users)
  })
  }
})


// beforeEach( () => {
//   cy.fixture('users.csv').then((txt) => {
//     // Split the file content into rows (assuming it's comma-separated)
//     const rows = txt.split('\n');
//
//     // Process each row
//     const users: User[] = [];
//     const data = rows.map((row) => {
//       const columns = row.split(',');
//       let user: User = {
//         deviceId: columns[1],
//         phone: columns[2],
//         secretAnswer: columns[3],
//         secretQuestion: columns[4],
//         hint: columns[5],
//         password: columns[6],
//         bvn: columns[7],
//         nin: columns[8],
//         image: columns[9],
//         pin: columns[10]
//       }
//       users.push(user)
//
//     });
//     //   Cypress.env('name', 'Joe')
//
//     cy.wrap(users).as('users')
//
//   })
//   cy.wrap(String(' ')).as('accessToken');
//
// })
//   Cypress.env('name', 'Joe')
//   expect(Cypress.env('name')).to.equal('Joe')
