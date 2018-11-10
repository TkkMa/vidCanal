import _ from 'lodash';
import React, {Component} from 'react'
import moment from 'moment';
import {connect} from 'react-redux';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import {setStartDate, setEndDate, setTextFilter, toggleIsSavedFilter, toggleSearchKeyFilter} from '../actions/filters';
import DeletionModal from './DeletionModal';
import {startClearVideoHistory} from '../actions/videos';

export class HistoryListFilters extends Component{
    
    state={
        calendarFocused: null,
        showModal: false,
        message: 'video history'
    }

    componentDidMount(){
        $('.sidenav').sidenav({
            preventScrolling: false
        })
    }

    onDatesChange = ({startDate, endDate}) =>{
        this.props.setStartDate(startDate);
        this.props.setEndDate(endDate);
    }

    onFocusChange = (calendarFocused)=>{
        this.setState(()=>({calendarFocused}));
    }

    onTextChange = (e)=>{
        this.props.setTextFilter(e.target.value);
    }

    onSwitchChange = ()=>{
        this.props.toggleIsSavedFilter(!this.props.filters.isSaved);
    }

    submitHandler= (e)=>{
        e.preventDefault();
    }
    
    clearText= (e)=>{
        $(e.target).siblings('#search').val('');
        this.props.setTextFilter('');
    }

    handleOpenModal=()=>{
        this.setState({showModal: true});
    }

    handleCloseModal=()=>{
        this.setState({showModal: false});
    }

    clearList = ()=>{
        this.props.startClearVideoHistory();
        this.handleCloseModal();
    }

    render(){
        const onTextChange = _.debounce((text)=>{this.onTextChange(text)}, 300);
        return(
            <div>
                <nav className='HLF-1'>
                    <div className="nav-wrapper row">
                        <div className="col s12 m8 l6 xl5">
                            <DateRangePicker
                                startDate={this.props.filters.startDate} // momentPropTypes.momentObj or null,
                                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                endDate={this.props.filters.endDate} // momentPropTypes.momentObj or null,
                                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
                                focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                                showClearDates={true}
                                isOutsideRange={day=> moment(day).startOf('day').isAfter()}
                                withPortal={true}
                                displayFormat={()=> "DD/MM/YYYY"}
                            />
                        </div>
                        <div className="col s4 m4 l2 xl2">
                            <div className="switch">
                                <label>
                                <input 
                                    onChange={this.onSwitchChange} 
                                    defaultChecked={this.props.filters.isSaved}
                                    type="checkbox" 
                                />
                                <span className="lever"></span>
                                    Liked
                                </label>
                            </div>
                        </div>
                        <div className="col s6 m10 l2 xl3">
                            <form id="historyForm" onSubmit={this.submitHandler} className="right">
                                <div id="historySearchBar" className="right input-field">
                                    <input 
                                        onChange={this.onTextChange}
                                        value={this.props.filters.text} 
                                        id="search" type="search" required
                                        placeholder="Search term" 
                                    />
                                    <label className="label-icon" for="search"><i className="material-icons">search</i></label>
                                    <i className="material-icons" onClick={this.clearText}>close</i>
                                </div>
                            </form>
                        </div>
                        <div className="col s1 m1 l1 xl1">
                            <button data-target="slide-out" className="sidenav-trigger btn btn-flat">
                                <i className="material-icons">list</i>
                                {(this.props.filters.searchKeyFilter.length)? <i className="material-icons">check_circle</i>: <i/>}
                            </button>
                        </div>
                        <div className="col s1 m1 l1 xl1">
                            <button onClick={this.handleOpenModal} className="btn btn-flat">
                                <i className="material-icons">delete_forever</i>
                            </button>
                        </div>
                    </div>
                </nav>
                <DeletionModal
                    showModal={this.state.showModal}
                    handleCloseModal={this.handleCloseModal}
                    clearList={this.clearList}
                    message={this.state.message}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    filters: state.filters
});

const mapDispatchToProps = (dispatch)=>({
    setStartDate: (startDate)=> dispatch(setStartDate(startDate)),
    setEndDate: (endDate)=> dispatch(setEndDate(endDate)),
    setTextFilter: (text) => dispatch(setTextFilter(text)),
    toggleIsSavedFilter: (isSaved)=> dispatch(toggleIsSavedFilter(isSaved)),
    toggleSearchKeyFilter: (isSearchByKey)=> dispatch(toggleSearchKeyFilter(isSearchByKey)),
    startClearVideoHistory: ()=> dispatch(startClearVideoHistory())
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryListFilters);
