import React from 'react';
import {shallow} from 'enzyme';
import {FavoriteListItem} from '../../components/FavoriteListItem';
import videos from '../fixtures/videos';
import sortUniqueVids from '../../selectors/favorites';

test('should render Favorite video list item without new badge', ()=>{
    const uniqVids = sortUniqueVids(videos);
    const countIds = [];
    const wrapper = shallow(<FavoriteListItem 
                                key={uniqVids[0].id+1}
                                video={uniqVids[0]}
                                countIds={countIds}
                            />);
    expect(wrapper).toMatchSnapshot();
})

test('should render Favorite video list item with ONE new badge', ()=>{
    const uniqVids = sortUniqueVids(videos);
    const countIds = [uniqVids[0].id];
    const wrapper = shallow(<FavoriteListItem 
                                key={uniqVids[0].id+1}
                                video={uniqVids[0]}
                                countIds={countIds}
                            />);
    expect(wrapper).toMatchSnapshot();
})