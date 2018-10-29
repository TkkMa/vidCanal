import React from 'react';
import {shallow} from 'enzyme';
import {FavoriteList} from '../../components/FavoriteList';
import videos from '../fixtures/videos';
import sortUniqueVids from '../../selectors/favorites';

test('should render Favorite List with videos', ()=>{
    const uniqVids = sortUniqueVids(videos);
    const wrapper = shallow(<FavoriteList 
                                uniqueLikedVideos={uniqVids}
                                />);
    expect(wrapper).toMatchSnapshot();
});

test('should render Favorite List with empty message', ()=>{
    const uniqVids = [];
    const wrapper = shallow(<FavoriteList 
                                uniqueLikedVideos={uniqVids}
                            />);
    expect(wrapper).toMatchSnapshot();
});

// test('should render clicked video opening up modal', ()=>{
//     const uniqVids = sortUniqueVids(videos);
//     const wrapper = shallow(<FavoriteList 
//                                 uniqueLikedVideos={uniqVids}
//                             />);
//     wrapper.find('FavoriteListItem').props('handleOpenModal')(uniqVids[0]);
//     expect(wrapper.state('showModal')).toBe(true);
//     expect(wrapper.state('clickedVideo')).toEqual(uniqVids[0]);
// });