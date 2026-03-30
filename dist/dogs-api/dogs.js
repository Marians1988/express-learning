import axios from 'axios';
import { from, map } from 'rxjs';
export function readDogs$() {
    const request = axios.get('https://dogapi.dog/api/v2/breeds', {
        headers: { Accept: "application/json" }
    });
    return from(request).pipe(map(req => req.data));
}
