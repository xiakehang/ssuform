const Parser = function(cfg) {

    const { schema, originalValues = {}, mode } = cfg;

    let state = {
        mode: mode || 'create',
        values: {},
        fields: [],
        touched: {},
        dirty: {}
    };

    let $ = {
        mode: state.mode,
        val: (key) => {
            return state.values[key];
        },
        sel: () => {}
    };

    // core function
    const calc = (fields = [], values = {}) => {
        // if (!values) {
        //     state.values = fields.reduce((acc, f, index) => {
        //         acc[f.name] = isExpression(f.defaultValue) ?
        //             parseExpression(f.defaultValue, { $ }) :
        //             f.defaultValue;

        //         return acc;

        //     }, {});
        // }

        return fields.reduce((acc, f, index) => {

            if (isExpression(f.value)) {
                acc[f.name] = parseExpression(f.value, { $ });
                return acc;
            }

            if (isExpression(f.defaultValue) && !state.touched[f.name]) {
                acc[f.name] = parseExpression(f.defaultValue, { $ });
                return acc;
            }

            acc[f.name] = values[f.name] || null;

            return acc;

        }, {});



    }

    // initial values
    state.fields = filterFieldsByCondition(schema.fields, originalValues, $);
    state.values = calc(state.fields);


    // get values by initial values
    const parser = {

        getMode: () => {
            return state.mode;
        },

        setMode: (mode) => {
            state.mode = mode;
        },

        getValues: (changed) => {
            if (changed) {
                parser.change(changed);
            }
            console.log(state.values);
            return state.values;
        },

        setValue: (value = {}) => {
            const _values = Object.assign(_.cloneDeep(state.values), value);

            if (_.isEqual(_values, state.values)) return _values;


        },
        change: (changed = {}, touch) => {

            // mark field as touched/dirty
            if (touch !== false) {

                Object.keys(changed).forEach(fieldname => {
                    state.touched[fieldname] = true;

                    if (originalValues[fieldname] !== changed[fieldname]) {
                        state.dirty[fieldname] = changed[fieldname];
                    }
                });
            }

            // update state.values
            state.values = Object.assign({}, state.values, changed);

            const fields = filterFieldsByCondition(schema.fields, state.values, $);
            state.values = calc(fields, state.values);

            if (JSON.stringify(fields.map(f => f.name)) !== JSON.stringify(state.fields.map(f => f.name))) {
                state.fields = fields;
                parser.change(state.values, false);
            }

        }


    };

    return parser;
}




const isExpression = (str) => typeof str == 'string' ? str.indexOf('exp:') === 0 : false;

const filterFieldsByCondition = (fields = [], values, $) => {
    let fields_ = [];

    const pass = (con, values) => {
        return !!parseExpression(typeof con == 'string' ? con : con['expression'], { $ });
    }

    fields.forEach(f => {
        if (!f.condition) {
            fields_.push(f);

        } else {
            let results = [];

            f.condition.forEach(itm => {
                results.push(pass(itm, values));
            });

            const rslt = eval(results.join('&'));

            if (rslt) {
                fields_.push(f);
            }

        }
    });

    return fields_;
}

const parseExpression = (exp, params) => {

    exp = exp.startsWith('exp: ') ? exp.replace('exp: ', '') : exp;

    const names = Object.keys(params);
    const vals = Object.values(params);

    let rslt = undefined;

    try {
        rslt = new Function(...names, `return ${exp}`)(...vals);
    } catch (error) {
        console.warn('parsing expression error \n' + error);
    }

    return rslt;


}