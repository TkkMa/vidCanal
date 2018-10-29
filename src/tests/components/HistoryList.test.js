import React from 'react';
import {shallow} from 'enzyme';
import {HistoryList} from '../../components/HistoryList';
import videos from '../fixtures/videos';

test('should render HistoryList with videos', ()=>{
    const resultDetail={
        redux: {
            hits: videos
        }
    };
    const wrapper = shallow(<HistoryList 
                                displayVideos={videos}
                                resultDetail={resultDetail}
                                />);
    expect(wrapper).toMatchSnapshot();
});

test('should render HistoryList with empty message', ()=>{
    const resultDetail={
        redux:{
            hits:[]
        }
    }
    const wrapper = shallow(<HistoryList 
                                displayVideos={[]}
                                resultDetail={resultDetail}
                            />);
    expect(wrapper).toMatchSnapshot();
})