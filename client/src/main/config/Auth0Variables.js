var __i = 'mock';
var __a = 'mock';
var ISMOCK = true;
var TOKEN_MOCK = "1kjlasd8adas9da79as6da76d";


var LOCK_CONFIG = {
    auth: {
        redirect: false
    },
    theme: {
        logo: 'img/icons/ms-icon-150x150.png',
        primaryColor: "#673AB7"
    },
    languageDictionary: {
        title: "Piton"
    },
    autoclose: true,
    additionalSignUpFields: [{
        name: 'given_name',
        placeholder: 'First name',
        // icon: 'http://fontawesome.io/icon/user-o/',
        validator: function(name) {
            return {
                valid: name.length > 0,
                hint: "Cannot be empty!" // optional
            };
        }
    },{
        name: 'family_name',
        placeholder: 'Last name',
        // icon: 'http://fontawesome.io/icon/user-o/',
        validator: function(name) {
            return {
                valid: name.length > 0,
                hint: "Cannot be empty!" // optional
            };
        }
    }]
};