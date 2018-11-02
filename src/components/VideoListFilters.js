import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {setSortBy, setUploadDate, setResPerPage} from '../actions/filters';

export class VideoListFilters extends Component {

    componentDidMount(){
        const ele1 = ReactDOM.findDOMNode(this.refs.sortbyDropdown);
        const ele2 = ReactDOM.findDOMNode(this.refs.timeDropdown);

        $(ele1).ready(function(){
            $('select').formSelect();
        });
        $(ele2).ready(function(){
            $('select').formSelect();
        });
    }
    onSortChange = (e) =>{
        const sortVal = e.target.value;
        this.props.setSortBy(sortVal);
        this.props.onSortByChange(undefined);
    };

    onDateChange = (e) =>{
        const dateVal = e.target.value;
        this.props.setUploadDate(dateVal);
        this.props.onTimeChange(undefined);
    };

    onNumResultsChange = (e) =>{
        this.props.setResPerPage(e.target.value);
        this.props.onNumChange();
    };

    render() {
        const {sortBy, uploadDate, resultsPerPage} = this.props.filters;
        return(
            <nav>
                <div className="VLF-1 nav-wrapper row">
                    <div className="input-field col s4 m2">
                        <select ref="sortbyDropdown" value={sortBy} onChange = {this.onSortChange}>
                            <option value="relevance">Relevance</option>
                            <option value="viewCount">Popularity</option>
                            <option value="date">Most Recent</option>
                            <option value="title">Title (A-Z)</option>   
                        </select>
                        <label>Sort by</label>
                    </div>
                    <div className="input-field col s4 m2">
                        <select ref="timeDropdown" value={uploadDate} onChange={this.onDateChange}>
                            <option value="today">Today</option>
                            <option value="week">This week</option>
                            <option value="month">This month</option>
                            <option value="year">This year</option>
                            <option value="fiveYears">Less 5 years</option>
                            <option value="allTime">All</option>
                        </select>
                        <label>Upload date</label>
                    </div>
                    <div className="input-field col s4 m3">
                        <p className="range-field">
                                <input 
                                    value={resultsPerPage}
                                    onChange={this.onNumResultsChange}
                                    type="range" 
                                    id="searchNum" 
                                    min="1" max="50" 
                                />
                        </p>
                        <label>Hits Per Page ({resultsPerPage}/50)</label>
                    </div>
                    <div className="input-field col s3 m1 offset-m1">
                        <label className="chk-label">
                            <input type="checkbox" />
                            <span></span>
                        </label>
                        <img className="responsive-img" />
                    </div>
                    <div className="input-field col s3 m1">
                        <label className="chk-label">
                            <input type="checkbox" />
                            <span></span>
                        </label>
                        <img className="responsive-img" />
                    </div>
                    <div className="input-field col s3 m1">
                        <label className="chk-label">
                            <input type="checkbox" />
                            <span></span>
                        </label>
                        <img className="responsive-img" />
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) =>({
    filters: state.filters
});

const mapDispatchToProps = (dispatch)=>({
    setSortBy: (text)=> dispatch(setSortBy(text)),
    setUploadDate: (text)=> dispatch(setUploadDate(text)),
    setResPerPage: (num)=> dispatch(setResPerPage(num))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoListFilters);