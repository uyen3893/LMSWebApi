const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}

const error_message = 'Error occurs when execute query on database'
const invalid_error_message = 'Invalid information'
const error_message_while_finding_an_entity = (entity) => {
    return 'Cannot find this ' + entity + ' in the database'
}

module.exports = {
    error_message,
    State,
    invalid_error_message,
    error_message_while_finding_an_entity
}