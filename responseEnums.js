const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}

const Error_Message = {
    ERROR: 'Error occurs when execute query on database',
    INVALID: 'Invalid information',
    FINDING_ERROR: (entity) => {
        return 'Cannot find this ' + entity + ' in the database'
    }
}

module.exports = {
    State,
    Error_Message
}