import ArenaFieldDefinition from './directive';

const Arena = angular.module('Field.Arena', []);

Arena.directive('arenaField', () => new ArenaFieldDefinition());

export default Arena;
