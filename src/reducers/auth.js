export default (state={}, action)=>{
    switch(action.type) {
        case 'LOGIN':
            return{
                uid: action.userProf.uid,
                name: action.userProf.name,
                photo: action.userProf.photo,
                email: action.userProf.email
            };
        case 'LOGOUT':
            return {};
        default:
            return state;
    }
}