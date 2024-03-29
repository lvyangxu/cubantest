export default function reducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, [action.id]: action.value }
        default:
            return state
    }
}
