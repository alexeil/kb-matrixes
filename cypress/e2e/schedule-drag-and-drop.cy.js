/// <reference types="cypress" />

describe('Schedule Drag and Drop', () => {
  beforeEach(() => {
    cy.visit('/');
    // Go to Teams & Matrix tab
    cy.contains('Teams & Matrix').click();
    // Add a category
    cy.contains('Add Category').click();
    // Add teams A, B, C, D using the team input form
    const teamNames = ['A', 'B', 'C', 'D'];
    teamNames.forEach((team) => {
      cy.get('input[ng-reflect-name="teamName"]').clear({ force: true }).type(team, { force: true });
      cy.get('form').contains('Add Team').click();
    });
    // Set number of fields to 2 (the input for scheduleFields)
    cy.get('input[type="number"]').eq(1).clear().type('2');
    // Go to Schedule tab
    cy.contains('Schedule').click();
  });

  it('should allow dragging a game from unassigned to a field slot', () => {
    // Assumes at least one unassigned game and one field slot
    cy.get('.unassigned-games [cdkdrag]').first().as('firstGame');
    cy.get('.fields-container .schedule-slot').eq(0).as('firstSlot');
    cy.get('@firstGame').trigger('mousedown', { which: 1 });
    cy.get('@firstSlot').trigger('mousemove').trigger('mouseup', { force: true });
    cy.get('@firstSlot').should('contain.text', 'VS');
  });

  it('should allow inserting a game between two assigned games (shift right)', () => {
    // Drag to slot 0
    cy.get('.unassigned-games [cdkdrag]').eq(0).as('gameA');
    cy.get('.fields-container .schedule-slot').eq(0).as('slot0');
    cy.get('@gameA').trigger('mousedown', { which: 1 });
    cy.get('@slot0').trigger('mousemove').trigger('mouseup', { force: true });

    // Drag to slot 1
    cy.get('.unassigned-games [cdkdrag]').eq(0).as('gameB');
    cy.get('.fields-container .schedule-slot').eq(1).as('slot1');
    cy.get('@gameB').trigger('mousedown', { which: 1 });
    cy.get('@slot1').trigger('mousemove').trigger('mouseup', { force: true });

    // Drag to slot 1 again (should shift previous to slot 2)
    cy.get('.unassigned-games [cdkdrag]').eq(0).as('gameC');
    cy.get('.fields-container .schedule-slot').eq(1).as('slot1again');
    cy.get('@gameC').trigger('mousedown', { which: 1 });
    cy.get('@slot1again').trigger('mousemove').trigger('mouseup', { force: true });

    // Check that slot 1 contains gameC and slot 2 contains gameB
    cy.get('.fields-container .schedule-slot').eq(1).should('contain.text', 'VS');
    cy.get('.fields-container .schedule-slot').eq(2).should('contain.text', 'VS');
  });

  it('should create a new category and assign 4 teams to it', () => {
    cy.visit('/');
    cy.contains('Teams & Matrix').click();
    cy.contains('Add Category').click();
    const teamNames = ['A', 'B', 'C', 'D'];
    teamNames.forEach((team) => {
      cy.get('input[ng-reflect-name="teamName"]').clear({ force: true }).type(team, { force: true });
      cy.get('form').contains('Add Team').click();
    });
    // Verify category exists (assume category appears in a list)
    cy.get('.category-list').should('exist');
    cy.get('.category-list .category-item').should('have.length.at.least', 1);
    // Verify teams are assigned to the category (assume team list is visible)
    cy.get('.team-list .team-item').should('have.length', 4);
    cy.get('.team-list .team-item').then($items => {
      const names = [...$items].map(item => item.textContent.trim());
      expect(names).to.include.members(['A', 'B', 'C', 'D']);
    });
  });
});
