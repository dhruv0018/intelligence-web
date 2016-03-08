const pkg = require('../../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const BACKFIELD_FORMATION_GRID = {
    ROW: {
        ONE: 70,
        TWO: 45,
        THREE: 20,
        FOUR: -5
    },
    COL: {
        LEFT: 100,
        MIDDLE: 70,
        RIGHT: 40,
        H_LEFT: 115,
        H_RIGHT: 25
    }
};

const FLANK_FORMATION_GRID = {
    ROW: {
        ONE: 95,
        TWO: 70,
        THREE: 45
    },
    COL: {
        ONE: 290,
        TWO: 260,
        THREE: 230,
        FOUR: 200,
        FIVE: 170,
        SIX: 140,
        SEVEN: 110,
        EIGHT: 80,
        NINE: 50
    }
};

const QB_UC = {
    x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
    y: BACKFIELD_FORMATION_GRID.ROW.ONE
};

const QB_PISTOL = {
    x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
    y: BACKFIELD_FORMATION_GRID.ROW.TWO
};

const QB_GUN = {
    x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
    y: BACKFIELD_FORMATION_GRID.ROW.THREE
};

const FORMATION_IDS = {

    '1': 'QB_GUN_EMPTY',
    '2': 'QB_GUN_ACE',
    '3': 'QB_GUN_RIGHT',
    '4': 'QB_GUN_LEFT',
    '5': 'QB_GUN_SPLITBACK',
    '6': 'QB_GUN_I_RIGHT',
    '7': 'QB_GUN_I_LEFT',
    '8': 'QB_GUN_STAR',
    '9': 'QB_GUN_OTHER',
    '10': 'QB_PISTOL_EMPTY',
    '11': 'QB_PISTOL_ACE',
    '12': 'QB_PISTOL_RIGHT',
    '13': 'QB_PISTOL_LEFT',
    '14': 'QB_PISTOL_SPLITBACK',
    '15': 'QB_PISTOL_I_RIGHT',
    '16': 'QB_PISTOL_I_LEFT',
    '17': 'QB_PISTOL_STAR',
    '18': 'QB_PISTOL_OTHER',
    '19': 'QB_UC_EMPTY',
    '20': 'QB_UC_ACE',
    '21': 'QB_UC_ACE_RIGHT',
    '22': 'QB_UC_ACE_LEFT',
    '23': 'QB_UC_I_FORM',
    '24': 'QB_UC_I_RIGHT',
    '25': 'QB_UC_I_LEFT',
    '26': 'QB_UC_SPLITBACK',
    '27': 'QB_UC_SPLITBACK_RIGHT',
    '28': 'QB_UC_SPLITBACK_LEFT',
    '29': 'QB_UC_T',
    '30': 'QB_UC_POWER_I_RIGHT',
    '31': 'QB_UC_POWER_I_LEFT',
    '32': 'QB_UC_MARYLAND',
    '33': 'QB_UC_WISHBONE',
    '34': 'QB_UC_OTHER',
    '35': 'TE_ONLY',
    '36': 'TE_WITH_WING',
    '37': 'TE_WITH_FLANKER_PRO',
    '38': 'TE_TRIPS',
    '39': 'SE_ONLY',
    '40': 'WING_WITH_SE_SLOT',
    '41': 'SE_AND_FLANKER_TWINS',
    '42': 'SE_TRIPS',
    '43': 'BUNCH_TIGHT',
    '44': 'BUNCH_WIDE',
    '45': 'STACK',
    '46': 'OTHER',
    '47': 'TE_ONLY',
    '48': 'TE_WITH_WING',
    '49': 'TE_WITH_FLANKER_PRO',
    '50': 'TE_TRIPS',
    '51': 'SE_ONLY',
    '52': 'WING_WITH_SE_SLOT',
    '53': 'SE_AND_FLANKER_TWINS',
    '54': 'SE_TRIPS',
    '55': 'BUNCH_TIGHT',
    '56': 'BUNCH_WIDE',
    '57': 'STACK',
    '58': 'TE_WING_OVER_TRIPS',
    '59': 'OTHER',
    '60': 'QB_GUN_LEFT_H_RIGHT',
    '61': 'QB_GUN_ACE_H_RIGHT',
    '62': 'QB_GUN_RIGHT_H_RIGHT',
    '63': 'QB_GUN_LEFT_H_LEFT',
    '64': 'QB_GUN_ACE_H_LEFT',
    '65': 'QB_GUN_RIGHT_H_LEFT',
    '66': 'QB_GUN_SPLITBACK_H_RIGHT',
    '67': 'QB_GUN_SPLITBACK_H_LEFT',
    '68': 'QB_PISTOL_LEFT_H_RIGHT',
    '69': 'QB_PISTOL_ACE_H_RIGHT',
    '70': 'QB_PISTOL_RIGHT_H_RIGHT',
    '71': 'QB_PISTOL_LEFT_H_LEFT',
    '72': 'QB_PISTOL_ACE_H_LEFT',
    '73': 'QB_PISTOL_RIGHT_H_LEFT',
    '74': 'QB_PISTOL_SPLITBACK_H_RIGHT',
    '75': 'QB_PISTOL_SPLITBACK_H_LEFT',
    '76': 'EMPTY',
    '77': 'TE_WING_OVER_QUADS',
    '78': 'WING_TRIPS',
    '79': 'WING_ONLY',
    '80': 'TE_WING_OVER_TRIPS',
    '81': 'SE_QUADS',
    '82': 'EMPTY',
    '83': 'WING_TRIPS',
    '84': 'TE_WING_OVER_QUADS',
    '85': 'WING_ONLY',
    '86': 'SE_QUADS'
};

