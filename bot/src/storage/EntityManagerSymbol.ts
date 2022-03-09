import { EntityManager } from 'typeorm';

export default EntityManager;

export const EntityManagerSymbol = Symbol.for('EntityManager');
