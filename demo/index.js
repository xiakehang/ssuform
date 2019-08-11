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
        }


    };
}