IntelligenceWebClient.constant('FORMATION_IDS', FORMATION_IDS);

const FORMATIONS = {

    QB_GUN_EMPTY: {
        name: 'QB Gun - Empty',
        type: 'Backfield',
        ids: [1],
        players: {
            qb: QB_GUN
        }
    },
    QB_GUN_ACE: {
        name: 'QB Gun - Ace',
        type: 'Backfield',
        ids: [2],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_GUN_RIGHT: {
        name: 'QB Gun - Right',
        type: 'Backfield',
        ids: [3],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_GUN_LEFT: {
        name: 'QB Gun - Left',
        type: 'Backfield',
        ids: [4],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_GUN_SPLITBACK: {
        name: 'QB Gun - Splitback',
        type: 'Backfield',
        ids: [5],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_GUN_I_RIGHT: {
        name: 'QB Gun - I Right',
        type: 'Backfield',
        ids: [6],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_GUN_I_LEFT: {
        name: 'QB Gun - I Left',
        type: 'Backfield',
        ids: [7],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_GUN_STAR: {
        name: 'QB Gun - Star',
        type: 'Backfield',
        ids: [8],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_GUN_OTHER: {
        name: 'QB Gun - Other',
        type: 'Backfield',
        ids: [9],
        players: {
            qb: QB_GUN
        }
    },
    QB_GUN_LEFT_H_RIGHT: {
        name: 'QB Gun - Left, H-Right',
        type: 'Backfield',
        ids: [60],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_ACE_H_RIGHT: {
        name: 'QB Gun - Ace, H-Right',
        type: 'Backfield',
        ids: [61],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_RIGHT_H_RIGHT: {
        name: 'QB Gun - Right, H-Right',
        type: 'Backfield',
        ids: [62],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_LEFT_H_LEFT: {
        name: 'QB Gun - Left, H-Left',
        type: 'Backfield',
        ids: [63],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_ACE_H_LEFT: {
        name: 'QB Gun - Left, H-Left',
        type: 'Backfield',
        ids: [64],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_RIGHT_H_LEFT: {
        name: 'QB Gun - Right, H-Left',
        type: 'Backfield',
        ids: [65],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_SPLITBACK_H_RIGHT: {
        name: 'QB Gun - Splitback, H-Right',
        type: 'Backfield',
        ids: [66],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_GUN_SPLITBACK_H_LEFT: {
        name: 'QB Gun - Splitback, H-Left',
        type: 'Backfield',
        ids: [67],
        players: {
            qb: QB_GUN,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_EMPTY: {
        name: 'QB Pistol - Empty',
        type: 'Backfield',
        ids: [10],
        players: {
            qb: QB_PISTOL
        }
    },
    QB_PISTOL_ACE: {
        name: 'QB Pistol - Ace',
        type: 'Backfield',
        ids: [11],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_PISTOL_RIGHT: {
        name: 'QB Pistol - Right',
        type: 'Backfield',
        ids: [12],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            }
        }
    },
    QB_PISTOL_LEFT: {
        name: 'QB Pistol - Left',
        type: 'Backfield',
        ids: [13],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            }
        }
    },
    QB_PISTOL_SPLITBACK: {
        name: 'QB Pistol - Splitback',
        type: 'Backfield',
        ids: [14],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            }
        }
    },
    QB_PISTOL_I_RIGHT: {
        name: 'QB Pistol - I Right',
        type: 'Backfield',
        ids: [15],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_PISTOL_I_LEFT: {
        name: 'QB Pistol - I Left',
        type: 'Backfield',
        ids: [16],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_PISTOL_STAR: {
        name: 'QB Pistol - Star',
        type: 'Backfield',
        ids: [17],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_PISTOL_OTHER: {
        name: 'QB Pistol - Other',
        type: 'Backfield',
        ids: [18],
        players: {
            qb: QB_PISTOL
        }
    },
    QB_PISTOL_LEFT_H_RIGHT: {
        name: 'QB Pistol - Left, H-Right',
        type: 'Backfield',
        ids: [68],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_ACE_H_RIGHT: {
        name: 'QB Pistol - Ace, H-Right',
        type: 'Backfield',
        ids: [69],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_RIGHT_H_RIGHT: {
        name: 'QB Pistol - Right, H-Right',
        type: 'Backfield',
        ids: [70],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_LEFT_H_LEFT: {
        name: 'QB Pistol - Left, H-Left',
        type: 'Backfield',
        ids: [71],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_ACE_H_LEFT: {
        name: 'QB Pistol - Ace, H-Left',
        type: 'Backfield',
        ids: [72],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_RIGHT_H_LEFT: {
        name: 'QB Pistol - Right, H-Left',
        type: 'Backfield',
        ids: [73],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_SPLITBACK_H_RIGHT: {
        name: 'QB Pistol - Splitback, H-Right',
        type: 'Backfield',
        ids: [74],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.H_RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_PISTOL_SPLITBACK_H_LEFT: {
        name: 'QB Pistol - Splitback, H-Left',
        type: 'Backfield',
        ids: [75],
        players: {
            qb: QB_PISTOL,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.H_LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.ONE
            }
        }
    },
    QB_UC_EMPTY: {
        name: 'QB UC - Empty',
        type: 'Backfield',
        ids: [19],
        players: {
            qb: QB_UC
        }
    },
    QB_UC_ACE: {
        name: 'QB UC - Ace',
        type: 'Backfield',
        ids: [20],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_UC_ACE_RIGHT: {
        name: 'QB UC - Ace Right',
        type: 'Backfield',
        ids: [21],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_UC_ACE_LEFT: {
        name: 'QB UC - Ace Left',
        type: 'Backfield',
        ids: [22],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_UC_I_FORM: {
        name: 'QB UC - I Form',
        type: 'Backfield',
        ids: [23],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_I_RIGHT: {
        name: 'QB UC - I Right',
        type: 'Backfield',
        ids: [24],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_I_LEFT: {
        name: 'QB UC - I Left',
        type: 'Backfield',
        ids: [25],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_SPLITBACK: {
        name: 'QB UC - Splitback',
        type: 'Backfield',
        ids: [26],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_SPLITBACK_RIGHT: {
        name: 'QB UC - Splitback Right',
        type: 'Backfield',
        ids: [27],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_SPLITBACK_LEFT: {
        name: 'QB UC - Splitback LEFT',
        type: 'Backfield',
        ids: [28],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_T: {
        name: 'QB UC - T',
        type: 'Backfield',
        ids: [29],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_POWER_I_RIGHT: {
        name: 'QB UC - Power I Right',
        type: 'Backfield',
        ids: [30],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.FOUR
            }
        }
    },
    QB_UC_POWER_I_LEFT: {
        name: 'QB UC - Power I Left',
        type: 'Backfield',
        ids: [31],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_MARYLAND: {
        name: 'QB UC - Maryland',
        type: 'Backfield',
        ids: [32],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_WISHBONE: {
        name: 'QB UC - Wishbone',
        type: 'Backfield',
        ids: [33],
        players: {
            qb: QB_UC,
            back1: {
                x: BACKFIELD_FORMATION_GRID.COL.RIGHT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            },
            back2: {
                x: BACKFIELD_FORMATION_GRID.COL.MIDDLE,
                y: BACKFIELD_FORMATION_GRID.ROW.TWO
            },
            back3: {
                x: BACKFIELD_FORMATION_GRID.COL.LEFT,
                y: BACKFIELD_FORMATION_GRID.ROW.THREE
            }
        }
    },
    QB_UC_OTHER: {
        name: 'QB UC - Other',
        type: 'Backfield',
        ids: [34],
        players: {
            qb: QB_UC
        }
    },
    TE_ONLY: {
        name: 'TE Only',
        type: 'Flank',
        ids: [35, 47],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    TE_WITH_WING: {
        name: 'TE With Wing',
        type: 'Flank',
        ids: [36, 48],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    TE_WITH_FLANKER_PRO: {
        name: 'TE With Flanker (Pro)',
        type: 'Flank',
        ids: [37, 49],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    TE_TRIPS: {
        name: 'TE Trips',
        type: 'Flank',
        ids: [38, 50],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    SE_ONLY: {
        name: 'SE Only',
        type: 'Flank',
        ids: [39, 51],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    WING_WITH_SE_SLOT: {
        name: 'SE With Wing (Slot)',
        type: 'Flank',
        ids: [40, 52],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    SE_AND_FLANKER_TWINS: {
        name: 'SE And Flanker (Twins)',
        type: 'Flank',
        ids: [41, 53],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    SE_TRIPS: {
        name: 'SE Trips',
        type: 'Flank',
        ids: [42, 54],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.FIVE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    BUNCH_TIGHT: {
        name: 'Bunch Tight',
        type: 'Flank',
        ids: [43, 55],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.TWO,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.THREE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.FOUR,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    BUNCH_WIDE: {
        name: 'Bunch Wide',
        type: 'Flank',
        ids: [44, 56],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.EIGHT,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    STACK: {
        name: 'Stack',
        type: 'Flank',
        ids: [45, 57],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.THREE
            }
        }
    },
    OTHER: {
        name: 'Other',
        type: 'Flank',
        ids: [46, 59],
        players: {}
    },
    TE_WING_OVER_TRIPS: {
        name: 'TE Wing Over (Trips)',
        type: 'Flank',
        ids: [58, 80],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.TWO,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    EMPTY: {
        name: 'Empty',
        type: 'Flank',
        ids: [76, 82],
        players: {}
    },
    TE_WING_OVER_QUADS: {
        name: 'TE Wing Over (Quads)',
        type: 'Flank',
        ids: [77, 84],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.TWO,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            },
            flank4: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    WING_TRIPS: {
        name: 'Wing Trips',
        type: 'Flank',
        ids: [78, 83],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    },
    WING_ONLY: {
        name: 'Wing Only',
        type: 'Flank',
        ids: [79, 85],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.ONE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            }
        }
    },
    SE_QUADS: {
        name: 'SE Quads',
        type: 'Flank',
        ids: [81, 86],
        players: {
            flank1: {
                x: FLANK_FORMATION_GRID.COL.THREE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank2: {
                x: FLANK_FORMATION_GRID.COL.FIVE,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank3: {
                x: FLANK_FORMATION_GRID.COL.SEVEN,
                y: FLANK_FORMATION_GRID.ROW.TWO
            },
            flank4: {
                x: FLANK_FORMATION_GRID.COL.NINE,
                y: FLANK_FORMATION_GRID.ROW.ONE
            }
        }
    }
};

IntelligenceWebClient.constant('FORMATIONS', FORMATIONS);
export default {FORMATIONS, FORMATION_IDS};
