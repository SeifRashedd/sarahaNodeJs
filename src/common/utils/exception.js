const mainException = ({ message = 'Internal Server Error', cause = 500 }) => {
    throw new Error(message, { cause });
};




export const notFoundException = ({ message = 'Not Found' }) => {
    mainException({ message, cause: 404 });
}


export const unAuthorizedException = ({ message = 'Unauthorized' }) => {
    mainException({ message, cause: 401 });
}

export const conflictException = ({ message = 'Conflict' }) => {
    mainException({ message, cause: 409 });
}


export const forbiddenException = ({ message = 'Forbidden' }) => {
    mainException({ message, cause: 403 });
}

export const badRequestException = ({ message = 'Bad Request' }) => {
    mainException({ message, cause: 400 });
}


export const tooManyRequestsException = ({ message = 'Too Many Requests' }) => {
    mainException({ message, cause: 429 });
}


export const serverErrorException = ({ message = 'Internal Server Error' }) => {
    mainException({ message, cause: 500 });
}




