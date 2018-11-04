import authReducer from '../../reducers/auth';

test('should set uid for login', ()=>{
    const action = {
        type: 'LOGIN',
        userProf:{
            uid: 'abc123',
            name: 'Tim',
            photo: 'http://localhost/photo.png',
            email: 'tim@gmail.com'
        }

    }
    const state = authReducer({}, action);
    expect(state.uid).toBe(action.userProf.uid);
});

test('should clear uid for logout', ()=>{
    const action = {
        type: 'LOGOUT'
    };
    const state = authReducer({uid: 'anything'}, action);
    expect(state).toEqual({});
});