import { v4 as uuidv4 } from 'uuid';

const generateFileName = (type: string) => {
    return `${uuidv4()}.${type}`;
}

export {
    generateFileName
}
