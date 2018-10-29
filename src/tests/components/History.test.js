import React from 'react';
import {shallow} from 'enzyme';
import History from '../../components/History';

test('should render history page correctly', ()=>{
    const wrapper = shallow(<History />);
    expect(wrapper).toMatchSnapshot();
})