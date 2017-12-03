'use strict';

import './style/main.scss';

import React from 'react';
import ReactDom from 'react-dom'
import superagent from 'superagent'

class SearchForm extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            redditBoard: '',
            limit: '',
            topics: []
        }

        this.handleBoardChange = this.handleBoardChange.bind(this);
        this.handleLimitChange = this.handleLimitChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    //functions to handle form state
    handleBoardChange(e) {
        // console.log('work dammit');
        this.setState({ redditBoard: e.target.value });
    }

    handleLimitChange(e) {
        this.setState({ limit: e.target.value });
    }

    
    handleSubmit(e) {
        e.preventDefault();
    
        this.props.boardSelect(this.state.redditBoard);
    
        superagent
          .get(`https://www.reddit.com/r/${this.state.redditBoard}.json?limit=${this.state.limit -1}`)
          .then(result => {
            let requests = result.body.data.children;
            console.log(requests);
            return this.props.renderRequest(requests);
            
          })
          .catch(err => {
            console.log(err);
                    
          });
      }
    

    render() {
        // console.log(this.state);
        //form to input data and limit returns
        return (
          <div>
            <form onSubmit={this.handleSubmit} >
              <input
                type='text'
                name='redditBoard'
                placeholder='redditBoard'
                value={this.state.redditBoard}
                onChange={this.handleBoardChange}
              />
            <input
            type='number'
            name='limit'
            placeholder='number of results (1-100)'
            min='1'
            max='100'
            value={this.state.limit}
            onChange={this.handleLimitChange}
            />
             <button onClick={this.handleSubmit}>Search Reddit</button>
            </form>
            </div>
        );
      }
}

class SearchResults extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            //any variable will work for the map but i is the tracker or key.
            <ul>
                {this.props.topicsReturn.map((item, i) => {
                    return (
                        <li key={i}>
                            <a href={item.data.url}>

                            <p>{item.data.title}</p>

                            <p>{item.data.usp}</p>

                            </a>
                        </li>
                    )
                })}
            </ul>
        )
    }
}



class App extends React.Component {
    
    constructor(props) { 
        super(props);
        this.state = {
            topics: [],
            boardSelected: null,
            boardError: null
        }

        this.renderRequest = this.renderRequest.bind(this);
        this.boardSelect = this.boardSelect.bind(this);
    };

    renderRequest(requests) {
        this.setState({ topics: requests });
    }

    boardSelect() {
        if (!this.state.topics[name]) {
            this.setState({
              boardSelected: null,
              boardError: name
            });
          } else {
            superagent
              .get(this.state.topics[name])
              .then(res => {
                this.setState({
                  boardSelected: res.body,
                  boardError: null
                });
              })
              .catch(console.error);
          }
     }
    
    
    render() {

        return (
            <div>
                <h1> Find Sub-Reddit Boards</h1>
                
                <SearchForm
                boardSelect={this.boardSelect}
                renderRequest={this.renderRequest}
                />
                
                <SearchResults topicsReturn={this.state.topics} />
            </div>
        )
    }
    
}

ReactDom.render(<App/>, document.getElementById('root'));


