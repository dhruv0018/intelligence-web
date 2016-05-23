const pkg = require('../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const SELF_EDITOR_TEAM_ID_WHITELIST = [
    12576,
    313111,
    119883,
    194804,
    121772,
    119790,
    119748,
    129847,
    120659,
    119899,
    119892,
    119889,
    119760,
    119751,
    119744,
    119733,
    119692,
    119687,
    119400,
    119381,
    119374,
    119327,
    119273,
    119267,
    119262,
    119260,
    119247,
    119211,
    113122,
    37,
    91211,
    12168,
    4010,
    18050,
    162172,
    13461,
    19,
    18,
    248122,
    322638,
    322660,
    308227,
    308233,
    267414,
    322621,
    322625,
    298508,
    308150,
    308278,
    288790,
    308211,
    288782,
    308242,
    308256,
    303459,
    334871,
    322654,
    305991,
    287054,
    308238,
    322648,
    308130,
    322633,
    308245,
    262489,
    308281,
    272002,
    247928,
    322643,
    308200,
    308279,
    308085,
    322624,
    308223,
    322616,
    288741,
    334853,
    322622,
    308255,
    288774,
    308208,
    308250,
    308052,
    322615,
    322617,
    308252,
    288762,
    308123,
    308203,
    322657,
    267461,
    289746,
    288101,
    308133,
    247347,
    308142,
    308109,
    308217,
    334844,
    334991,
    322620,
    288771,
    308101,
    308122,
    334848,
    308121,
    288793,
    385171,
    247209,
    15455,
    406089,
    261593,
    261572,
    13040,
    106868,
    1625,
    285,
    268,
    92793,
    10413,
    270287,
    28287,
    56617,
    101396,
    43213,
    261570,
    261562,
    362635,
    113369,
    417306,
    405338,
    372256,
    319982,
    313388,
    309009,
    313385,
    13902,
    15008,
    53535,
    81712,
    124651,
    56233,
    164448,
    15822,
    153964,
    72820,
    110837,
    325898,
    280181,
    287131,
    247348,
    405384,
    16224,
    17982,
    15855,
    16223,
    17982,
    15854,
    457438
];


IntelligenceWebClient.constant('SELF_EDITOR_TEAM_ID_WHITELIST', SELF_EDITOR_TEAM_ID_WHITELIST);
