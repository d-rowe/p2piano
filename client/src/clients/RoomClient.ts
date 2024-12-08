import axios from 'axios';

import type {Room} from '../lib/workspaceTypes';

const BASE_URL = process.env.API_URL;

export async function createNewRoom() {
    return axios.post(BASE_URL + '/room');
}

export async function createSession() {
    const response = await axios.post(BASE_URL + '/session');
    return response.data;
}

export async function getRoom(roomId: string): Promise<Room> {
    return get('/room/' + roomId);
}

async function get(endpoint: string) {
    const rawResponse = await fetch(BASE_URL + endpoint);
    const response = await rawResponse.json();
    const {statusCode} = response;
    if (!statusCode) {
        return response;
    }

    const codeFamily = Math.floor(statusCode / 100) * 100;
    if (codeFamily === 400 || codeFamily === 500) {
        throw new Error(response.message);
    }
}
