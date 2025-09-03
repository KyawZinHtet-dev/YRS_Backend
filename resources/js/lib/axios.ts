import Axios from 'axios';
import { setupCache, type HeaderInterpreter } from 'axios-cache-interceptor';

const myHeaderInterpreter: HeaderInterpreter = (headers) => {
    if (headers['x-my-custom-header']) {
        const seconds = Number(headers['x-my-custom-header']);

        if (seconds < 1) {
            return 'dont cache';
        }

        return seconds;
    }

    return 'not enough headers';
};

const instance = Axios.create();
export const axios = setupCache(instance, {
    headerInterpreter: myHeaderInterpreter,
});
