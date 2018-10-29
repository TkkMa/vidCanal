import React from 'react';
import {shallow} from 'enzyme';
import {HistoryListFilters} from '../../components/HistoryListFilters';
import filters from '../fixtures/filters';
import moment from 'moment';

test('should render history list filter bar correctly', ()=>{

    const wrapper = shallow(<HistoryListFilters 
                                filters={filters} 
                            />);
    expect(wrapper).toMatchSnapshot();
});

test('should filter by likes', ()=>{
    const onSwitchChangeSpy = jest.fn();
    const wrapper = shallow(<HistoryListFilters 
                                filters={filters} 
                                toggleIsSavedFilter={onSwitchChangeSpy}    
                            />);
    const initialCheckedState = wrapper.state('checked');
    wrapper.find('input').at(0).simulate('change');
    expect(onSwitchChangeSpy).toHaveBeenLastCalledWith(!initialCheckedState);
    expect(wrapper.state('checked')).toBe(!initialCheckedState);                        
});

test('should set filtered text on input change', ()=>{
    const value = 'redux';
    const onTextChangeSpy = jest.fn();
    const wrapper = shallow(<HistoryListFilters 
                                filters={filters}
                                setTextFilter={onTextChangeSpy}
                            />);
    wrapper.find('input').at(1).simulate('change',{
        target : {value}
    });
    expect(onTextChangeSpy).toHaveBeenLastCalledWith(value);
});

test('should clear text on close icon click', ()=>{
    const value = '';
    const onTextChangeSpy = jest.fn();
    const wrapper = shallow(<HistoryListFilters 
                                filters={filters}
                                setTextFilter={onTextChangeSpy}    
                            />);
    wrapper.find('i').at(1).simulate('click', {target:"#historySearchBar i"});
    expect(wrapper.find('input#search').props().value).toBe('');
    expect(onTextChangeSpy).toHaveBeenLastCalledWith(value);
})

test('show modal upon clicking delete', ()=>{
    const wrapper = shallow(<HistoryListFilters filters={filters}/>);
    wrapper.find('i').at(2).simulate('click');
    expect(wrapper.state('showModal')).toBe(true);
})

test('should set new date on date change', ()=>{
    const setStartDateSpy = jest.fn();
    const setEndDateSpy = jest.fn();
    const now = moment();
    const early = moment();
    const wrapper = shallow(<HistoryListFilters
                                filters={filters}
                                setStartDate={setStartDateSpy}
                                setEndDate={setEndDateSpy}
                            />);
    wrapper.find('withStyles(DateRangePicker)').prop('onDatesChange')({startDate:early, endDate:now});
    expect(setStartDateSpy).toHaveBeenLastCalledWith(early);
    expect(setEndDateSpy).toHaveBeenLastCalledWith(now);
})

test('should set calendar focus on change', ()=>{
    const wrapper = shallow(<HistoryListFilters
        filters={filters}
    />);
    const calendarFocused = true;
    wrapper.find('withStyles(DateRangePicker)').prop('onFocusChange')(calendarFocused);
    expect(wrapper.state('calendarFocused')).toBe(calendarFocused);
})