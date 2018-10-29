import React from 'react';
import {shallow} from 'enzyme';
import {VideoListItem} from '../../components/VideoListItem';
import sAVideos from '../fixtures/searchAPIVideos';

test('should render video list item', ()=>{
    const wrapper = shallow(<VideoListItem 
                                key={sAVideos.items[0].id.videoId}
                                video={sAVideos.items[0]}
                                searchKey='redux'
                            />);
    expect(wrapper).toMatchSnapshot();
})
