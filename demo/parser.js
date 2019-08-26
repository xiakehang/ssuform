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
        val: () => {},
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

        state.values = fields.reduce((acc, f, index) => {

            if (isExpression(f.value)) {
                acc[f.name] = parseExpression(f.value, { $ });
            }

            if (isExpression(f.defaultValue) && !state.touched[f.name]) {
                acc[f.name] = parseExpression(f.defaultValue, { $ });
            }

            acc[f.name] = values[f.name] || null;

            return acc;

        }, {});



    }

    // initial values
    state.fields = filterFieldsByCondition(schema.fields, originalValues, $);
    state.value = calc(state.fields);


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
        change: (changed = {}) => {

            // mark field as touched/dirty
            Object.keys(changed).forEach(fieldname => {
                state.touched[fieldname] = true;

                if (originalValues[fieldname] !== changed[fieldname]) {
                    state.dirty[fieldname] = changed[fieldname];
                }
            })

            state.fields = filterFieldsByCondition(schema.fields, Object.assign({}, state.value, changed), $);
            state.values = calc(state.fields, Object.assign({}, state.values, changed));

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

            return eval(results.join('&'));

        }
    });

    return fields_;
}

const parseExpression = (exp, params) => {

    exp = exp.startsWith('exp: ') ? exp.replace('exp: ', '') : exp;

    const names = Object.keys(params);
    const vals = Object.values(params);

    try {
        rslt = new Function(...names, `return ${exp}`)(...vals);
    } catch (error) {
        console.warn('parsing expression error \n' + error);
    }


}