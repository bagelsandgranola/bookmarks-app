// local bookmarks API as API_ENDPOINT 

// create new Route that will contain a form for editing bookmarks

// create a component that contains a form for updating bookmarks

// on list of bookmarks, add button on each bookmark 
//that links to the edit route for that bookmark
    //use either: Link from react-router-dom
    //or use a button that calls history.push when it's clicked

// edit bookmark should submit a PATCH to bookmarks-server w/ new values

// if the PATCH request is successful,
//update bookmark stored in context with new values
//redirect user back to the list of bookmarks 
//

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
import BookmarksContext from './BookmarkContext'
import EditBookmark from './EditBookmark/EditBookmark'


class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm => 
      bm.id !== bookmarkId
      )
      this.setState({
        bookmarks: newBookmarks
      })
  }

  updateBookmark = updatedBookmark => {
    const newBookmarks = this.state.bookmarks.map(bookmark => 
      (bookmark.id === updatedBookmark.id)
        ? updatedBookmark
        : bookmark
      )
      console.log(updatedBookmark.id)
      console.log(newBookmarks)
      this.setState({
        bookmarks: newBookmarks
      })
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route
              path='/add-bookmark'
              component={AddBookmark}
            />
            <Route
              exact
              path='/'
              component={BookmarkList}
            />
            <Route
                path ='/edit/:bookmark_id'
                component={EditBookmark}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
