import React from 'react';
import {shallow} from 'enzyme';
import {HistoryListItem} from '../../components/HistoryListItem';
import videos from '../fixtures/videos';
import moment from 'moment';

test('should render History video list item', ()=>{
    const wrapper = shallow(<HistoryListItem 
                                key={videos[0].id+1}
                                video={videos[0]}
                            />);
    expect(wrapper).toMatchSnapshot();
})

test('should render no video list items with message', ()=>{
    const wrapper = shallow(<HistoryListItem 
                                video={{}}
                            />);
    expect(wrapper).toMatchSnapshot();
})

test('should revert to / after item click', ()=>{
    const startSelectVideoSpy = jest.fn();
    const history = {push: jest.fn()};
    const resultDetail={
        'london tourism': {
            hits: []
        }
    };
    const wrapper = shallow(<HistoryListItem
                                key={videos[0].id+1}
                                video={videos[0]}
                                startSelectVideo={startSelectVideoSpy}
                                history={history}
                                resultDetail={resultDetail}
                            />);
    wrapper.find('li').at(0).simulate('click');
    expect(startSelectVideoSpy).toHaveBeenLastCalledWith({
        searchKey: videos[0].searchKey,
        updatedHitSelect: [],
        video: [videos[0]],
        viewedAt: moment().utc().toISOString(),
        isSaved: videos[0].isSaved,
        reRender:false,
        didMount: false
    });
    expect(history.push).toHaveBeenLastCalledWith('/');
})