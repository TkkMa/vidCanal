import uniqueVids from '../../selectors/favorites';
import videos from '../fixtures/videos';

test('should find the latest viewed, unique, liked video', ()=>{
    const result = uniqueVids(videos);
    expect(result).toEqual([videos[4], videos[3],videos[1]]);
})