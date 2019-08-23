// import { stat } from "fs";


const schema = {
    "xtype": "dataform",
    "fields": [
        {
            "name": "id",
            "type": "string",
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": true,
            "widget": "input",
            "defaultValue": null,
            "label": "Id"
        }, {
            "name": "name",
            "type": "string",
            "minLength": 1,
            "maxLength": 25,
            "required": true,
            "readonly": "exp: $.mode == 'update'",
            "widget": "input",
            "defaultValue": null,
            "label": "Name"
        }, {
            "name": "sex",
            "type": "string",
            "condition": [
                "exp: $.val('name')"
            ],
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": "exp: $.val('name') == 'aaron' ? false : true",
            "readonly": "exp: $.val('name') == 'aaron' ? true : false",
            "widget": "input",
            "defaultValue": null,
            "value": "exp: $.val('name') == 'aaron' ? 'male' : $.val('sex')",
            "label": "Sex"
        }, {
            "name": "deposit",
            "type": "int",
            "condition": [
                "exp: $.val('sex') "
            ],
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": true,
            "readonly": "exp: $.mode == 'update'",
            "widget": "input",
            "defaultValue": 0,
            "value": "exp: $.val('sex') == 'male' ? 1000 : $.val('deposit')",
            "label": "Depo"
        },


    ]
}

