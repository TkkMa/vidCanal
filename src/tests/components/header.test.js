import React from 'react';
import {shallow} from 'enzyme';
import {Header} from '../../components/Header';
import { createMemoryHistory } from 'history';

let props, wrapper, e, value, history;
beforeEach(()=>{
    history= createMemoryHistory('/');
    props={history};
    wrapper = shallow(<Header {...props}/>);
    value = 'redux';
    e = {target:{value}, preventDefault: jest.fn()};
})
test('should render Header correctly', ()=>{
    expect(wrapper).toMatchSnapshot();
    // expect(wrapper.find('h1').text()).toBe(1);
    // const renderer = new ReactShallowRenderer();
    // renderer.render(<Header />);
    // expect(renderer.getRenderOutput()).toMatchSnapshot();
})

test('should render onChange of searchBar', ()=>{
    wrapper.find('SearchBar').prop('onChange')(e);
    expect(wrapper.state('term')).toBe(value);
});

test('should submit search results', ()=>{
    const setSearchKeySpy = jest.fn();
    history = {push: jest.fn()};
    const location= {pathname: '/saved'};
    wrapper = shallow(<Header 
                        {...props}
                        setSearchKey={setSearchKeySpy}
                        history={history}
                        location={location}
                    />);
    wrapper.find('SearchBar').prop('onSubmit')(e);
    expect(setSearchKeySpy).toHaveBeenLastCalledWith({
        text: '',
        reRender: true,
        didMount: true
    })
    expect(wrapper.state('term')).toBe('');
    expect(history.push).toHaveBeenLastCalledWith('/');
})