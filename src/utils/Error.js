const showError = error => {
    if(error && error.data && typeof error.data === 'object') {
        return Object.keys(error.data)[0]+': '+Object.values(error.data)[0]
    }

    return 'Something went wrong!';
}

export {
    showError
}