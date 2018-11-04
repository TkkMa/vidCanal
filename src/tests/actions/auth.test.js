import {login, logout} from '../../actions/auth';

test('should generate login action object', ()=>{
    const userProf = {
        uid: 'abc123',
        name: 'Tim',
        photo: 'http://localhost/photo.png',
        email: 'tim@gmail.com'
    };
    const action = login(userProf);
    expect(action).toEqual({
        type: 'LOGIN',
        userProf
    });
});

test('should generate logout action object', ()=>{
    const action = logout();
    expect(action).toEqual({
        type: 'LOGOUT'
    });
});