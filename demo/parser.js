
const parser = function (cfg) {

    const { uischema, originalValues, mode } = cfg;

    let state = {
        mode: mode || 'create',
        values: {},
        fields: []
    };

    let $ = {
        mode: state.mode,
        val: () => { },
        sel: () => { }
    };

    // core function
    const calc = (fields = [], values) => {
        if (!values) {
            state.values = fields.reduce((acc, f, index) => {
                acc[f.name] = isExpression(f.defaultValue) ?
                    parseExpression(f.defaultValue, { $ }) :
                    f.defaultValue;

                return acc;

            }, {});
        }

    }

    // initial values
    state.fields = filterFieldsByCondition(uischema.fields, $);
    state.value = calc(state.fields);


    // get values by initial values
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


        },
        change: (values = {}) => {
            calc();
            return state.values;
        }


    };
}




const isExpression = (str) => typeof str == 'string' ? str.indexOf('exp:') === 0 : false;

const filterFieldsByCondition = (fields = [], $) => {
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
