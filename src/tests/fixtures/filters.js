import moment from 'moment';

export default {
    sortBy: 'relevance',
    uploadDate: 'allTime',
    startDate: moment().startOf('month'),
    endDate: moment(),
    text: '',
    resultsPerPage: 10,
    isSaved: false,
    count: 0,
    countIds:[]
}