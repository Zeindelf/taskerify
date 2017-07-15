
const setup = {
    message: 'MainModule',
};

const Main = {
    init () {
        Main.method();
    },

    method () {
        const m = setup.message;
        const arr = [
            'one',
            'two',
            'trhee',
        ];

        if ( arr.length > 0 ) {
            return window.console.log(m);
        }
    },
};

export default {
    init: Main.init,
};
