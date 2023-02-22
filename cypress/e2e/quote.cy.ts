/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

describe('quoting flow', () => {
  it('should quote a car succesfully', () => {
    cy.visit('/')

    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')

    cy.contains(/tipo de auto/i).click({ force: true })

    cy.get('li[role="option"]').contains(/usado/i).click({ force: true })

    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')

    cy.get('button')
      .contains(/ver autos/i)
      .click({ force: true })

    cy.url().should('include', '/catalog')

    cy.get('.animate-pulse', { timeout: 10000 }).should('not.exist')

    cy.get('a')
      .contains(/ver detalle/i)
      .click({ force: true })

    cy.url().should('include', 'vehicle')

    cy.get('button')
      .contains(/cotizar/i)
      .click({ force: true })

    cy.url({ timeout: 20000 }).should('include', 'form')

    /* Filling out the form */
    cy.get('input[id="name"]').type(faker.name.firstName())

    cy.get('input[id="lastname"]').type(faker.name.lastName())

    cy.get('input[id="rut"]').type('111111111')

    cy.get('input[id="email"]').type(faker.internet.email())

    cy.get('input[id="phoneNumber"]').type('111111111')

    cy.get('textarea[id="message"]').type(faker.lorem.lines(1))

    cy.get('button')
      .contains(/enviar/i)
      .click({ force: true })

    cy.get('.animate-spin', { timeout: 20000 }).should('not.exist')

    cy.url().should('include', 'success')
  })
})

const asModule = {}
export default asModule
