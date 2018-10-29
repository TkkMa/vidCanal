import React from 'react';
import {shallow} from 'enzyme';
import {VideoList} from '../../components/VideoList';
import sAVideos from '../fixtures/searchAPIVideos';

test('should render videoList with videos', ()=>{
    const results={
        redux: {
            hits: sAVideos.items
        }
    };
    const wrapper = shallow(<VideoList 
                                results={results}
                                searchKey='redux'
                                pageToken=''
                                pageActive={1}
                                lastPageReached={false}
                                lastPageFound={false}
                                numResults={5}
                                error={undefined}
                            />);
    expect(wrapper).toMatchSnapshot();
});

test('should render videoList with empty message', ()=>{
    const results={
        redux:{
            hits:[]
        }
    }
    const wrapper = shallow(<VideoList 
                                results={results}
                                searchKey='redux'
                                pageToken=''
                                pageActive={1}
                                lastPageReached={false}
                                lastPageFound={false}
                                numResults={5}
                                error={undefined}
                            />);
    expect(wrapper).toMatchSnapshot();
})