
const symbolMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
};

export default class InputSanitizer {
    constructor() {
    }

    clean(input) {
        return input.replace(/[&<>"'/]/g, function(m) { return symbolMap[m]; });
    }
}
