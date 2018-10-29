import selectVideos from '../../selectors/videos';
import moment from 'moment';
import videos from '../fixtures/videos';

test('should filter by text value', ()=>{
    const filters = {
        text: 'redux',
        startDate: undefined,
        endDate: undefined,
        isSaved: false
    }
    const result = selectVideos(videos, filters);
    expect(result).toEqual([videos[3], videos[2], videos[1]]);
})

test('should filter by startDate', ()=>{
    const filters={
        text:'',
        startDate: moment(0),
        endDate: undefined
    }
    const result = selectVideos(videos, filters);
    expect(result).toEqual([videos[4], videos[3]]);
})

test('should filter by endDate', ()=>{
    const filters={
        text:'',
        startDate: undefined,
        endDate: moment(0).add(2, 'days')
    }
    const result = selectVideos(videos, filters);
    expect(result).toEqual([videos[2], videos[1], videos[0]]);
})

test('should sort by date',()=>{
    const filters={
        text: '',
        startDate: undefined,
        endDate: undefined
    }
    const result = selectVideos(videos,filters);
    expect(result).toEqual([videos[4], videos[3], videos[2], videos[1], videos[0]]);
})