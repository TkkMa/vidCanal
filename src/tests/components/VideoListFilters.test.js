import React from 'react';
import {shallow} from 'enzyme';
import {VideoListFilters} from '../../components/VideoListFilters';
import filters from '../fixtures/filters';

let setSortBySpy, onSortByChangeSpy, setUploadDateSpy, onTimeChangeSpy, setResPerPageSpy, onNumChangeSpy;
let wrapper;

beforeEach(()=>{
    setSortBySpy = jest.fn();
    onSortByChangeSpy = jest.fn();
    setUploadDateSpy = jest.fn();
    onTimeChangeSpy = jest.fn();
    setResPerPageSpy = jest.fn();
    onNumChangeSpy = jest.fn();
    wrapper = shallow(<VideoListFilters
        filters={filters}
        setSortBy={setSortBySpy}
        onSortByChange={onSortByChangeSpy}
        setUploadDate={setUploadDateSpy}
        onTimeChange={onTimeChangeSpy}
        setResPerPage={setResPerPageSpy}
        onNumChange={onNumChangeSpy}
    />);
})

test('should update the sort criterion', ()=>{
    const value = 'viewCount';
    wrapper.find('select').at(0).simulate('change', {target:{value}});
    expect(setSortBySpy).toHaveBeenLastCalledWith(value);
    expect(onSortByChangeSpy).toHaveBeenLastCalledWith(undefined);
});

test('should update the date criterion', ()=>{
    const value ='week';
    wrapper.find('select').at(1).simulate('change', {target:{value}});
    expect(setUploadDateSpy).toHaveBeenLastCalledWith(value);
    expect(onTimeChangeSpy).toHaveBeenLastCalledWith(undefined);
});

test('should update number of filtered results', ()=>{
    const value=10;
    wrapper.find('#searchNum').simulate('change', {target:{value}});
    expect(setResPerPageSpy).toHaveBeenLastCalledWith(value);
    expect(onNumChangeSpy).toHaveBeenCalled();
})


