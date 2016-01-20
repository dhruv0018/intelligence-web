var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var ALLOWED_FILE_EXTENSIONS = [
    '.flv',  '.asf',  '.qt',   '.mov',   '.mpg',    '.mpeg',     '.avi',   '.mod',   '.wmv',
    '.mp4',  '.m4v',  '.3gp',  '.mkv',   '.vob',    '.vro',      '.aaf',   '.avchd', '.m1v',
    '.m2v',  '.mpe',  '.ogg',  '.ogv',   '.3g2',    '.3gp2',     '.3gpp2', '.3p2',   '.60d',
    '.787',  '.ajp',  '.amv',  '.bik',   '.bix',    '.box',      '.bs4',   '.byu',   '.camrec',
    '.cvc',  '.d2v',  '.d3v',  '.dav',   '.dce',    '.divx',     '.dlx',   '.dmb',   '.dmsm',
    '.dpg',  '.dsy',  '.dv',   '.dvr',   '.dvr-ms', '.dvx',      '.evo',   '.eye',   '.f4v',
    '.fbr',  '.fbz',  '.gts',  '.gvi',   '.h264',   '.hdmov',    '.hkm',   '.iva',   '.ivf',
    '.ivs',  '.jts',  '.jtv',  '.k3g',   '.lrec',   '.lsf',      '.m15',   '.m1pg',  '.m21',
    '.m2p',  '.m2t',  '.m2ts', '.m4e',   '.m75',    '.mgv',      '.mj2',   '.mjp',   '.mjpg',
    '.mmv',  '.mnv',  '.moov', '.movie', '.mp21',   '.mp2v',     '.mp4v',  '.mpeg4', '.zmv',
    '.mpg2', '.mpv',  '.mpv2', '.mqv',   '.mts',    '.mtv',      '.mvd',   '.mve',   '.mvp',
    '.nsv',  '.nuv',  '.ogm',  '.ogx',   '.par',    '.pmf',      '.pns',   '.pva',   '.pvr',
    '.pxv',  '.qtm',  '.r3d',  '.rec',   '.rm',     '.rmd',      '.roq',   '.rp',    '.rts',
    '.rv',   '.scc',  '.scm',  '.sec',   '.sfd',    '.sfvidcap', '.smv',   '.ssm',   '.str',
    '.svi',  '.tivo', '.tod',  '.tp',    '.tp0',    '.tpd',      '.tsp',   '.vc1',   '.vcv',
    '.veg',  '.vfw',  '.vgz',  '.vid',   '.video',  '.viv',      '.vivo',  '.vp3',   '.vp6',
    '.vp7',  '.vs4',  '.vse',  '.webm',  '.wm',     '.wot',      '.xvid',  '.yuv',   '.zm1',
    '.zm2',  '.zm3',  '.ts',   '.mxf',   '.gxf'
];

IntelligenceWebClient.constant('ALLOWED_FILE_EXTENSIONS', ALLOWED_FILE_EXTENSIONS);
