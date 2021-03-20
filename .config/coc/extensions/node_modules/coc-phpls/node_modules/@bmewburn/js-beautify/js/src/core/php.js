'use strict';

var TAG_PATTERN = /^<\?php (-?\d+) \?>$/;

var getIndentLevelAdjustment = function(raw_token) {
    var match = raw_token.text.match(TAG_PATTERN);
    if(!match) {
        return null;
    }
    return parseInt(match[1]);
}

var increaseIndentLevel = function(currentIndentLevel, phpIndentLevel) {
    if(phpIndentLevel === 0) {
        phpIndentLevel = 1;
    }

    return currentIndentLevel + phpIndentLevel;
}

var decreaseIndentLevel = function (currentIndentLevel, phpIndentLevel) {
    if (phpIndentLevel === 0) {
        phpIndentLevel = -1;
    }

    return Math.max(0, currentIndentLevel + phpIndentLevel);
}

var PHP = {
    getIndentLevelAdjustment: getIndentLevelAdjustment,
    increaseIndentLevel: increaseIndentLevel,
    decreaseIndentLevel: decreaseIndentLevel
}

module.exports.PHP = PHP;
