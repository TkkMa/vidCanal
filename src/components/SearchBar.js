import React, {Component} from 'react';

export class SearchBar extends Component {
    componentDidMount(){
        if(this.input){
            this.input.focus();
        }
    }
    render(){
        const {onChange, value, onSubmit} = this.props;
        return(
            <div className="row SB-1">
                <form onSubmit={onSubmit} className="col s12">
                    <div className="input-field col s10 m6 offset-m3 search-bar">
                        <input
                        type='text' 
                        value={value}
                        onChange={onChange}
                        placeholder='Search videos'
                        ref={el => this.input= el}
                        />                                     
                    </div>
                    <div className="input-field col s2 m1">
                        <button className="btn waves-effect waves-light btn-small right" type="submit" name="action">
                            <i className="material-icons">search</i>
                        </button>                
                    </div>
                </form>  
            </div>
        )
    }
}

export default SearchBar;