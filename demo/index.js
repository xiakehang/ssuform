import { stat } from "fs";

const parser = (cfg) => {

    const { viewSchema } = cfg;

    let state = {
        mode: 'create',
        values: {}
    };

    let $ = {
        mode: state.mode
    };

   
    return {
        getMode: () => {
            return state.mode;
        },

        setMode: (mode) => {
            state.mode = mode;
        },

        getValues: () => {
            return state.values;
        },

        setValue: (value = {}) => {
            const _values = Object.assign(_.cloneDeep(state.values), value);

            if (_.isEqual(_values, state.values)) return _values;

            
        }


    };
}


const schema = {
    "fields": [
        {
            "name": "name",
            "type": "string",
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": true,
            "readonly": "${$.mode == 'update'}",
            "widget": "input",
            "defaultValue": null,
            "label": "Name"
        }, {
            "name": "sex",
            "type": "string",
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": "${$.val('name') == 'aaron' ? false : true}",
            "readonly": "${$.val('name') == 'aaron' ? true : false}",
            "widget": "input",
            "defaultValue": null,
            "value": "${$.val('name') == 'aaron' ? 'male' : $.val('sex')}",
            "label": "Sex"
        }, {
            "name": "deposit",
            "type": "int",
            "minLength": 1,
            "maxLength": 25,
            "primaryKey": true,
            "required": true,
            "readonly": "${$.mode == 'update'}",
            "widget": "input",
            "defaultValue": 0,
            "value": "${$.val('sex') == 'male' ? 1000 : $.val('deposit')}",
            "label": "Depo"
        },


    ]
}