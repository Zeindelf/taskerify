
const setup = {
    message: 'AppModule',
};

const App = {
    init () {
        App.method();
    },

    method () {
        const m = setup.message;

        return window.console.log(m);
    },
};

export default {
    init: App.init,
};
