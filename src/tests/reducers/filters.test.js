import moment from 'moment';
import filtersReducer from '../../reducers/filters';

test('should setup default filter values', ()=>{
    const state = filtersReducer(undefined,{ type: '@@INIT'});
    expect(state).toEqual({
        sortBy: 'relevance',
        uploadDate: 'allTime',
        startDate: moment().startOf('month'),
        endDate: moment(),
        text: '',
        resultsPerPage: 10,
        isSaved: false,
        count: 0,
        countIds:[]       
    })
});

test('should set sort by', ()=>{
    const text = 'popularity';
    const action ={
        type: 'SET_SORT_BY',
        text
    };
    const state = filtersReducer(undefined, action);
    expect(state.sortBy).toBe(text);
})

test('should set upload date', ()=>{
    const text = moment();
    const action={
        type:'SET_UPLOAD_DATE',
        text
    }
    const state = filtersReducer(undefined, action);
    expect(state.uploadDate).toBe(text);
})

test('should set results per page', ()=>{
    const num = 20;
    const action={
        type: 'SET_RESULTS_PER_PAGE',
        num
    }
    const state = filtersReducer(undefined,action);
    expect(state.resultsPerPage).toBe(num);
});

test('should set favorite count',()=>{
    const favCount={
        count: 2,
        countIds: [1,2,5]
    };
    const action={
        type: 'SET_FAV_COUNT',
        favCount
    };
    const state = filtersReducer(undefined, action);
    expect(state.count).toBe(2);
    expect(state.countIds).toEqual([1,2,5]);
});

test('should set startDate filter', ()=>{
    const startDate = moment();
    const action={
        type:'SET_START_DATE',
        startDate
    }
    const state = filtersReducer(undefined, action);
    expect(state.startDate).toEqual(startDate);
})

test('should set endDate filter', ()=>{
    const endDate = moment();
    const action={
        type:'SET_END_DATE',
        endDate
    }
    const state = filtersReducer(undefined, action);
    expect(state.endDate).toEqual(endDate);
})

test('should set text filter', ()=>{
    const text= 'hello';
    const action={
        type: 'SET_TEXT_FILTER',
        text
    }
    const state = filtersReducer(undefined, action);
    expect(state.text).toBe(text);
})

test('should set isSaved filter', ()=>{
    const isSaved = true;
    const action={
        type: "TOGGLE_ISSAVED_FILTER",
        isSaved
    }
    const state = filtersReducer(undefined, action);
    expect(state.isSaved).toBe(isSaved);
})