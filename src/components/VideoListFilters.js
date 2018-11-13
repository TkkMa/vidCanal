import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {setSortBy, setUploadDate, setPlayer, setResPerPage} from '../actions/filters';

export class VideoListFilters extends Component {

    componentDidMount(){
        $('select').formSelect();
    }

    onSortChange = (e) =>{
        const sortVal = e.target.value;
        this.props.setSortBy(sortVal);
        this.props.onSortByTimeChange()
    };

    onDateChange = (e) =>{
        const dateVal = e.target.value;
        this.props.setUploadDate(dateVal);
        this.props.onSortByTimeChange();
    };

    onNumResultsChange = (e) =>{
        this.props.setResPerPage(e.target.value);
        this.props.onNumChange();
    };

    render() {
        const {sortBy, uploadDate, playerChecked} = this.props.filters;
        const {resultsPerPage} = this.props.page;
        const logoURL = {
            D: "/images/d_dailymotion.jpg",
            V: "/images/vimeo_icon_dark.png",
            YT:"/images/yt_icon_mono_light.png"
        }
        return(
            <nav>
                <div className="VLF-1 nav-wrapper row">
                    <div className="input-field col s4 m4 l2 xl2">
                        <select value={sortBy} onChange = {this.onSortChange}>
                            <option value="relevance">Relevance</option>
                            <option value="viewCount">Popularity</option>
                            <option value="date">Most Recent</option>
                            <option value="title">Title (A-Z)</option>   
                        </select>
                        <label>Sort by</label>
                    </div>
                    <div className="input-field col s3 m4 l2 xl2">
                        <select value={uploadDate} onChange={this.onDateChange}>
                            <option value="today">Today</option>
                            <option value="week">This week</option>
                            <option value="month">This month</option>
                            <option value="year">This year</option>
                            <option value="fiveYears">Less 5 years</option>
                            <option value="allTime">All</option>
                        </select>
                        <label>Upload date</label>
                    </div>
                    <div className="input-field col s5 m4 l3 xl3">
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
                    {
                        Object.keys(this.props.valueCheck).map(key=>(
                            <div key={key} className="input-field col s3 m2 l1 xl1 right">
                                <label className="chk-label">
                                    <input type="checkbox"
                                        name={key} 
                                        className="filled-in"
                                        onChange={this.props.onPlayerCheck}
                                        checked={this.props.valueCheck[key]}
                                    />
                                    <span></span>
                                </label>
                                <img className="responsive-img" src={logoURL[key]}/>
                            </div>                           
                        ))
                    }
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) =>({
    filters: state.filters,
    page: state.page
});

const mapDispatchToProps = (dispatch)=>({
    setSortBy: (text)=> dispatch(setSortBy(text)),
    setUploadDate: (text)=> dispatch(setUploadDate(text)),
    setResPerPage: (num)=> dispatch(setResPerPage(num)),
    setPlayer: (choice)=> dispatch(setPlayer(choice))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoListFilters);