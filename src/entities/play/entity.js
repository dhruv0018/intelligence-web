import Video from '../video';
import Entity from '../entity';
import template from '../event/template';
import KrossoverEvent from '../event';

const schema = require('../../../schemas/play.json');

$KrossoverPlay.$inject = [
    'TagsetsFactory'
];

function $KrossoverPlay (
    tagsets
) {

    /**
     * KrossoverPlay Entity Model
     * @class KrossoverPlay
     */
    class KrossoverPlay extends Entity {

        /**
         * @constructs KrossoverPlay
         * @param {Object} play - Play JSON from server
         */
        constructor (play) {

            if (!play) {

                throw new Error('Invoking KrossoverPlay.constructor without KrossoverPlay or play JSON');
            }

            /* Validate event JSON */
            /* TODO: Re-enable this at some point. Right now, far too many
             * plays are failing validtion and polluting the console. */
            // if (!(play instanceof KrossoverPlay)) {
            //
            //     let validation = this.validate(play, schema);
            //
            //     if (validation.errors.length) {
            //
            //         console.warn(validation.errors.shift());
            //     }
            // }

            super(play);

            this.events = play.events || [];
            this.period = play.period || 0;
            this.indexedScore = play.indexedScore || 0;
            this.opposingIndexedScore = play.opposingIndexedScore || 0;
            this.customTagIds = play.customTagIds || [];
            this.hasVisibleEvents = false;
            this.possessionTeamId = play.possessionTeamId || null;

            if (play.clip instanceof Video) {

                this.clip = play.clip;
            } else {

                this.clip = play.clip ? new Video(play.clip) : null;
            }

            this.events = this.events.map(event => {

                if (!(event instanceof KrossoverEvent)) {

                    let tag = tagsets.getTag(event.tagId);
                    event = new KrossoverEvent(event, tag, event.time, this.gameId);
                }

                return event;
            });
        }

        /**
         * Getter returns an HTML string of the indexer script for the play.
         *
         * @readonly
         * @type {String} - HTML
         */
        get indexerScript () {

            return this.events.map(event => {

                if (event.indexerScript) {

                    let indexerScriptHTMLString = event.indexerFields.toString();
                    return template(event, indexerScriptHTMLString);
                }
            });
        }

        /**
         * Getter returns an HTML string of the summary script for the play.
         *
         * @readonly
         * @type {String} - HTML
         */
        get summaryScript () {

            return this.events.map(event => {

                if (event.summaryFields) {

                    return event;
                }
            })
            .filter(Boolean)
            .sort((a, b) => b.summaryPriority - a.summaryPriority)
            .slice(0, 2)
            .map(event => event.summaryHTML + '</br>')
            .join('');
        }

        /**
         * Getter returns an HTML string of the user script for the play.
         *
         * @readonly
         * @type {String} - HTML
         */
        get userScript () {

            return this.events.map(event => {

                let userScriptHTMLString = event.userFields.toString();
                return template(event, userScriptHTMLString);
            });
        }

        /**
         * Reverts the class instance to JSON suitable for the server.
         *
         * @method toJSON
         * @returns {String} - Stringified version of the object.
         */
        toJSON () {

            /* TODO: Construct this from the JSON schema. Currently, the schemas
             * is not up to date. Also, see `events` and `clip` where direct
             * assignment isn't suitable. */
            let copy = {

                id: this.id,
                startTime: this.startTime,
                endTime: this.endTime,
                events: this.events.map(event => event.toJSON()),
                gameId: this.gameId,
                flags: this.flags,
                clip: this.clip.toJSON(),
                shares: this.shares,
                period: this.period,
                indexedScore: this.indexedScore,
                opposingIndexedScore: this.opposingIndexedScore,
                customTagIds: this.customTagIds,
                hasVisibleEvents: this.hasVisibleEvents,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                possessionTeamId: this.possessionTeamId
            };

            return copy;
        }
    }

    return KrossoverPlay;
}

export default $KrossoverPlay;
