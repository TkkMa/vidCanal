import React from 'react';
import {shallow} from 'enzyme';
import Favorite from '../../components/Favorite';

test('should render Favorite page correctly', ()=>{
    const wrapper = shallow(<Favorite />);
    expect(wrapper).toMatchSnapshot();
})