import _ from 'lodash';
import React, {Component} from 'react'
import moment from 'moment';
import {connect} from 'react-redux';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import {setStartDate, setEndDate, setTextFilter, toggleIsSavedFilter } from '../actions/filters';
import DeletionModal from './DeletionModal';
import {startClearVideoHistory} from '../actions/videos';

export class HistoryListFilters extends Component{
    
    state={
        calendarFocused: null,
        checked: false,
        showModal: false,
        message: 'video history'
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
        this.props.toggleIsSavedFilter(!this.state.checked);
        this.setState(prevState => ({checked: !prevState.checked}));
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
                        <div className="col s5">
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
                        <div className="col s2">
                            <div className="switch">
                                <label>
                                <input 
                                    onChange={this.onSwitchChange} 
                                    defaultChecked={this.state.checked}
                                    type="checkbox" 
                                />
                                <span className="lever"></span>
                                    Liked
                                </label>
                            </div>
                        </div>
                        <div className="col s4">
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
                        <div className="col s1">
                            <i className="material-icons" onClick={this.handleOpenModal}>delete_forever</i>
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
    startClearVideoHistory: ()=> dispatch(startClearVideoHistory())
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryListFilters);
