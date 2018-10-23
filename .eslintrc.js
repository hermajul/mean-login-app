module.exports = {
    "extends": "airbnb-base",
    "rules":{
        "linebreak-style": 0,
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "prefer-destructuring": ["error", {"object": false, "array": false}],
        "no-underscore-dangle": ["warn", { "allow": ["_id"] }],
        "new-cap": ["2", { "newIsCap": false }],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
    }
    
    
};